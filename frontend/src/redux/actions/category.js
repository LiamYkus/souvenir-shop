import axios from "axios";
import { server } from "../../server";

export const createCategory = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "categoryCreateRequest",
    });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.post(
      `${server}/category/create-category`,
      newForm,
      config
    );
    dispatch({
      type: "categoryCreateSuccess",
      payload: data.category,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "categoryCreateFail",
      payload: error.message,
    });
  }
};

export const getAllCategories = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllCategoriesRequest",
    });

    const { data } = await axios.get(`${server}/category/get-all-categories`);
    dispatch({
      type: "getAllCategoriesSuccess",
      payload: data.categories,
    });
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch({
        type: "getAllCategoriesFailed",
        payload: error.response.data.message,
      });
    } else {
      // Xử lý lỗi nếu không có response hoặc response không có data
      dispatch({
        type: "getAllCategoriesFailed",
        payload: "An error occurred.",
      });
    }
  }
};

export const deleteCategory = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteCategoryRequest",
    });

    const { data } = await axios.delete(
      `${server}/category/delete-category/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteCategorySuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteCategoryFailed",
      payload: error.response.data?.message,
    });
  }
};
