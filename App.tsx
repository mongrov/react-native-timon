import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { hello, add, timonInit } from './modules/test-rust-module';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>ReactNative Timon {hello()}</Text>
      <Text>Add 5 + 7 from Rust: {add(5, 7)}</Text>
      <Text>timonInit: {timonInit()}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
