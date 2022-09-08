import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import contactsReducer from '../features/contactsSlice';
import contactReducer from '../features/contactSlice';
import userReducer from '../features/userSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    contacts: contactsReducer,
    contact: contactReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
