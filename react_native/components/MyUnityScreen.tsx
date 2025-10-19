import React, { useRef, useEffect } from 'react'
import UnityView from '@azesmway/react-native-unity'
import { View } from 'tamagui'
import * as Location from 'expo-location'

type UnityViewRef = {
  postMessage: (
    gameObject: string,
    methodName: string,
    message: string
  ) => void
}

const MyUnityScreen = () => {
  const unityRef = useRef<UnityViewRef | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timer | null = null
    let isMounted = true

    const startLocationLoop = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.warn('位置情報の許可がありません')
        return
      }

      interval = setInterval(async () => {
        console.log('Sending location to Unity...');
        if (!isMounted || !unityRef.current) return

        try {
          const loc = await Location.getCurrentPositionAsync({})
          const { latitude, longitude } = loc.coords
          const payload = JSON.stringify({ latitude, longitude })

          unityRef.current.postMessage(
            'GameObject',       // Unity 側の GameObject 名
            'ReceiveMessage',   // Unity 側の public メソッド名
            payload            // JSON 文字列で送信
          )
        } catch (err) {
          console.warn('位置情報取得エラー:', err)
        }
      }, 3000)
    }

    startLocationLoop()

    return () => {
      isMounted = false
      if (interval) clearInterval(interval)
    }
  }, [])

  return (
    <View flex={1}>
      <UnityView
        ref={unityRef}
        style={{ flex: 1 }}
        onUnityMessage={(event) => {
          console.log('Unityからのメッセージ:', event.nativeEvent.message)
        }}
      />
    </View>
  )
}

export default MyUnityScreen


// import React, { useRef, useEffect } from 'react';
// import UnityView from '@azesmway/react-native-unity';
// import { useFocusEffect } from '@react-navigation/native';
// import { useCallback } from 'react';
// import { View } from 'tamagui';

// type UnityViewRef = {
//   postMessage: (gameObject: string, methodName: string, message: string) => void;
// };

// const MyUnityScreen = () => {

//   const unityRef = useRef<UnityViewRef | null>(null);

//   const message = {
//     gameObject: 'GameObject',      // Unity 側の GameObject 名
//     methodName: 'ReceiveMessage',  // Unity 側の public メソッド名
//     message: 'Hello from React Native',
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (unityRef.current) {
//         unityRef.current.postMessage(
//           message.gameObject,
//           message.methodName,
//           message.message
//         );
//       }
//     }, 1000); // 毎秒送信

//     return () => clearInterval(interval); // コンポーネントアンマウント時に停止
//   }, []);

//   return (
//   <View flex={1}>
//     <UnityView
//       ref={unityRef}
//       style={{ flex: 1 }}
//       onUnityMessage={(event) => {
//         console.log('Unityからのメッセージ:', event.nativeEvent.message);
//       }}
//     />
//   </View>
//   );
// };

// export default MyUnityScreen;