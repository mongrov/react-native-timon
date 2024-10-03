/**
****** This script will automate the Build Rust code for Android and make you skip the following steps: ******
- cargo ndk --target aarch64-linux-android --platform 31 -- build --release
- cargo ndk --target armv7-linux-androideabi --platform 31 -- build --release
- cargo ndk --target i686-linux-android --platform 31 -- build --release
- cargo ndk --target x86_64-linux-android --platform 31 -- build --release
- Move compiled Rust code to expo module
- Create a new folder at /modules/<my-rust-module>/android/src/main/jniLibs
- Copy the .so files from /target/aarch64-linux-android/release to /modules/<my-rust-module>/android/src/main/jniLibs/arm64-v8a
- Copy the .so files from /target/armv7-linux-androideabi/release to /modules/<my-rust-module>/android/src/main/jniLibs/armeabi-v7a
- Copy the .so files from /target/i686-linux-android/release to /modules/<my-rust-module>/android/src/main/jniLibs/x86
- Copy the .so files from /target/x86_64-linux-android/release to /modules/<my-rust-module>/android/src/main/jniLibs/x86_64
*/

import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";

const ANDROID_TARGET_TO_DESTINATION = {
  "aarch64-linux-android": "arm64-v8a",
  "x86_64-linux-android": "x86_64",
  "i686-linux-android": "x86",
  "armv7-linux-androideabi": "armeabi-v7a",
}

const IOS_TARGET_TO_DESTINATION = {
  "aarch64-apple-ios": "ios",
  "aarch64-apple-ios-sim": "ios-sim",
}

const build_android = (target: string) => {
  console.info("Building rust library for android target: ", target);
  spawnSync(
    "cross",
    ["build", "--target", target, "--release", "-j4"],
    {
      stdio: "inherit",
    }
  );
}

const build_ios = (target: string) => {
  console.info("Building rust library for ios target: ", target);
  spawnSync(
    "cross",
    ["build", "--target", target, "--release", "-j4"],
    {
      stdio: "inherit",
    }
  );
}

const main = () => {
  process.chdir("native_rust_lib");
  Object.keys(ANDROID_TARGET_TO_DESTINATION).forEach(build_android);
  // Object.keys(IOS_TARGET_TO_DESTINATION).forEach(build_ios);
  process.chdir("..");

  Object.entries(ANDROID_TARGET_TO_DESTINATION).forEach(([target, architecture]) => {
    console.info('Moving rust library for android target: ', target);
    const sourcePath = path.join( // Ensure the path matches the library location on your filesystem
      process.cwd(),
      'native_rust_lib',
      "target",
      target,
      "release",
      "libtimon.so"
    );
    const architecturePath = path.join( // Ensure the path matches the library location on your filesystem
      process.cwd(),
      "modules",
      "test-rust-module",
      "android",
      "src",
      "main",
      "jniLibs",
      architecture
    );
    if (!fs.existsSync(architecturePath)) {
      fs.mkdirSync(architecturePath, { recursive: true });
    }
    fs.copyFileSync(
      sourcePath,
      path.join(architecturePath, "libtimon.so")
    );
  });
}

main();
