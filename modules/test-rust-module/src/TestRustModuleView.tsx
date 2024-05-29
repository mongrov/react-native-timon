import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { TestRustModuleViewProps } from './TestRustModule.types';

const NativeView: React.ComponentType<TestRustModuleViewProps> =
  requireNativeViewManager('TestRustModule');

export default function TestRustModuleView(props: TestRustModuleViewProps) {
  return <NativeView {...props} />;
}
