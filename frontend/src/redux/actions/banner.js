import axios from "axios";
import { server } from "../../server";

export const createBanner = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "bannerCreateRequest",
    });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.post(
      `${server}/banner/create-banner`,
      newForm,
      config
    );
    dispatch({
      type: "bannerCreateSuccess",
      payload: data.banner,
    });
  } catch (error) {
    dispatch({
      type: "bannerCreateFail",
      payload: error.response.data?.message,
    });
  }
};

export const getAllBanners = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllBannersRequest",
    });

    const { data } = await axios.get(`${server}/banner/get-all-banners`);
    dispatch({
      type: "getAllBannersSuccess",
      payload: data.banners,
    });
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch({
        type: "getAllBannersFailed",
        payload: error.response.data.message,
      });
    } else {
      // Xử lý lỗi nếu không có response hoặc response không có data
      dispatch({
        type: "getAllBannersFailed",
        payload: "An error occurred.",
      });
    }
  }
};

export const updateBanner = (id, updateData) => async (dispatch) => {
  try {
    dispatch({
      type: "bannerUpdateRequest",
    });

    const { data } = await axios.put(
      `${server}/banner/update-banner/${id}`,
      updateData
    );
    dispatch({
      type: "bannerUpdateSuccess",
    });
  } catch (error) {
    dispatch({
      type: "bannerUpdateFail",
      payload: error.response.data?.message,
    });
  }
};

export const deleteBanner = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteBannerRequest",
    });

    const { data } = await axios.delete(
      `${server}/banner/delete-banner/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteBannerSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteBannerFailed",
      payload: error.response.data?.message,
    });
  }
};
