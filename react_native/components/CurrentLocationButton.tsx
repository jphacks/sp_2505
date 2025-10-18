import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { Locate, LocateFixed} from '@tamagui/lucide-icons'

// このコンポーネントが受け取るPropsの型を定義します
interface CenterMapButtonProps {
  mapRef: React.RefObject<MapView>;
}

/**
 * 現在地に地図の中心を移動させるボタンコンポーネント
 * @param {CenterMapButtonProps} props - mapRefを含むProps
 */
const CenterMapButton: React.FC<CenterMapButtonProps> = ({ mapRef }) => {
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
   * ボタンが押された際の処理
   */
  const handlePress = async () => {
    // 最初に権限を確認・リクエストする
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('エラー', '位置情報の利用が許可されていません。');
      return;
    }

    // 権限がある場合、現在地を取得する
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // mapRef.currentが存在することを確認してからメソッドを呼び出す
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.015,  // ズームレベル（小さいほど拡大）
              longitudeDelta: 0.0121, // ズームレベル
            },
            1000, // 1秒かけてアニメーション
          );
        }
      },
      (error) => {
        Alert.alert('エラー', '現在地の取得に失敗しました。');
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true, // 高精度な位置情報を要求
        timeout: 15000,           // 15秒でタイムアウト
        maximumAge: 10000,        // 10秒以内のキャッシュされた位置情報を使用
      },
    );
  };

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handlePress}>
      <Image source={Locate} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute', // MapViewの上に重ねて表示
    bottom: 30,
    right: 20,
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
  icon: {
    width: 28,
    height: 28,
  },
});

export default CurrentLocationButton;