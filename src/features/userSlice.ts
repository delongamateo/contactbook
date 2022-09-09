import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

type User = {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string | null;
};

type InitialState = {
  user: User | null;
  isLoading: boolean;
};

const initialState: InitialState = {
  user: null,
  isLoading: true
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setActiveUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setIsLoadingUser: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  },
});

export const { setActiveUser,setIsLoadingUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
