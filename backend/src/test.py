from collections import deque
import heapq
from itertools import combinations
from math import atan2, cos, cosh, radians, sin, sqrt

import pandas as pd
from tqdm import tqdm
import numpy as np
import numpy.typing as npt
from sklearn.cluster import DBSCAN
from scipy.spatial import KDTree


df = pd.read_csv('coords.csv', header=None)
df.columns = ['lat', 'lon']

lat = 43.0711149
lon = 141.3477839

coords: list[tuple[float, float]] = [(la, lo) for la, lo in df.values.tolist()]

# 緯度経度 → メートル単位距離に換算（札幌あたりならこの係数で近似OK）
def latlon_to_xy(lat: npt.NDArray[np.float32], lon: npt.NDArray[np.float32], lat0: float = 43.06):  # 札幌の緯度基準
  R = 6371000
  x = R * np.deg2rad(lon) * np.cos(np.deg2rad(lat0))
  y = R * np.deg2rad(lat)
  return np.column_stack([x, y])

coords_np = np.array(coords)  # [[lat, lon], ...]
print(coords_np.shape)
xy = latlon_to_xy(coords_np[:,0], coords_np[:,1])

r = 200  # [m] 以内なら同一点扱い

delete: set[int] = set()
for i, j in combinations(range(len(coords)), 2):
  if i in delete or j in delete:
    continue

  if np.sqrt(np.sum((xy[i] - xy[j])**2)) < 300:
    delete.add(j)

clusters = set(list(range(len(coords))))
clusters -= delete

coords_np_ = coords_np[list(clusters)]
print(coords_np_.shape)
df_ = pd.DataFrame(coords_np_, columns=['lat', 'lon'])
df_.to_csv('coords4.csv', header=None)
