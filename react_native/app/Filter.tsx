import React, { useState, useCallback } from 'react';
import { TextInput, Button, StyleSheet, Alert, Switch, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, View } from 'tamagui'
import { getCurrentPositionAsync } from 'expo-location'
import TabOneScreen from './(tabs)/index.tsx'

const genresData = [
  { name: '観光地', image: require('../assets/images/kannkouti.jpg') },
  { name: '温泉', image: require('../assets/images/onnsenn.jpg') },
  { name: 'レストラン', image: require('../assets/images/food.jpg') },
  { name: '公園', image: require('../assets/images/park.jpg') },
];

const Filter = () => {

  const [distance, setDistance] = useState(5);
  const [time, setTime] = useState(30);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [toggleHome, setToggleHome] = useState(false);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = useCallback(() => {
    // console.log('送信データ:', {
    //   distance,
    //   time,
    //   selectedGenres,
    //   toggleHome,
    // });
    // alert('条件が送信されました！');
    sendFilter(distance, time)
  }, []);

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>

        {/* ===== 時間・距離 ===== */}
        <Text style={styles.sectionTitle}>時間・距離</Text>

        {/* ===== 距離・時間入力 ===== */}
        <View style={styles.inputRow}>
          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => setDistance(Math.max(distance - 1, 0))}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <View style={styles.inputBox}><Text>{distance} km</Text></View>
          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => setDistance(distance + 1)}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputRow}>
          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => setTime(Math.max(time - 5, 0))}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <View style={styles.inputBox}><Text>{time} 分</Text></View>
          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => setTime(time + 5)}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>

        {/* ===== ジャンル（写真付き） ===== */}
        <Text style={styles.sectionTitle}>ジャンル</Text>
        <View style={styles.genreRow}>
          {genresData.map((genre) => {
            const selected = selectedGenres.includes(genre.name);
            return (
              <TouchableOpacity
                key={genre.name}
                style={[styles.genreCard, selected && styles.genreCardSelected]}
                onPress={() => toggleGenre(genre.name)}
              >
                <Image source={genre.image} style={styles.genreImage} resizeMode="cover" />
                <Text style={[styles.genreText, selected && styles.genreTextSelected]}>
                  {genre.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ===== トグルオプション ===== */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleText}>開始地点を最終目的地とする</Text>
          <Switch value={toggleHome} onValueChange={setToggleHome} />
        </View>
        <Text style={styles.note}>※ 自宅に帰って来たい時などに使うオプションです</Text>
      </ScrollView>

      {/* 画面下部の送信ボタン */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>送信</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },

  container: { flex: 1, padding: 20 },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },

  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  inputButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  inputBox: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  genreRow: { flexDirection: 'row', flexWrap: 'wrap' },
  genreCard: {
    width: '45%',
    margin: '2.5%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  genreCardSelected: {
    borderColor: '#6a4bc4',
    backgroundColor: '#f3f0ff',
  },
  genreImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 6,
  },
  genreText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  genreTextSelected: {
    color: '#6a4bc4',
    fontWeight: 'bold',
  },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  toggleText: { fontSize: 16 },
  note: { fontSize: 12, color: '#666', marginTop: 4 },

  // 下部固定送信ボタン
  submitButton: {
    backgroundColor: '#6a4bc4',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const sendFilter = (distance, time) => {

  // const [inputText, setInputText] = useState('');

  // POSTリクエストを送信する非同期関数
  const sendDataToServer = async () => {
    // 送信するデータが空の場合は何もしない
    const location = await getCurrentPositionAsync()
    const { latitude, longitude } = location.coords

    // ここをあなたのPCのIPアドレスに置き換えてください
    const apiUrl = 'http://localhost:8000/api/route'; 

    try {
      const response = await fetch(apiUrl, {
        method: 'POST', // HTTPメソッド
        headers: {
          // 送信するデータ形式はJSONであることをヘッダーで示す
          'Content-Type': 'application/json',
        },
        // 送信するデータをJSON文字列に変換してbodyに設定
        body: JSON.stringify({
          lat: latitude,
          lon: longitude,
          distance: distance,
          time: null,
          preference: "parks"
        }),
      });

      // サーバーからのレスポンスをJSONとして解析
      const jsonResponse = await response.json();

      // ステータスコードが200なら成功
      if (response.status === 200) {
        Alert.alert('成功', `サーバーからの返信: ${jsonResponse.received}`);
        console.log(jsonResponse);
        
      } else {
        Alert.alert('エラー', `サーバーエラー: ${jsonResponse.error}`);
        console.log(jsonResponse);
        
      }

    } catch (error) {
      // ネットワークエラーなど
      console.error(error);
      Alert.alert('通信エラー', 'サーバーへの接続に失敗しました。');
    }
  };

  sendDataToServer()
};

export default Filter;