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

const TARGET_TO_DESTINATION = {
  "aarch64-linux-android": "arm64-v8a",
  "armv7-linux-androideabi": "armeabi-v7a",
  "i686-linux-android": "x86",
  "x86_64-linux-android": "x86_64",
} as const;

function build(target: string) {
  spawnSync(
    "cargo",
    ["ndk", "--target", target, "--platform", "31", "build", "--release"],
    {
      stdio: "inherit",
    }
  );
}

function main() {
  console.log("Building rust library for android");

  process.chdir("native_rust_lib");

  Object.keys(TARGET_TO_DESTINATION).forEach(build);

  process.chdir("..");

  Object.entries(TARGET_TO_DESTINATION).forEach(([target, architecture]) => {
    const sourcePath = path.join(
      process.cwd(),
      "native_rust_lib",
      "target",
      target,
      "release",
      "libnative_rust_lib.so"
    );
    const architecturePath = path.join(
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
      path.join(architecturePath, "libnative_rust_lib.so")
    );
  });
}

main();
