import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const invoiceReducer = createReducer(initialState, {
  // Tạo phiếu nhập mới
  invoiceCreateRequest: (state) => {
    state.isLoading = true;
  },
  invoiceCreateSuccess: (state, action) => {
    state.isLoading = false;
    state.invoice = action.payload;
  },
  invoiceCreateFail: (state, action) => {
    state.isLoading = false;
  },

  // Lấy danh sách phiếu nhập
  getAllInvoicesRequest: (state) => {
    state.isLoading = true;
  },
  getAllInvoicesSuccess: (state, action) => {
    state.isLoading = false;
    state.invoices = action.payload;
  },
  getAllInvoicesFailed: (state, action) => {
    state.isLoading = false;
  },

  // Lấy danh sách phiếu nhập
  getInvoiceDetailRequest: (state) => {
    state.isLoading = true;
  },
  getInvoiceDetailSuccess: (state, action) => {
    state.isLoading = false;
    state.invoice = action.payload;
  },
  getInvoiceDetailFailed: (state, action) => {
    state.isLoading = false;
  },

  // Lấy danh sách phiếu nhập của shop
  getAllInvoicesShopRequest: (state) => {
    state.isLoading = true;
  },
  getAllInvoicesShopSuccess: (state, action) => {
    state.isLoading = false;
    state.invoices = action.payload;
  },
  getAllInvoicesShopFailed: (state, action) => {
    state.isLoading = false;
  },

  // Xóa phiếu nhập
  deleteInvoiceRequest: (state) => {
    state.isLoading = true;
  },
  deleteInvoiceSuccess: (state, action) => {
    state.isLoading = false;
    state.message = action.payload;
  },
  deleteInvoiceFailed: (state, action) => {
    state.isLoading = false;
  },

  clearErrors: (state) => {
    state.error = null;
  },
});
