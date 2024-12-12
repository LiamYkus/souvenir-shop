import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const categoryReducer = createReducer(initialState, {
  categoryCreateRequest: (state) => {
    state.isLoading = true;
  },
  categoryCreateSuccess: (state, action) => {
    state.isLoading = false;
    state.category = action.payload;
    state.allCategories = [...state.allCategories, action.payload];
  },
  categoryCreateFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  getAllCategoriesRequest: (state) => {
    state.isLoading = true;
  },
  getAllCategoriesSuccess: (state, action) => {
    state.isLoading = false;
    state.allCategories = action.payload;
  },
  getAllCategoriesFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  deleteCategoryRequest: (state) => {
    state.isLoading = true;
  },
  deleteCategorySuccess: (state, action) => {
    state.isLoading = false;
    state.message = action.payload;
  },
  deleteCategoryFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  clearErrors: (state) => {
    state.error = null;
  },
});
