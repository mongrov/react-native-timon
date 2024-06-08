import Greptime from 'greptime'

let { sql } = Greptime({
  host: 'http://localhost:4000',
  dbname: 'public',
  username: '',
  password: '',
})

export const createTestTable = async () => {
  try {
    const tableSchema = {
      timeIndex: 'ts',
      tags: ['tag1', 'tag2'],
      fields: ['temperature', 'humidity'],
    }
    await sql.createTable('temperature_table', tableSchema)
  } catch(error) {
    console.error("Error Creating TemperatureTable:", error);
  }
}

export const fetchTemperature = async (limit: number = 60) => {
  try {
    const demoSQL = await sql.select('*').from('temperature_table').limit(limit).orderBy('ts', 'DESC').query()
    return demoSQL.rows
  } catch(error) {
    console.error("Error Fetching TemperatureTable:", error);
  }
}

export const temperatureTableSize = async () => {
  try {
    const tempCount = await sql.from('temperature_table').count();
    return tempCount;
  } catch(error) {
    console.error("Error Getting TemperatureTable Size:", error);
  }
}
