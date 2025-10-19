from bisect import bisect_left
import json
from math import atan2, cos, cosh, radians, sin, sqrt
import os
from pathlib import Path
from random import choice

import dotenv
from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
import numpy as np
import pandas as pd
import googlemaps
import polyline

from src.optimizer import optimize
from src.schemas.schema import RouteRequest


ROOT = Path(__file__).resolve().parents[2]
dotenv.load_dotenv(ROOT / '.env')

GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY')
gmaps = googlemaps.Client(GOOGLE_MAPS_API_KEY)

router = APIRouter(prefix='/api')

def haversine(lat1: float, lon1: float, lat2: float, lon2: float):
  R = 6371e3  # 地球の半径[m]
  dlat = radians(lat2 - lat1)
  dlon = radians(lon2 - lon1)
  a = sin(dlat/2)**2 + cosh(radians(lat1))*cos(radians(lat2))*sin(dlon/2)**2
  return R * 2 * atan2(sqrt(a), sqrt(1 - a))

def decode_path(path: list[int], start: tuple[float, float]):
  dest = path[-1]
  path = path[1:-1]

  coords_list = pd.read_csv(ROOT / 'input/coords.csv', header=None).values[:, 1:].tolist()
  parks = pd.read_csv(ROOT / 'input/parks.csv', header=None).values[:, 1:].tolist()

  destination = parks[dest-len(coords_list)-1]

  waypoints = [tuple(coords_list[i]) for i in path]

  resp = gmaps.directions(
    origin=start,
    destination=destination,
    mode='walking',
    waypoints=waypoints if waypoints else None,
    # optimize_waypoints=optimize_waypoints,
    alternatives=False,
    # avoid=avoid,
    units='metric',
    language='ja'
  )

  if not resp:
    return None

  # choose first route by default (or handle alternatives)
  route = resp[0]

  # total distance / duration (sum over legs)
  total_distance_m = 0
  total_duration_s = 0
  legs_info = []
  for leg in route.get('legs', []):
    leg_dist = leg['distance']['value']      # meters
    leg_dur = leg['duration']['value']       # seconds
    total_distance_m += leg_dist
    total_duration_s += leg_dur
    legs_info.append({
      # 'start_address': leg.get('start_address'),
      # 'end_address': leg.get('end_address'),
      'distance_m': leg_dist,
      'duration_s': leg_dur,
      'steps': [{
        'instruction': step.get('html_instructions'),
        'distance_m': step['distance']['value'],
        'duration_s': step['duration']['value'],
        # step polyline:
        # 'polyline': step.get('polyline', {}).get('points')
      } for step in leg.get('steps', [])]
    })

  # overview_polyline: encoded polyline for whole route
  encoded_overview = route.get('overview_polyline', {}).get('points')
  overview_points = polyline.decode(encoded_overview) if encoded_overview else []

  # If optimize_waypoints True, API returns waypoint_order (new order of indices)
  waypoint_order = route.get('waypoint_order', None)

  return {
    'legs': legs_info,
    'total_distance_m': total_distance_m,
    'total_duration_s': total_duration_s,
    # 'overview_polyline_encoded': encoded_overview,
    # 'overview_polyline_points': overview_points,
    # 'waypoint_order': waypoint_order,
    # 'raw_route': route,
    # 'raw_response': resp
  }

@router.post(path='/route')
async def route(req: RouteRequest):
  lat = req.lat
  lon = req.lon
  distance = req.distance
  time = req.time
  preference = req.preference

  if time is not None:
    distance = time * 200
  elif distance is not None:
    distance *= 1000
  else:
    return JSONResponse({
      'error': 'Exactly one of time or distance must be a valid number.'
    }, status_code=400)

  if preference == 'restaurants':
    return JSONResponse({
      'error': 'wip'
    }, 400)
  elif preference == 'hot_springs':
    return JSONResponse({
      'error': 'wip'
    }, 400)
  elif preference == 'parks':
    coords_list = pd.read_csv(ROOT / 'input/parks.csv', header=None).values[:, 1:].tolist()
  elif preference == 'landmarks':
    coords_list = pd.read_csv(ROOT / 'input/landmarks.csv', header=None).values[:, 1:].tolist()
  else:
    return JSONResponse({
      'error': 'Given preference is not available.'
    }, 404)

  coords = [(la, lo) for la, lo in coords_list]
  coords_enu = list(enumerate(coords))
  coords_enu.sort(key=lambda x: haversine(lat, lon, x[1][0], x[1][1]))

  l = 0
  r = len(coords)
  lim = max(0, distance-3500)
  while r-l>1:
    m = (r+l)//2
    lat2, lon2 = coords_enu[m][1]
    if haversine(lat, lon, lat2, lon2) <= lim:
      l = m
    else:
      r = m

  idx = l
  coords_enu = coords_enu[idx:]
  if not coords_enu:
    return JSONResponse({
      'error': 'No place found.'
    }, status_code=404)

  idx, _ = choice(coords_enu)

  path = optimize((lat, lon), 650+idx, distance)
  if path == -1:
    return JSONResponse({
      'error': 'Optimization failed.'
    }, status_code=404)

  desc = decode_path(path, (lat, lon))
  if desc is None:
    return JSONResponse({
      'error': 'No route found.'
    }, status_code=404)

  print(desc)

  return JSONResponse(desc, status_code=200)
