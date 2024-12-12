import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const bannerReducer = createReducer(initialState, {
  bannerCreateRequest: (state) => {
    state.isLoading = true;
  },
  bannerCreateSuccess: (state, action) => {
    state.isLoading = false;
    state.banner = action.payload;
    state.allBanners = [...state.allBanners, action.payload];
  },
  bannerCreateFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  getAllBannersRequest: (state) => {
    state.isLoading = true;
  },
  getAllBannersSuccess: (state, action) => {
    state.isLoading = false;
    state.allBanners = action.payload;
  },
  getAllBannersFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  bannerUpdateRequest: (state) => {
    state.isLoading = true;
  },
  bannerUpdateSuccess: (state, action) => {
    state.isLoading = false;
  },
  bannerUpdateFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  deleteBannerRequest: (state) => {
    state.isLoading = true;
  },
  deleteBannerSuccess: (state, action) => {
    state.isLoading = false;
    state.message = action.payload;
  },
  deleteBannerFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  clearErrors: (state) => {
    state.error = null;
  },
});
