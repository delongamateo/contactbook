import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

type User = {
  displayName: string;
  email: string;
  photoURL: string;
};

type InitialState = {
  user: User | null | string;
};

const initialState: InitialState = {
  user: "loading",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setActiveUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
