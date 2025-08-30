import { configureStore } from '@reduxjs/toolkit';
import formSubmit from './slices/formSubmit';

let store = configureStore({
  reducer: {
    formSubmit: formSubmit,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { store };
