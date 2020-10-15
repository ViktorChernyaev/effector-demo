import React from 'react';
import { createEffect } from 'effector';

const asyncOperationFx = createEffect(n => {
  return new Promise(resolve => {
    setTimeout(() => resolve(n * n), 2000);
  });
});
//effect pending: false

asyncOperationFx.watch(n => console.log('operation called:', n));
asyncOperationFx.pending.watch(p => console.log('effect pending:', p));
asyncOperationFx.doneData.watch(d => console.log('work done:', d));

asyncOperationFx(4);
//operation called: 4
//effect pending: true
//work done: 16
//effect pending: false

export const Application = () => {
  return <div>Hello, World</div>;
}
