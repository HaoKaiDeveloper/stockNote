import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  port,
  getStockRoute,
  editStockRoute,
  createStockRoute,
  deleteStockRoute,
} from "./api";

export const stockApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: port,
  }),
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getStockNote: builder.query({
      query: (value) => {
        let filter = { search: "", assets: "all", sortValue: 0 };
        if (value) {
          filter = value;
        }
        return {
          url: `${getStockRoute}?search=${filter.search}&assets=${filter.assets}&sort=${filter.sortValue}`,
          method: "GET",
          credentials: "include",
        };
      },
    }),
    editNote: builder.mutation({
      query: (value) => {
        return {
          url: `${editStockRoute}`,
          method: "PUT",
          credentials: "include",
          body: value,
        };
      },
    }),
    createNote: builder.mutation({
      query: (value) => {
        return {
          url: `${createStockRoute}`,
          method: "POST",
          credentials: "include",
          body: value,
        };
      },
    }),
    deleteNote: builder.mutation({
      query: (value) => {
        return {
          url: `${deleteStockRoute}/${value}`,
          method: "DELETE",
          credentials: "include",
        };
      },
    }),
  }),
});

export const {
  useGetStockNoteQuery,
  useEditNoteMutation,
  useCreateNoteMutation,
  useDeleteNoteMutation,
} = stockApi;

const initialState = {
  stockNotes: [],
  loading: false,
};

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setStockNote: (state, { payload }) => {
      state.stockNotes = payload;
    },
    editStockNote: (state, { payload }) => {
      const index = state.stockNotes.findIndex(
        (item) => item._id === payload._id
      );
      state.stockNotes.splice(index, 1, payload);
    },
    addNewStockNote: (state, { payload }) => {
      state.stockNotes = [payload, ...state.stockNotes];
    },
    deleteStockNote: (state, { payload }) => {
      const index = state.stockNotes.findIndex((item) => item._id === payload);
      state.stockNotes.splice(index, 1);
    },
  },
});

export const { setStockNote, editStockNote, addNewStockNote, deleteStockNote } =
  stockSlice.actions;

export default stockSlice.reducer;
