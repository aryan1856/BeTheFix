import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem('user'));
const initialUser = storedUser ? { isAdmin: false, ...storedUser } : null;

const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedinUser: initialUser,
  },
  reducers: {
    setLoggedinUser: (state, action) => {
      state.loggedinUser = { isAdmin: false, ...action.payload };
    },
    logout: (state) => {
      state.loggedinUser = null;
    },
  }
});

export const { setLoggedinUser, logout } = userSlice.actions;
export default userSlice.reducer;
