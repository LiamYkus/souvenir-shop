import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const supplierReducer = createReducer(initialState, {
  supplierCreateRequest: (state) => {
    state.isLoading = true;
  },
  supplierCreateSuccess: (state, action) => {
    state.isLoading = false;
    state.supplier = action.payload;
    state.allSuppliers = [...state.allSuppliers, action.payload];
  },
  supplierCreateFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  getAllSuppliersRequest: (state) => {
    state.isLoading = true;
  },
  getAllSuppliersSuccess: (state, action) => {
    state.isLoading = false;
    state.allSuppliers = action.payload;
  },
  getAllSuppliersFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  deleteSupplierRequest: (state) => {
    state.isLoading = true;
  },
  deleteSupplierSuccess: (state, action) => {
    state.isLoading = false;
    state.message = action.payload;
  },
  deleteSupplierFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  clearErrors: (state) => {
    state.error = null;
  },
});
