import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { createDatabase, createTable, listDatabases, listTables, deleteDatabase, deleteTable, query, insert, queryBucket, sinkMonthlyParquet } from './modules/test-rust-module';
import { useState } from 'react';
import uuid from 'react-native-uuid';

export default function App() {
  const [temperatureList, setTemperatureList] = useState<any[]>([]);
  const [onProcess, setOnProcess] = useState(false);

  const [databasesList, setDatabasesList] = useState([]);
  const [tablesList, setTablesList] = useState([]);

  const onRefreshTemperatureList = async () => {
    setOnProcess(() => true);
    const dateRange = { start: '2024-07-10', end: '2024-10-28' };
    const sqlQuery = `SELECT * FROM temperature ORDER BY timestamp DESC LIMIT 40`;
    
    const dbName = "test";
		const localTemperatureData = await query(dbName, dateRange, sqlQuery);

    // const cloudTemperatureData = await queryBucket(dateRange, sqlQuery);

		setTemperatureList(localTemperatureData);
    setOnProcess(() => false);
  }

	const insertRandomTempData = async () => {
    setOnProcess(() => true);
    await new Promise((res) => setTimeout(() => res(null), 500));
		const randomNumber = () => Number(Math.random() * 80).toFixed(2);
		const randomData = new Array(100).fill(0).map((_, index) => ({ id: uuid.v4(), timestamp: Date.now() + (index * 2), temperature: randomNumber(), humidity: randomNumber() }));
		insert("test", "temperature", randomData);
    setOnProcess(() => false);
	}

  const sinkMonthlyData = async () => {
    setOnProcess(() => true);
    const response = await sinkMonthlyParquet("test", "temperature");
    console.info(response);
    setOnProcess(() => false);
  }

  const renderTemperatureItem = ({ item }: any) => (
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

  const renderDBItem = ({ item }: any) => <Text>{item}</Text>
  const renderTableItem = ({item}: any) => <Text>{item}</Text>

  return (
    <View style={styles.container}>
      <Button title='Refresh Temperature List' onPress={onRefreshTemperatureList} disabled={onProcess} />
      <Button title='Insert Random Temperature' color="red" onPress={insertRandomTempData} disabled={onProcess} />
			<FlatList
        data={temperatureList}
        renderItem={renderTemperatureItem}
        keyExtractor={(item) => item.id}
      />
    
      <Text>*************** create dbs and tables ***************</Text>
      <Button title='Create "test" Database' color="green" onPress={() => console.info(createDatabase("test"))} />
      <Button title='Create "iot" Table' color="gray" onPress={() => console.info(createTable("test", "iot"))} />
      <Text>*************** list dbs and tables ***************</Text>

      <Button title='List "timon" databases' color="orange" onPress={() =>  setDatabasesList(listDatabases())} />
      <FlatList
        data={databasesList}
        renderItem={renderDBItem}
        keyExtractor={(_, index) => index.toString()}
      />
      
      <Button title='List "test" tables' color="purple" onPress={() => setTablesList(listTables("test")) } />
      <FlatList
        data={tablesList}
        renderItem={renderTableItem}
        keyExtractor={(_, index) => index.toString()}
      />

      <Text>*************** delete dbs and tables ***************</Text>
      <Button title='Delete "iot" table' color="grey" onPress={() => console.info(deleteTable("test", "iot"))} />      
      <Button title='Delete "test" database' color="green" onPress={() => console.info(deleteDatabase("test"))} />
      
      <Button title='sink data to s3' color="black" onPress={() => sinkMonthlyData()} disabled={onProcess} />
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
