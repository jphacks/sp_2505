import requests
import json

# Overpass APIのエンドポイント
overpass_url = "https://overpass-api.de/api/interpreter"

# 札幌市北区 (ID: 4057639) と東区 (ID: 4057640) を対象とし、
# 高速道路や自動車専用道路を除外して名前付き交差点を取得するクエリ
overpass_query = """
[out:json][timeout:60];

// --- 北区・東区あたりの緯度経度 (仮) ---
area["name"="札幌市北区"]->.north;
area["name"="札幌市東区"]->.east;
(.north; .east;)->.searchArea;

// 高速道路などを除外して通常道路のみ取得
way["highway"]
  ["highway"!~"motorway|motorway_link|trunk|trunk_link|service|footway|path|cycleway|steps|pedestrian"]
  (43.05,141.30,43.17,141.45)
  ->.roads;

// roads に含まれるノードを取得
node(w.roads)->.road_nodes;

// road_nodes のうち、複数の road に属しているノード（交差点候補）を取得
way.roads(bn.road_nodes);
node(w)->.maybe_intersections;

// 出力
.maybe_intersections out body;
"""

print("札幌市北区・東区の交差点情報を取得中...")

try:
  # APIにリクエストを送信
  response = requests.get(overpass_url, params={'data': overpass_query})
  response.raise_for_status() # エラーがあれば例外を発生させる

  # 結果をJSON形式で取得
  data = response.json()

  # 取得した交差点の情報を表示
  count = len(data['elements'])
  # for element in data['elements']:
  #   if element['type'] == 'node':
  #     # 'name' タグが存在することを確認
  #     if 'tags' in element and 'name' in element['tags']:
  #       name = element['tags']['name']
  #       lat = element['lat']
  #       lon = element['lon']
  #       print(f"交差点名: {name}, 緯度: {lat}, 経度: {lon}")
  #       count += 1

  print(f"\n合計 {count} 件の交差点が見つかりました。")

except requests.exceptions.RequestException as e:
  print(f"通信エラーが発生しました: {e}")
except json.JSONDecodeError:
  print("サーバーからの応答がJSON形式ではありません。")
except Exception as e:
  print(f"予期せぬエラーが発生しました: {e}")
