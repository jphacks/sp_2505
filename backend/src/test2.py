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

df = pd.read_csv('distance_matrix.csv')

