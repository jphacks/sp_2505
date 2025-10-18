import { ExternalLink } from '@tamagui/lucide-icons'
import { Anchor, H2, Paragraph, View, XStack, YStack } from 'tamagui'
import { ToastControl } from 'components/CurrentToast'
import MapView, { Region } from 'react-native-maps'
import { useEffect, useState } from 'react'
import { getCurrentPositionAsync, getForegroundPermissionsAsync, requestForegroundPermissionsAsync } from "expo-location"

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
      } catch (error) {
        console.error("現在地情報取得エラー：", error)
      }
    }
    getCurrentLocation()
    // 固定で設定したマーカー情報を設定する
  }, [])

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
}
