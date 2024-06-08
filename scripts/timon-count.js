const Greptime = require('greptime');

let { sql } = Greptime({
  host: 'http://localhost:5000',
  dbname: 'public',
  username: '',
  password: '',
})

const main = async () => {
  const tempCount = await sql.from('temperature_table').count();
  console.log("Temperature Table Count:", tempCount);
}

main();
