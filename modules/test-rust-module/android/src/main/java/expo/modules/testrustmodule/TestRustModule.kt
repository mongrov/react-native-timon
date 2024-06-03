package expo.modules.testrustmodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class TestRustModule : Module() {
  companion object {
    // Load the native library
    init {
        try {
            System.loadLibrary("native_rust_lib")
            System.loadLibrary("cmd")
      } catch (e: UnsatisfiedLinkError) {
          e.printStackTrace()
      }
    }
  }

  external fun add(a: Int, b: Int): Int

  external fun logVersions(version: String, appVersion: String): Unit

  external fun greptimeInit(): String

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('TestRustModule')` in JavaScript.
    Name("TestRustModule")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants(
      "PI" to Math.PI
    )

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! 👋"
    }

    Function("add") { a: Int, b: Int ->
      add(a, b)
    }

    Function("logVersions") { version: String, appVersion: String ->
      logVersions(version, appVersion)
    }

    Function("timonInit") {
      greptimeInit()
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }
  }
}
