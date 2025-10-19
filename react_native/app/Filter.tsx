import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, Button } from 'tamagui'
import { OpenFilterScreen } from './index.tsx'
import { useRef, useEffect } from 'react'
import { useRouter } from 'expo-router'

export default function Filter() {
  // OpenFilterScreen()
  // const navigation = useNavigation()
  // const filterRef = useRef<BottomSheetModal>(null)
  // const snapPoints = useMemo(() => ['25%', '50%', '80%'],)
  const router = useRouter()

  // useEffect(() => {
  //   filterRef.current?.present()
  // },)

  // const handleSheetChanges = useCallback(
  //   (index: number) => {
  //     if (index === -1) {
  //       navigation.goBack()
  //     }
  //   },
  //   [navigation]
  // )

  // const renderBackdrop = useCallback(
  //   (props: any) => (
  //     <BottomSheetBackdrop
  //       {...props}
  //       disappearsOnIndex={-1}
  //       appearsOnIndex={0}
  //       pressBehavior="close"
  //     />
  //   ),
  // )

  return (
    // <BottomSheetModal
    //   ref={filterRef}
    //   index={0}
    //   snapPoints={snapPoints}
    //   onChange={handleSheetChanges}
    //   backdropComponent={renderBackdrop}
    //   hancleStyle={styles.handle}
    //   backgroundStyle={styles.background}
    // >
    //   <BottomSheetNavigator />
    // </BottomSheetModal>
    // <View style={styles.container}>
    //   <Text style={styles.title}>Hello World!</Text>
    // </View>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24 }}>制約条件の画面</Text>
      <Button title="閉じる" onPress={() => router.back()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  handle: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  background: {
    backgroundColor: '#ffffff',
  },
});

export default Filter;