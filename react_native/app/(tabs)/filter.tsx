import { Text, View } from 'tamagui'

export default function TabTwoScreen() {
  return (
    <View flex={1} items="center" justify="center" bg="$background">
      <Text fontSize={20} color="$blue10">
        (一応タブとして表示) 検索条件を入力できる画面です
      </Text>
    </View>
  )
}
