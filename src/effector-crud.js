import { createEvent, createStore, createEffect, forward, sample, guard, split } from 'effector';
import { restGet, restPost, restPut, restDelete } from './some-api';
import { gotoList, gotoForm } from './some-router';
import { validatorsMap } from './some-validators';

export const listMounted = createEvent();
export const itemClicked = createEvent();
export const deleteClicked = createEvent();
export const formMounted = createEvent();
export const formChanged = createEvent();
export const cancelClicked = createEvent();
export const submitClicked = createEvent();
export const formUnmounted = createEvent();

export const $list = createStore([]);
export const $listError = createStore(null);
export const $form = createStore({});
export const $formErrors = createStore({});
export const $formError = createStore(null);

export const $isFormValid = $formErrors.map(errors => Object.values(errors).filter(Boolean).length > 0);

const getListFx = createEffect(() => restGet('/some-entity'));
const getItemFx = createEffect((id) => restGet('/some-entity', { params: { id } }));
const createItemFx = createEffect((data) => restPost('/some-entity', data));
const updateItemFx = createEffect((data) => restPut('/some-entity', data));
const deleteItemFx = createEffect((id) => restDelete('/some-entity', { id }));

export const $listLoading = getListFx.pending;
export const $itemLoading = getItemFx.pending;
export const $createLoading = createItemFx.pending;
export const $updateLoading = updateItemFx.pending;
export const $deleteLoading = deleteItemFx.pending;

$list.on(getListFx.doneData, (_, data) => data);
$listError.on(getListFx.fail, (_, error) => error).reset(getListFx.done);
$form
  .on(formChanged, (form, e) => ({ ...form, [e.target.name]: e.target.value }))
  .on(getItemFx.doneData, (_, data) => data)
  .reset(formUnmounted);
$formErrors
  .on(formChanged, (validators, e) => ({ ...validators, [e.target.name]: validatorsMap[e.target.name](e.target.value) }));
$formError
  .on([getItemFx.fail, createItemFx.fail, updateItemFx.fail], (_, error) => error)
  .reset(getItemFx.done, createItemFx.done, updateItemFx.done);

forward({ from: listMounted, to: getListFx });
forward({ from: itemClicked, to: gotoForm });
forward({ from: deleteItemFx.done, to: getListFx });
forward({ from: formMounted, to: getItemFx });
forward({ from: createItemFx.done, to: gotoList });
forward({ from: updateItemFx.done, to: gotoList });
forward({ from: cancelClicked, to: gotoList });

const formSubmitted = guard({
  source: sample({ source: $form, clock: submitClicked }),
  filter: $isFormValid,
});
split({
  source: formSuccessfullySubmitted,
  match: {
    create: (form) => !form.id,
    update: (form) => !!form.id,
  },
  cases: {
    create: createItemFx,
    update: updateItemFx,
  },
});
