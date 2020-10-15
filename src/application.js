import React from 'react';
import { createEvent, createEffect, createStore, sample } from 'effector';

const $userName = createStore('john');
const signIn = createEffect({ handler: console.log });
const submitForm = createEvent();

sample({
  source: $userName /* 2 */,
  clock: submitForm /* 1 */,
  fn: (name, password) => ({ name, password }) /* 3 */,
  target: signIn /* 4 */,
});

submitForm(12345678);
// 1. when submitForm is called with params (12345678)
// 2. take $userName store`s state ('john')
// 3. transform payload from event (1) and current store`s state (2)
// 4. triger effect signIn with params received at the step (3)

export const Application = () => {
  return <div>Hello, World</div>;
}
