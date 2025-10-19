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

coords_list = pd.read_csv(ROOT / 'input/coords.csv', header=None).values[:, 1:].tolist()
coords = [(la, lo) for la, lo in coords_list]
coords_enu = list(enumerate(coords))

parks_list = pd.read_csv(ROOT / 'input/parks.csv', header=None).values[:, 1:].tolist()
parks = [(la, lo) for la, lo in parks_list]

mat = pd.read_csv(ROOT / 'input/distance_matrix.csv').drop('Unnamed: 0', axis=1).values.tolist()

delta = len(mat)

for i in range(len(mat)):
  mat[i].extend([0]*len(parks))

mat.extend([[0]*len(mat[0]) for _ in range(len(parks))])

gmaps = googlemaps.Client(GOOGLE_MAPS_API_KEY)

INF = 10**16

now = dt.now()

for j, (lat, lon) in enumerate(parks):
  coords_enu.sort(key=lambda x: haversine(lat, lon, x[1][0], x[1][1]))

  res = gmaps.distance_matrix(
    origins=[(lat, lon)],
    destinations=coords[:6],
    mode='walking',
    language='ja',
    departure_time=now,
  )

  for i, row in enumerate(res['rows'][0]['elements']):
    if row['status'] == 'ZERO_RESULTS':
      d = INF
    else:
      d: float = row['distance']['value']

    j_ = delta+j
    mat[i][j_] = mat[j_][i] = d

df = pd.DataFrame(mat)
df.to_csv(ROOT / 'input/distance_matrix2.csv')
