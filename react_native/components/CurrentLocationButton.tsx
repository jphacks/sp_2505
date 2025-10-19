import React, { useState } from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { Locate, LocateFixed} from '@tamagui/lucide-icons'

// このコンポーネントが受け取るPropsの型を定義します
interface CurrentLocationButtonProps {
  mapRef: React.RefObject<MapView>;
}

/**
 * 現在地に地図の中心を移動させるボタンコンポーネント
 * @param {CurrentLocationButtonProps} props - mapRefを含むProps
 */
const CurrentLocationButton: React.FC<CurrentLocationButtonProps> = ({ mapRef }) => {
  const [isLocating, setIsLocating] = useState(false);

  /**
   * 位置情報取得の権限をリクエストする関数
   */
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      // iOSの場合はInfo.plistでの設定が必須
      const status = await Geolocation.requestAuthorization('whenInUse');
      return status === 'granted';
    }

    // Androidの場合
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '位置情報の利用許可',
          message: '現在地を表示するために、端末の位置情報へのアクセスを許可してください。',
          buttonPositive: '許可する',
          buttonNegative: '許可しない',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  /**
   * 現在地を取得する関数 (Promiseを返す)
   */
  const getCurrentLocation = (): Promise<Geolocation.GeoPosition> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  };

  /**
   * ボタンが押された際の処理
   */
  const handlePress = async () => {
    if (isLocating) return; // 処理中の多重タップを防止

    setIsLocating(true); // ローディング開始

    try {
      // 最初に権限を確認・リクエストする
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('許可が必要です', '位置情報の利用が許可されていません。');
        return; // finallyブロックは実行される
      }

      // 権限がある場合、現在地を取得する
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;

      // mapRef.currentが存在することを確認してからメソッドを呼び出す
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          },
          1000, // 1秒かけてアニメーション
        );
      }
    } catch (error) {
      const err = error as { code: number, message: string };
      console.error(err.code, err.message);
      Alert.alert('エラー', '現在地の取得に失敗しました。端末の位置情報設定がオンになっているか確認してください。');
    } finally {
      setIsLocating(false); // ローディング終了
    }
  };

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handlePress} disabled={isLocating}>
      {isLocating ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Locate color="#000" size={40} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute', // MapViewの上に重ねて表示
    bottom: -50,
    right: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 12,
    // 影の設定
    elevation: 5, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default CurrentLocationButton;