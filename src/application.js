import React from 'react';
import { createEvent, createStore } from 'effector';

const $number = createStore(4);
//number: 4
const $numberSqrt = $number.map(n => Math.sqrt(n));
//numberSqrt: 2

$number.watch(n => console.log('number:', n));
$numberSqrt.watch(n => console.log('numberSqrt:', n));

const numberChanged = createEvent();
const numberReseted = createEvent();

$number.on(numberChanged, (_, n) => n).reset(numberReseted);

numberChanged(9);
//number: 9
//numberSqrt: 3

numberReseted();
//number: 4
//numberSqrt: 2

export const Application = () => {
  return <div>Hello, World</div>;
}
