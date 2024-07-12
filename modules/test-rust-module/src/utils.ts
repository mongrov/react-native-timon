export const extractTableName = (sqlQuery: string): string => {
  try {
    const regex = /(?:FROM|JOIN)\s+[`"]?(\w+)[`"]?/gi;
    const matches = [...sqlQuery.matchAll(regex)];
    const tableNames = matches.map(match => match[1]).filter(Boolean);

    if (tableNames.length === 1) {
      return tableNames[0];
    } else if (tableNames.length > 1) {
      console.error('Multiple table names found in the SQL query.');
    } else {
      console.error('No table name found in the SQL query.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
  return '';
};

export const getFilePath = (tableName: string): string => {
  const BASE_PATH = "/data/data/com.sodium.reactnativetimon/files/tmp/timon/";
  const insertionDate = new Date().toISOString().split('T')[0];
  const filePath = BASE_PATH + `${tableName}_${insertionDate}.parquet`;
  return filePath;
}

export const parseJson = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', jsonString, error);
  }
}
