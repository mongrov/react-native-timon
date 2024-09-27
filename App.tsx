import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { writeJsonToParquet, datafusionQuerier } from './modules/test-rust-module';
import { useState } from 'react';
import uuid from 'react-native-uuid';

export default function App() {
  const [temperatureList, setTemperatureList] = useState<any[]>([]);
  const [onProcess, setOnProcess] = useState(false);

  const onRefreshTemperatureList = async () => {
    setOnProcess(() => true);
    const dateRange = { start: '2024-07-10', end: '2024-10-28' };
		const sqlQuery = `SELECT * FROM temperature ORDER BY timestamp DESC LIMIT 100`;
		const temperatureData = await datafusionQuerier(dateRange, sqlQuery);
		setTemperatureList(temperatureData);
    setOnProcess(() => false);
  }

	const insertRandomTempData = async () => {
    setOnProcess(() => true);
    await new Promise((res) => setTimeout(() => res(null), 500));
		const randomNumber = () => Number(Math.random() * 80).toFixed(2);
		const randomData = new Array(100).fill(0).map((_, index) => ({ id: uuid.v4(), timestamp: Date.now() + (index * 2), temperature: randomNumber(), humidity: randomNumber() }));
		writeJsonToParquet("temperature", randomData);
    setOnProcess(() => false);
	}

  const renderItem = ({ item }: any) => (
    <View style={styles.item}>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleDateString()} {" "}
        {new Date(item.timestamp).toTimeString().split(' ')[0]}
      </Text>
      <Text>
				Temp: {item.temperature} | Humidity: {item.humidity}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title='Refresh Temperature List' onPress={onRefreshTemperatureList} disabled={onProcess} />
      <Button title='Insert Random Temperature' color="red" onPress={insertRandomTempData} disabled={onProcess} />
			<FlatList
        data={temperatureList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  timestamp: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
