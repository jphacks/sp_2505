import os
from pathlib import Path
from datetime import datetime as dt
import random
import math
from heapq import heappush, heappop
from typing import cast

import dotenv
import googlemaps
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]

dotenv.load_dotenv(ROOT / '.env')
GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')
gmaps = googlemaps.Client(GOOGLE_MAPS_API_KEY)

def path_cost(graph: list[list[tuple[float, int]]], path: list[int]):
  cost = 0
  for u, v in zip(path, path[1:]):
    for w, nxt in graph[u]:
      if nxt == v:
        cost += w
        break
    else:
      # エッジが存在しない場合は破棄
      return float("inf")
  return cost

# ----------------------------
# 制限付きDFSによる detour 探索
# ----------------------------
def limited_dijkstra(
  n: int,
  graph: list[list[tuple[float, int]]],
  start: int,
  goal: int,
  base_path: list[int],
  base_cost: float,
  allow_delta: int = 3,
):
  h: list[tuple[float, int, int]] = []
  heappush(h, (0, start, 1))
  dist: list[float] = [10**16]*n
  dist[start] = 0
  parent = [-1]*n

  banned = set(base_path[1:-1])

  max_depth = 4 + allow_delta

  while h:
    d, pos, num = heappop(h)
    if dist[pos] != d:
      continue
    if num == max_depth:
      continue

    for d_, dest in graph[pos]:
      if dest == goal and num != max_depth-1:
        continue
      if dest in banned:
        continue
      if d+d_ < dist[dest]:
        dist[dest] = d+d_
        parent[dest] = pos
        heappush(h, (d+d_, dest, num+1))

  path: list[int] = []
  pos = goal
  while pos != -1:
    path.append(pos)
    pos = parent[pos]

  return dist[goal], path[::-1]


# ----------------------------
# 破壊・再構築操作（遠回りを狙う）
# ----------------------------
def detour_repair(n: int, graph: list[list[tuple[float, int]]], path: list[int], target_cost: float):
  if len(path) < 5:
    return path
  i = random.randint(1, len(path) - 3)
  j = i + 2
  a, b = path[i - 1], path[min(j, len(path) - 1)]
  base_cost = path_cost(graph, path[i - 1:j + 1])

  # detour 探索
  new_cost, new_sub = limited_dijkstra(n, graph, a, b, path[i-1:j+1], base_cost)
  # print(new_sub)
  if new_cost == 10**16:
    return path # detour見つからず

  new_path = path[:i] + new_sub[1:-1] + path[j:]
  return new_path

# ----------------------------
# ショートカット操作（偶に短縮も試す）
# ----------------------------
def shortcut(graph: list[list[tuple[float, int]]], path: list[int]):
  if len(path) <= 3:
    return path
  i = random.randint(1, len(path) - 2)
  a, c = path[i - 1], path[i + 1]
  for w, v in graph[a]:
    if v == c:
      return path[:i] + path[i + 1:]
  return path

# ----------------------------
# 焼きなましメイン
# ----------------------------
def simulated_annealing(
  n: int,
  graph: list[list[tuple[float, int]]],
  t: int,
  target_cost: float,
  T0: float = 100,
  alpha: float = 0.99,
  max_iter: int = 100
):
  # 初期解: 最短経路をダイクストラで求める
  cost, path = dijkstra(n, graph, t)
  print(cost)
  print(path)
  E = abs(cost - target_cost)
  best_path, best_E = path[:], E
  T = T0

  for step in range(max_iter):
    op = "detour" if random.random() < 0.8 else "shortcut"
    new_path = detour_repair(n, graph, path, target_cost) if op == "detour" else shortcut(graph, path)
    new_cost = path_cost(graph, new_path)
    if new_cost == float("inf"):
      continue
    new_E = abs(new_cost - target_cost)
    dE = new_E - E

    # メトロポリス判定
    if dE < 0 or random.random() < math.exp(-dE / (T + 1e-9)):
      path, E, cost = new_path, new_E, new_cost
      if E < best_E:
        best_path, best_E = path[:], E

    T *= alpha

    if step % 200 == 0:
      print(f"iter={step}, cost={cost:.1f}, diff={E:.1f}, best_diff={best_E:.1f}")

  return best_path, best_E

def dijkstra(n: int, G: list[list[tuple[float, int]]], t: int):
  h: list[tuple[float, int]] = []
  heappush(h, (0, n-1))
  dist: list[float] = [10**16]*n
  dist[-1] = 0
  parent: list[int] = [-1]*n
  while h:
    d, pos = heappop(h)
    if dist[pos] != d:
      continue

    for d_, dest in G[pos]:
      if d+d_ < dist[dest]:
        dist[dest] = d+d_
        heappush(h, (d+d_, dest))
        parent[dest] = pos

  path: list[int] = []
  pos = t
  while pos != -1:
    path.append(pos)
    pos = parent[pos]

  return dist[t], path[::-1]

def haversine(lat1: float, lon1: float, lat2: float, lon2: float):
  R = 6371e3  # 地球の半径[m]
  dlat = math.radians(lat2 - lat1)
  dlon = math.radians(lon2 - lon1)
  a = math.sin(dlat/2)**2 + math.cosh(math.radians(lat1))*math.cos(math.radians(lat2))*math.sin(dlon/2)**2
  return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def optimize(s: tuple[float, float], t: int, target_cost: float):
  df = pd.read_csv(ROOT / 'input/distance_matrix2.csv').drop('Unnamed: 0', axis=1)
  mat = df.values.tolist()

  n = len(mat)+1
  G: list[list[tuple[float, int]]] = [[] for _ in range(n+1)]
  for i in range(n-1):
    for j in range(i+1, n-1):
      if mat[i][j] != 0 and mat[i][j] != 10**16:
        G[i].append((mat[i][j], j))
        G[j].append((mat[i][j], i))

  coords_: list[list[float]] = pd.read_csv(ROOT / 'input/coords.csv', header=None).values[:, 1:].tolist()
  coords = [(la, lo) for la, lo in coords_]
  coords_enu = list(enumerate(coords))
  coords_enu.sort(key=lambda x: haversine(s[0], s[1], x[1][0], x[1][1]))

  origins = [s]
  destinations = coords[:6]

  now = dt.now()

  res = gmaps.distance_matrix(
    origins=origins,
    destinations=destinations,
    mode='walking',
    language='ja',
    departure_time=now,
  )

  for i, row in enumerate(res['rows'][0]['elements']):
    if row['status'] == 'ZERO_RESULTS':
      continue

    d = cast(float, row['distance']['value'])
    G[-1].append((d, coords_enu[i][0]))
    G[coords_enu[i][0]].append((d, len(G)-1))

  if len(G[-1]) == 0:
    return -1

  path, e = simulated_annealing(
    n+1,
    G,
    t,
    target_cost,
  )

  print(path)
  print(e)

  return path

# optimize(
#   (43.0749772, 141.3491784),
#   650,
#   13000,
# )
