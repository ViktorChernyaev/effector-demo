import React from 'react';
import { createEvent } from 'effector';

const numberEntered = createEvent();
const squaredNumberEntered = numberEntered.prepend(n => n * n);
const rootedIntegerEntered = numberEntered.filterMap(n => {
  const rootNum = Math.sqrt(n);
  const isNotNan = `${rootNum}` !== 'NaN';
  const isInteger = Math.floor(rootNum) === rootNum;
  if (isNotNan && isInteger) return rootNum;
});

squaredNumberEntered.watch(n => console.log('prepend watch:', n));
numberEntered.watch(n => console.log('default watch:', n));
rootedIntegerEntered.watch(n => console.log('filterMap watch:', n));

numberEntered(2);
//default watch: 2

squaredNumberEntered(2);
//prepend watch: 2
//default watch: 4
//filterMap watch: 2

export const Application = () => {
  return <div>Hello, World</div>;
}
