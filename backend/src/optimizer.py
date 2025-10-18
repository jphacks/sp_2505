import os
from pathlib import Path
from datetime import datetime as dt
import random
import math
from heapq import heappush, heappop

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
    for nxt, w in graph[u]:
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
def limited_dfs(
  graph: list[list[tuple[int, int]]],
  start: tuple[float, float],
  goal: int,
  max_depth: int,
  min_extra=0,
  base_cost=None
):
  best_path = None
  best_cost = float("inf")
  stack = [(start, [start], 0)]
  while stack:
    node, path, cost = stack.pop()
    if len(path) > max_depth:
      continue
    if node == goal:
      if base_cost is None or cost > base_cost + min_extra:
        if cost < best_cost:
          best_cost = cost
          best_path = path[:]
      continue
    for nxt, w in graph[node]:
      if nxt not in path:
        stack.append((nxt, path + [nxt], cost + w))
  return best_path, best_cost

# ----------------------------
# 破壊・再構築操作（遠回りを狙う）
# ----------------------------
def detour_repair(graph: list[list[tuple[float, int]]], path: list[int], target_cost: float):
  if len(path) < 5:
    return path
  i = random.randint(1, len(path) - 4)
  j = i + random.choice([2, 3])
  a, b = path[i - 1], path[min(j, len(path) - 1)]
  base_cost = path_cost(graph, path[i - 1:j + 1])

  # detour 探索
  new_sub, new_cost = limited_dfs(graph, a, b, max_depth=4, base_cost=base_cost, min_extra=1)
  if new_sub is None:
    return path # detour見つからず

  new_path = path[:i] + new_sub[1:-1] + path[j:]
  return new_path

# ----------------------------
# ショートカット操作（偶に短縮も試す）
# ----------------------------
def shortcut(graph: list[list[tuple[int, int]]], path: list[int]):
  if len(path) <= 3:
    return path
  i = random.randint(1, len(path) - 2)
  a, c = path[i - 1], path[i + 1]
  for v, w in graph[a]:
    if v == c:
      return path[:i] + path[i + 1:]
  return path

# ----------------------------
# 焼きなましメイン
# ----------------------------
def simulated_annealing(
  n: int,
  graph: list[list[tuple[float, int]]],
  s: tuple[float, float],
  t: int,
  target_cost: float,
  T0: float = 100,
  alpha: float = 0.99,
  max_iter: int = 100
):
  # 初期解: 最短経路をダイクストラで求める
  cost, path = dijkstra(n, graph, s, t)
  E = abs(cost - target_cost)
  best_path, best_E = path[:], E
  T = T0

  for step in range(max_iter):
    op = "detour" if random.random() < 0.8 else "shortcut"
    new_path = detour_repair(graph, path, target_cost) if op == "detour" else shortcut(graph, path)
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

def dijkstra(n: int, G: list[list[tuple[float, int]]], s: int, t: int):
  h: list[tuple[float, int]] = []
  dist: list[float] = [10**16]*n
  dist[s] = 0
  parent: list[int] = [-1]*n
  while h:
    d, pos = heappop(h)
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

  return dist[t], path

def haversine(lat1: float, lon1: float, lat2: float, lon2: float):
  R = 6371e3  # 地球の半径[m]
  dlat = math.radians(lat2 - lat1)
  dlon = math.radians(lon2 - lon1)
  a = math.sin(dlat/2)**2 + math.cosh(math.radians(lat1))*math.cos(math.radians(lat2))*math.sin(dlon/2)**2
  return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def optimize(s: tuple[float, float], t: int, target_cost: float):
  df = pd.read_csv(ROOT / 'input/distance_matrix.csv').drop('Unnamed: 0', axis=1)
  mat = df.values.tolist()

  n = len(mat)+1
  G: list[list[tuple[float, int]]] = [[] for _ in range(n+1)]
  for i in range(n):
    for j in range(i+1, n):
      if mat[i][j] != 0 and mat[i][j] != 10**16:
        G[i].append((mat[i][j], j))
        G[j].append((mat[i][j], i))

  coords_: list[list[float]] = pd.read_csv(ROOT / 'input/coords.csv', header=None).values[:, 1:].tolist()
  coords = [(la, lo) for la, lo in coords_]
  coords.sort(key=lambda x: haversine(s[0], x[0], s[1], x[1]))

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

    d = row['distance']['value']
    ## TODO: coordsのソートが順序保持できてないので修正する


  if len(G[-1]) == 0:
    return -1
