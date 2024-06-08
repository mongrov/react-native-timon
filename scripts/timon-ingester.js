const Greptime = require('greptime');
const { v4: uuidv4 } = require('uuid');
/**
 * To Set Up Port Forwarding for Android Emulator:
 *   - Forward TCP port 5000 to 4000:
 *     adb -s <emulator-ID> forward tcp:5000 tcp:4000
 * To Verify Port Forwarding:
 *   - Check the list of forwarded ports:
 *     adb -s <emulator-ID> forward --list
 * To Run this Script to Ingest Random Temperature Data:
 *   1) Directly execute the script:
 *      node scripts/timon-ingester.js
 *   2) Use PM2 to manage and monitor the script:
 *      pm2 start scripts/timon-ingester.js --name timon-ingester
 */

let { sql } = Greptime({
  host: 'http://localhost:5000',
  dbname: 'public',
  username: '',
  password: '',
})

const insertTemp = async () => {
  const randomAssetId = `fridge${Math.floor(Math.random() * 4) + 1}`;
  const randomTemp = Math.floor(Math.random() * 40);
  const randomHumidity = Math.floor(randomTemp + (randomTemp / 5));
  
  const valuesToInsert = [Date.now(), uuidv4(), randomAssetId, randomTemp, randomHumidity];
  console.log('Values to insert:', valuesToInsert); // Debugging: Print values to insert
  await sql.insert('temperature_table', valuesToInsert);
  await new Promise((resolve) => setTimeout(resolve, 10));
};

const main = async () => {
  while (true) {
    try {
      await insertTemp();
    } catch (error) {
      console.error('Script crashed with error:', error);
    }
  }
};

main();
