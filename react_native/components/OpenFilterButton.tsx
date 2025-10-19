// src/components/FilterButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import HumanWalk from "../assets/images/mdi--human-walk.png"

// ボタンが受け取るプロパティの型を定義
type OpenFilterButtonProps = {
  onPress: () => void;
};

const OpenFilterButton: React.FC<OpenFilterButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={HumanWalk} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // position: 'absolute', // 地図の上に配置するために絶対位置を指定
    // bottom: -90,
    // right: 155,
    backgroundColor: '#007AFF', // iOSの標準的な青色
    width: 80,
    height: 80,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    // 影を付けて立体感を出す
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // zIndex: 100,
  },
  icon: {
    width: 55,
    height: 55,
    tintColor: 'white',
  }
});

export default OpenFilterButton;