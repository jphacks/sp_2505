// src/components/FilterButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import HumanWalk from "../assets/images/mdi--human-walk.png"

// ボタンが受け取るプロパティの型を定義
type OpenFilterButtonProps = {
  onPress: () => void;
};

const OpenFilterButton: React.FC<OpenFilterButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {/* <HumanWalk color="white" size={28} /> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute', // 地図の上に配置するために絶対位置を指定
    bottom: -90,
    right: 155,
    backgroundColor: '#007AFF', // iOSの標準的な青色
    width: 60,
    height: 60,
    borderRadius: 30,
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
  },
});

export default OpenFilterButton;