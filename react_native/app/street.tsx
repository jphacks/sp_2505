import { useState } from 'react'
import {
  View,
  Button,
  Text,
  Sheet,
  XStack,
  YStack,
  ScrollView,
} from 'tamagui'
import { Link } from 'expo-router'
import {
  ArrowLeft,
  X,
  Navigation,
  NavigationOff,
} from '@tamagui/lucide-icons'
import MyUnityScreen from '../components/MyUnityScreen'

export default function StreetScreen() {
  const [open, setOpen] = useState(true)

  return (
    <View flex={1}>
      {/* UnityView を背景に配置 */}
      <View
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={0}
      >
        <MyUnityScreen />
      </View>

      {/* UIコンポーネントと Sheet を前面に配置 */}
      <View flex={1} zIndex={1} pointerEvents="box-none">
        {/* 左上に戻るボタン */}
        <Link href="/" asChild>
          <Button
            icon={<ArrowLeft />}
            position="absolute"
            top={-5}
            left={-5}
            size="$9"
            circular
            backgroundColor="transparent"
          />
        </Link>

        {/* 右上に Navigation ON/OFF ボタン */}
        <Button
          icon={open ? <Navigation /> : <NavigationOff />}
          position="absolute"
          top={-5}
          right={-5}
          size="$9"
          circular
          backgroundColor="transparent"
          onPress={() => setOpen(prev => !prev)}
        />

        {/* Sheet */}
        <Sheet
          open={open}
          onOpenChange={setOpen}
          snapPoints={[20, 50, 80]}
          snapPointsMode="percent"
          dismissOnSnapToBottom={false}
          modal={false}
          animationConfig={{
            type: 'spring',
            damping: 20,
            stiffness: 200,
            overshootClamping: true,
          }}
          zIndex={2}
        >
          <Sheet.Handle
              height={8}
              width={100}
              backgroundColor="$gray10"
              borderRadius={100}
              alignSelf="center"
              marginBottom="$4"
            />
          <Sheet.Frame
            padding="$4"
            zIndex={3}
            maxHeight="80%"
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            backgroundColor="$background"
            borderTopLeftRadius="$4"
            borderTopRightRadius="$4"
          >
            {/* スクロール可能な内容 */}
              <YStack space="$3">
                <XStack justifyContent="flex-end">
                  <Button
                    size="$2"
                    circular
                    icon={<X />}
                    onPress={() => setOpen(false)}
                  />
                </XStack>

                <Text fontSize="$5" marginTop="$2">
                  [navigation]
                </Text>

                <YStack space="$2" marginTop="$4">
                  <Text>・10m先、右方向です</Text>
                  <Text>・その先、100km道なりです</Text>
                  <Text>・交差点を左折</Text>
                  <Text>・橋を渡ります</Text>
                  <Text>・トンネルを抜けます</Text>
                  <Text>・目的地は右側にあります</Text>
                  <Text>・さらに直進して次の信号を左折</Text>
                  <Text>・坂を下って右折</Text>
                  <Text>・目的地に到着しました</Text>
                </YStack>
              </YStack>
          </Sheet.Frame>
        </Sheet>
      </View>
    </View>
  )
}