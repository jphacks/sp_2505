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
  Route,
  Bold
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
              width={300}
              backgroundColor="$gray10"
              borderRadius={100}
              alignSelf="center"
              marginBottom="$0"
            />
          <Sheet.Frame
            marginTop="$0"
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
                  <Route/>
                </Text>
                  <YStack space="$2">
                    <Text fontSize="$6" fontWeight="bold" >
                      10m先、右方向ですその先、100km道なりです
                    </Text>
                </YStack>
              </YStack>
          </Sheet.Frame>
        </Sheet>
      </View>
    </View>
  )
}