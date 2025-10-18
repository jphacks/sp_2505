import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react'
import { ExternalLink } from '@tamagui/lucide-icons'
import { Anchor, H2, Paragraph, View, Text, XStack, YStack } from 'tamagui'
import { Compass, Locate, LocateFixed } from '@tamagui/lucide-icons'
import { ToastControl } from 'components/CurrentToast'
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { getCurrentPositionAsync, getForegroundPermissionsAsync, requestForegroundPermissionsAsync } from "expo-location"
import { StyleSheet, Pressable } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import CurrentLocationButton from '@/components/CurrentLocationButton'
import Filter from './Filter';
// import OpenFilterButton from '../../components/OpenFilterButton';

export default function TabOneScreen() {
  const [initRegion, setInitRegion] = useState<Region | null>(null)
  // エラーメッセージ
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  //旧MapScreen
  const mapRef = useRef<MapView>(null);

  //旧FilterScreen
  // const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    // 位置情報のアクセス許可を取り、現在地情報を取得する

    const getCurrentLocation = async () => {
      let { status } = await getForegroundPermissionsAsync()

      if (status !== "granted") {
        const result = await requestForegroundPermissionsAsync()
        status = result.status
        if (status !== "granted"){
          setErrorMsg("位置情報へのアクセスが拒否されました")
          // 許可されない場合は東京駅を初期位置に設定
          setInitRegion({
            latitude: 35.681236,
            longitude: 139.767125,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        })}
        return
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
        setErrorMsg("現在地の取得に失敗しました。");
      }
    }
    getCurrentLocation()
    // 固定で設定したマーカー情報を設定する
  }, [])



  // ボトムシートがどの高さで止まるかを定義
  // ここでは画面の25%と85%の高さで止まるように設定
  // const snapPoints = useMemo(() => ['25%', '50%', '85%'], []);

  // ボタンが押されたときにボトムシートを開くためのコールバック関数
  // const handleOpenPress = useCallback(() => {
  //   bottomSheetRef.current?.expand();
  // }, []);
  // const handleOpenPress = () => {

  // }

  // --- レンダリング ---
  return (
    // 全体を単一のViewで囲み、構文エラーを解消
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={initRegion || undefined}
        showsUserLocation={true}
        showsMyLocationButton={false}
      />

      {/* --- 地図上に重ねるボタン要素 --- */}
      <View style={styles.buttonContainer}>
        <View style={{ marginBottom: 12 }}>
            <CurrentLocationButton mapRef={mapRef} />
        </View>
        {/* <OpenFilterButton onPress={handleOpenPress} /> */}
      </View>

      {/* --- ボトムシート --- */}
      {/* <BottomSheet
        ref={bottomSheetRef}
        index={-1} // 初期状態は閉じておく
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{
          backgroundColor: '#ffffff'
        }}
      >
        <View style={styles.contentContainer}>
          <Filter />
        </View>
      </BottomSheet> */}
    </View>
  );
}

export function OpenFilterScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // ボトムシートがどの高さで止まるかを定義
  // ここでは画面の25%と85%の高さで止まるように設定
  const snapPoints = useMemo(() => ['25%', '50%', '85%'], []);

  // ボタンが押されたときにボトムシートを開くためのコールバック関数
  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // 初期状態は閉じておく
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{
          backgroundColor: '#ffffff'
        }}
      >
        <View style={styles.contentContainer}>
          <Filter />
        </View>
      </BottomSheet>
    </View>
  )
}

// --- スタイル定義 ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject, // 画面全体にマップを表示
  },
  buttonContainer: {
    position: 'absolute', // 親要素(container)に対して絶対位置を指定
    bottom: 100, // 下からの位置
    right: 20,   // 右からの位置
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
});