import { createExternalStore } from "./createStore";

const pageStore = createExternalStore<string>("home");

export const currentPage = pageStore.get;
export const setPage = pageStore.set;
export const usePage = pageStore.useValue;
