import { createSlice } from "@reduxjs/toolkit";

const initialUser = null;

const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedinUser: initialUser,
  },
  reducers: {
    setLoggedinUser: (state, action) => {
      state.loggedinUser = action.payload ? { ...action.payload } : null;
    },

    logout: (state) => {
      state.loggedinUser = null;
    },
  }
});

export const { setLoggedinUser, logout } = userSlice.actions;
export default userSlice.reducer;
