import React from 'react';
import { StyleSheet } from 'react-native';
import { Atom } from '@tamagui/lucide-icons';
import { Text, View } from 'tamagui'
import { OpenFilterScreen } from './index.tsx'

const Filter = () => {
  // OpenFilterScreen()



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World!</Text>
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
});

export default Filter;