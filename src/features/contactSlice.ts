import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import {Contact} from "../types"

type InitialState = {
  contact?: Contact;
};

const initialState: InitialState = {
  contact: undefined,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setContact: (state, action) => {
      state.contact = action.payload;
    },
  },
});

export const { setContact } = contactSlice.actions;

export const selectContact = (state: RootState) => state.contact.contact;

export default contactSlice.reducer;
