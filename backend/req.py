import requests


res = requests.post('http://localhost:8000/api/route',
  json={
    'lat': 43.0749772,
    'lon': 141.3491784,
    'distance': 13,
    'time': None,
    'preference': 'parks',
  },
  headers={'Content-Type': 'application/json'}
)

print(res.status_code)
print(res.json())
