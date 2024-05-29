import * as React from 'react';

import { TestRustModuleViewProps } from './TestRustModule.types';

export default function TestRustModuleView(props: TestRustModuleViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
