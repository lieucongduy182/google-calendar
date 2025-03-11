/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { devtools, persist, PersistOptions } from 'zustand/middleware';

type StoreCreator<T> = (
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T
) => T;

export const createStore = <T>(
  storeInitializer: StoreCreator<T>,
  storeName: string,
  enablePersist: boolean = false
) => {
  if (enablePersist) {
    return create<T>()(
      persist(devtools(storeInitializer, { name: `${storeName} Devtools` }), {
        name: `${storeName}-storage`,
      } as PersistOptions<T>)
    );
  }

  return create<T>()(
    devtools(storeInitializer, { name: `${storeName} Devtools` })
  );
};
