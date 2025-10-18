from collections import deque
from datetime import datetime as dt
import heapq
from itertools import combinations
from math import atan2, cos, cosh, radians, sin, sqrt
import os
from pathlib import Path

import dotenv
import googlemaps
import pandas as pd
from tqdm import tqdm

ROOT = Path(__file__).resolve().parents[1]

dotenv.load_dotenv(ROOT / '.env')
GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')


def haversine(lat1: float, lon1: float, lat2: float, lon2: float):
  R = 6371e3  # 地球の半径[m]
  dlat = radians(lat2 - lat1)
  dlon = radians(lon2 - lon1)
  a = sin(dlat/2)**2 + cosh(radians(lat1))*cos(radians(lat2))*sin(dlon/2)**2
  return R * 2 * atan2(sqrt(a), sqrt(1 - a))

def build_knn_graph(coords: list[tuple[float, float]], k: int = 4):
  n = len(coords)
  graph: list[list[int]] = [[] for _ in range(n)]
  for i in range(n):
    lat1, lon1 = coords[i]
    free = max(0, k - len(graph[i]))
    dists: list[tuple[float, int]] = []

    if free == 0:
      continue
    for j in range(i+1, n):
      lat2, lon2 = coords[j]
      dist = haversine(lat1, lon1, lat2, lon2)
      dists.append((dist, j))
    for _, j in heapq.nsmallest(free, dists):
      graph[i].append(j)
      graph[j].append(i)
  return graph

coords_list = pd.read_csv('coords4.csv', header=None).values[:, 1:].tolist()
coords = [(la, lo) for la, lo in coords_list]

graph = build_knn_graph(coords)

q: deque[int] = deque()
q.append(0)
vis: list[bool] = [False]*len(coords)
gmaps = googlemaps.Client(GOOGLE_MAPS_API_KEY)

dist_mat = [[0.0]*len(coords) for _ in range(len(coords))]
INF = 10**16

while q:
  pos = q.popleft()
  if vis[pos]:
    continue
  vis[pos] = True

  dests: list[int] = []
  print(len(graph[pos]))
  for dest in graph[pos]:
    if vis[dest]:
      continue

    q.append(dest)
    dests.append(dest)

  continue

  if not dests:
    continue

  origins = [coords[pos]]
  destinations = [coords[dest] for dest in dests]

  now = dt.now()

  print(origins)
  print(destinations)

  res = gmaps.distance_matrix(
    origins=origins,
    destinations=destinations,
    mode='walking',
    language='ja',
    departure_time=now
  )

  for i, row in enumerate(res['rows'][0]['elements']):
    if row['status'] == 'ZERO_RESULTS':
      d = INF
    else:
      d: float = row['distance']['value']
    dest = dests[i]
    dist_mat[pos][dest] = dist_mat[dest][pos] = d

df = pd.DataFrame(dist_mat, columns=None)
df.to_csv('distance_matrix.csv')
