import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { timonInit } from './modules/test-rust-module';
import { useEffect, useState } from 'react';
import { createTestTable, fetchTemperature, temperatureTableSize } from './services';

const initializeTimon = async () => {
  try {
    console.log("****** Init Timon Storage ******");
    await timonInit();
  } catch (error) {
    console.error("Timon Error:", error);
  }
};

initializeTimon();

export default function App() {
  const [temperatureList, setTemperatureList] = useState<any[]>([]);
  const [fetchTemperatureListAgain, setFetchTemperatureListAgain] = useState(false);

  const onRefreshTemperatureList = () => {
    setFetchTemperatureListAgain(!fetchTemperatureListAgain);
  }

  useEffect(() => {
    (async () => {
      await createTestTable();
      console.log("Temperature Table Size:", await temperatureTableSize());
    })();
  }, []);

  useEffect(() => {
    console.log("Fetch Again:", fetchTemperatureListAgain);
    (async () => {
      const temperatureListResponse = await fetchTemperature(60);
      console.log('temperatureListResponse:', temperatureListResponse);
      setTemperatureList(temperatureListResponse);
    })();
  }, [fetchTemperatureListAgain]);

  const renderItem = ({ item }: any) => (
    <View style={styles.item}>
      <Text style={styles.timestamp}>
        {new Date(item[0]).toLocaleDateString()} {" "}
        {new Date(item[0]).toTimeString().split(' ')[0]}
      </Text>
      <Text>
        {item[2]} | Temp: {item[3]} | Humidity: {item[4]}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title='Refresh Temperature List' onPress={onRefreshTemperatureList} />
      <FlatList
        data={temperatureList}
        renderItem={renderItem}
        keyExtractor={(item) => item[1]}
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
