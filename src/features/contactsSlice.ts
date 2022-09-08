import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { Contact } from "../types";

type InitialState = {
  contacts: Contact[];
};

const initialState: InitialState = {
  contacts: [],
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },
  },
});

export const { setContacts } = contactsSlice.actions;

export const selectContacts = (state: RootState) => state.contacts.contacts;

export default contactsSlice.reducer;
