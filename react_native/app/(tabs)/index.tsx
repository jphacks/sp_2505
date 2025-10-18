import { ExternalLink } from '@tamagui/lucide-icons'
import { Anchor, H2, Paragraph, View, XStack, YStack } from 'tamagui'
import { Compass, Locate, LocateFixed } from '@tamagui/lucide-icons'
import { ToastControl } from 'components/CurrentToast'
import MapView, { Region } from 'react-native-maps'
import { useEffect, useState } from 'react'
import { getCurrentPositionAsync, getForegroundPermissionsAsync, requestForegroundPermissionsAsync } from "expo-location"
import CurrentLocationButton from '@/components/CurrentLocationButton'
import { StyleSheet, SafeAreaView } from 'react-native'

export default function TabOneScreen() {
  const [initRegion, setInitRegion] = useState<Region | null>(null)
  // エラーメッセージ
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    // 位置情報のアクセス許可を取り、現在地情報を取得する

    const getCurrentLocation = async () => {
      const { status } = await getForegroundPermissionsAsync()


      if (status !== "granted") {
        const { status } = await requestForegroundPermissionsAsync()
        if (status !== "granted"){
          setErrorMsg("位置情報へのアクセスが拒否されました")
          return
        }
      }

      try {
        const location = await getCurrentPositionAsync({})
        // 緯度・経度はgetCurrentPositionAsyncで取得した緯度・経度
        // 緯度・経度の表示範囲の縮尺は固定値にしてます
        setInitRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        })
      }
      catch (error) {
        console.error("現在地情報取得エラー：", error)
      }
    }
    getCurrentLocation()
    // 固定で設定したマーカー情報を設定する
  }, [])

  const MapScreen = (): React.JSX.Element => {
  // MapViewコンポーネントを操作するためにuseRefでrefを作成
    const mapRef = useRef<MapView>(null);

    return (
      <SafeAreaView style={styles.container}>
        <MapView
          ref={mapRef} // 作成したrefをMapViewに渡す
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 35.681236, // 初期位置: 東京駅
            longitude: 139.767125,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true} // ユーザーの現在地を示す青い点を表示
          showsMyLocationButton={false} // デフォルトの現在地ボタンは非表示にする
        />
        {/* MapViewの上にボタンコンポーネントを配置し、refを渡す */}
        <CurrentLocationButton mapRef={mapRef} />
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  return (
    <View flex={1} items="center" justify="center" bg="$background">
      <MapView
        style={{ flex: 1, width: '100%', height: '100%'}}
        region={initRegion || undefined}
        showsUserLocation={true}
        provider="google"
      />
    </View>
  )
};