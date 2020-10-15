import React from 'react';

import { createStore, createEffect, createEvent, guard, sample } from 'effector';

const clickRequest = createEvent();
const fetchRequest = createEffect(n => {
  return new Promise(res => {
    setTimeout(() => res(n), 2500);
  });
});

const clicks = createStore(0).on(clickRequest, x => x + 1);
const requests = createStore(0).on(fetchRequest, x => x + 1);

const isIdle = fetchRequest.pending.map(pending => !pending);

/*
on clickRequest, take current clicks value,
and call fetchRequest with it
if isIdle value is true
*/
guard({
  source: sample(clicks, clickRequest),
  filter: isIdle,
  target: fetchRequest,
});

export const Application = () => {
  return <div>Hello, World</div>;
}
