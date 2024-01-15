import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { googleLoginRoute, userLogoutRoute } from "./api";
import axios from "axios";

export const setGoogleLogin = createAsyncThunk(
  "user/setGoogleLogin",
  async (value, thunkAPI) => {
    const { email, given_name: name, picture } = value;
    try {
      const res = await axios.post(
        googleLoginRoute,
        { email, name, picture },
        {
          withCredentials: true,
        }
      );
      if (res.status === 200 && res.data.statusCode === "0000") {
        return res.data.user;
      }
    } catch (err) {}
  }
);

export const userLogout = createAsyncThunk(
  "user/userLogout",
  async (value, thunkAPI) => {
    const res = await axios.post(
      userLogoutRoute,
      {},
      { withCredentials: true }
    );
    return res.data;
  }
);

let localUser = localStorage.getItem("user");
localUser = localUser
  ? JSON.parse(localUser)
  : {
      picture: "",
      name: "",
      token: "",
    };

const initialState = {
  picture: localUser.picture,
  name: localUser.name,
  token: localUser.token,
  logOutPop: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: function (state, { payload }) {
      const { name, picture } = payload;
      state.name = name;
      state.picture = picture;

      if (payload.token) {
        state.token = payload.token;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({ name, picture, token: state.token })
      );
    },
    setLogoutPop: function (state) {
      state.logOutPop = true;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(setGoogleLogin.fulfilled, (state, { payload }) => {
      const { token, name, picture } = payload;
      localStorage.setItem("user", JSON.stringify(payload));
      state.token = token;
      state.name = name;
      state.picture = picture;
    });
    builder.addCase(userLogout.fulfilled, (state) => {
      state.name = "";
      state.token = "";
      state.picture = "";
      localStorage.removeItem("user");
    });
  },
});

export const { setUserInfo, setLogoutPop, logout } = userSlice.actions;

export default userSlice.reducer;
