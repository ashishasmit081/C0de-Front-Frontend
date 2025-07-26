import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [
      { role: "model", parts: [{ text: "Hi, How may I help you Coder?😎" }] },
      { role: "user", parts: [{ text: "I wil ask my DSA doubt" }] },
    ],
    isTyping: false
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    resetMessages: (state) => {
      state.messages = [];
    }
  }
});

export const { addMessage, setTyping, resetMessages } = chatSlice.actions;

export default chatSlice.reducer;
