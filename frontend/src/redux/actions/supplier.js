import axios from "axios";
import { server } from "../../server";

export const createSupplier = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "supplierCreateRequest",
    });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.post(
      `${server}/supplier/create-supplier`,
      newForm,
      config
    );
    dispatch({
      type: "supplierCreateSuccess",
      payload: data.supplier,
    });
  } catch (error) {
    dispatch({
      type: "supplierCreateFail",
      payload: error.response.data?.message,
    });
  }
};

export const getAllSuppliers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllSuppliersRequest",
    });

    const { data } = await axios.get(`${server}/supplier/get-all-suppliers`);
    dispatch({
      type: "getAllSuppliersSuccess",
      payload: data.suppliers,
    });
  } catch (error) {
    if (error.response && error.response.data) {
      dispatch({
        type: "getAllSuppliersFailed",
        payload: error.response.data.message,
      });
    } else {
      // Xử lý lỗi nếu không có response hoặc response không có data
      dispatch({
        type: "getAllSuppliersFailed",
        payload: "An error occurred.",
      });
    }
  }
};

export const deleteSupplier = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteSupplierRequest",
    });

    const { data } = await axios.delete(
      `${server}/supplier/delete-supplier/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteSupplierSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteSupplierFailed",
      payload: error.response.data?.message,
    });
  }
};
