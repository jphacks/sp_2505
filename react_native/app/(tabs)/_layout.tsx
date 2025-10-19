import 'react-native-gesture-handler'
import { Image } from 'react-native'
import { Link, Tabs, Slot } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Button, useTheme } from 'tamagui'
import { Atom, BookOpenText, Home, Medal } from '@tamagui/lucide-icons'
import HumanWalk from "../../assets/images/mdi--human-walk.png"

export default function TabLayout() {
  const theme = useTheme()

  return (
    <GestureHandlerRootView>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.red10.val,
          tabBarStyle: {
            backgroundColor: theme.background.val,
            borderTopColor: theme.borderColor.val,
            height: 100,
          },
          headerStyle: {
            backgroundColor: theme.background.val,
            borderBottomColor: theme.borderColor.val,
          },
          headerTintColor: theme.color.val,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'ホーム画面',
            tabBarIcon: ({ color }) => <Home color={color as any} size={30} />,
          }}
        />
        <Tabs.Screen
        name="mission"
        options={{
          title: 'ミッション',
          tabBarIcon: ({ color }) => <Atom color={color as any} />,
        }}
        />
        <Tabs.Screen
          name="Filter"
          options={{
            title: '開始',
            tabBarIcon: ({ color, size }) => <Image source={HumanWalk} style={{width: size, height: size, tintColor: color}} />,
          }}
        />
        <Tabs.Screen
          name="logs"
          options={{
            title: 'ログ',
            tabBarIcon: ({ color }) => <BookOpenText color={color as any} size={30} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: '設定',
            tabBarIcon: ({ color }) => <Atom color={color as any} size={30} />,
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  )
}
