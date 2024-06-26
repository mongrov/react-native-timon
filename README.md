# Quick Start for ReactNative with Rust

### How It Works
**React Native allows you to extend your JavaScript code with native modules written in Java/Kotlin for Android or Swift for iOS** (*from there you leverage the strengths of Rust within your React Native project*).

**Here's a step-by-step overview of how this integration works:**

1. JavaScript to Native Call: From your React Native (JavaScript) code, you make a call to a native module. This is done using the React Native bridge, which enables JavaScript to communicate with native code.

2. Native Code Execution: The native module is implemented in Java/Kotlin for Android or Swift for iOS. When the JavaScript code invokes a native method, the corresponding native code is executed.

3. Linking to Rust: The native code then links to the Rust code. This is typically done through a Foreign Function Interface (FFI), which allows the native code to call Rust functions. The Rust code can perform high-performance operations and return the results back to the native layer.

4. Returning Results: Once the Rust code completes its task, the results are passed back through the native layer to the JavaScript code via the React Native bridge. This allows your React Native application to utilize the performance and capabilities of Rust while maintaining the flexibility of JavaScript.

We are Using Expo Modules API for reducing the need for the library support of both old and new architectures introduced in React Native 0.68 which includes Turbo Modules and Fabric, the latter requiring significant changes due to lack of compatibility with the old system for more details check [design-considerations](https://docs.expo.dev/modules/overview/#design-considerations)

**Note:** Before your start make sure you have the following tools installed and setup `Node.js & NPM`, `Rust`, `Android Studio(SKD, NDk, emulator)`

1. Clone this project && `cd react-native-timon`
2. run `npm start`
3. install the expo app from (AppStore | PlayStore), open it and Scan the QR. or you can insatall an android studio emulator and enter the `exp://<ip-add:port>` you see on the terminal
4. run the app from emulator `npx expo run:[android | ios]`. (step 3 won't work with native modules on "Expo Go" except the ones the app ships with)

- Create expo module (optional)
    - `npx create-expo-module my-rust-module --local`
    - `npx expo prebuild`

- Create rust library (optional)
    - `cargo new --lib native_rust_lib`
    - `cd native_rust_lib`
    - add `#[no_mangle]` and `pub extern "C"` directives to functions for IOS
    - wrap the rust code with JNI

- Install Rust Android & iOS targets
    - `rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android`
    - `rustup target add aarch64-apple-ios aarch64-apple-ios-sim`

- Compile Rust code for iOS
    - `cargo build --release --target aarch64-apple-ios`
    - `cargo build --release --target aarch64-apple-ios-sim`
    - copy your `native_rust_lib.a` & `native_rust_lib.h` files from `/target/<aarch>/release` to `/modules/test-rust-module/ios/rust`
    - add `s.vendored_libraries = 'native_rust_lib.a'` to `modules/test-rust-module/ios/RustModule.podspec` file to include Rust code
    - update native swift code to use Rust code (TODO: document this part step-by-step)

- Compile Rust code(timon) for Android
    - copy the timon repository to the root directory, then run the following commands from there:
    ```
    cargo install cross --git https://github.com/cross-rs/cross
    npm run cargo:android` # for more details check scripts/cargo-android.ts
    ```
    - Update the java/kotlin RustModule to use Rust code
        - load library in `<RustModule>.kt`
        - add function type to `<RustModule>.kt`
        - define function in `<RustModule>.kt`
