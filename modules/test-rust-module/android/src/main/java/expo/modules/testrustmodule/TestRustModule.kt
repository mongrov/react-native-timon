package expo.modules.testrustmodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class TestRustModule : Module() {
  companion object {
    // Load the native libraries
    init {
      try {
        System.loadLibrary("timon")
      } catch (e: UnsatisfiedLinkError) {
        e.printStackTrace()
      }
    }
  }

  // ******************************** File Storage ********************************
  external fun initTimon(storagePath: String): String
  external fun createDatabase(dbName: String): String
  external fun createTable(dbName: String, tableName: String): String
  external fun listDatabases(): String
  external fun listTables(dbName: String): String
  external fun deleteDatabase(dbName: String): String
  external fun deleteTable(dbName: String, tableName: String): String
  external fun insert(dbName: String, tableName: String, jsonData: String): String
  external fun query(dbName: String, dateRange: Map<String, String>, sqlQuery: String): String

  // ******************************** S3 Compatible Storage ********************************
  external fun initBucket(bucket_endpoint: String, bucket_name: String, access_key_id: String, secret_access_key: String): String
  external fun queryBucket(dateRange: Map<String, String>, sqlQuery: String): String
  external fun sinkMonthlyParquet(dbName: String, tableName: String): String

  override fun definition() = ModuleDefinition {
    Name("TestRustModule")

    // ******************************** File Storage ********************************
    Function("initTimon") { storagePath: String ->
      initTimon(storagePath)
    }

    Function("createDatabase") { dbName: String ->
      createDatabase(dbName)
    }

    Function("createTable") { dbName: String, tableName: String ->
      createTable(dbName, tableName)
    }

    Function("listDatabases") {
      listDatabases()
    }

    Function("listTables") { dbName: String ->
      listTables(dbName)
    }

    Function("deleteDatabase") { dbName: String ->
      deleteDatabase(dbName)
    }

    Function("deleteTable") { dbName: String, tableName: String ->
      deleteTable(dbName, tableName)
    }

    Function("insert") { dbName: String, tableName: String, jsonData: String ->
      insert(dbName, tableName, jsonData)
    }

    AsyncFunction("query") { dbName: String, dateRange: Map<String, String>?, sqlQuery: String ->
      // Ensure the dateRange contains valid "start" and "end" values
      val rustDateRange: HashMap<String, String> = if (dateRange != null && dateRange["start"] != null && dateRange["end"] != null) {
        HashMap(dateRange)
      } else {
        // Provide default date range if invalid or missing
        hashMapOf("start" to "1970-01-01", "end" to "1970-01-02")
      }
      query(dbName, rustDateRange, sqlQuery)
    }

    // ******************************** S3 Compatible Storage ********************************
    Function("initBucket") { bucket_endpoint: String, bucket_name: String, access_key_id: String, secret_access_key: String ->
      initBucket(bucket_endpoint, bucket_name, access_key_id, secret_access_key)
    }

    AsyncFunction("queryBucket") { dateRange: Map<String, String>?, sqlQuery: String ->
      // Ensure the dateRange contains valid "start" and "end" values
      val rustDateRange: HashMap<String, String> = if (dateRange != null && dateRange["start"] != null && dateRange["end"] != null) {
        HashMap(dateRange)
      } else {
        // Provide default date range if invalid or missing
        hashMapOf("start" to "1970-01-01", "end" to "1970-01-02")
      }
      queryBucket(rustDateRange, sqlQuery)
    }

    AsyncFunction("sinkMonthlyParquet") { dbName: String, tableName: String ->
      sinkMonthlyParquet(dbName, tableName)
    }
  }
}
