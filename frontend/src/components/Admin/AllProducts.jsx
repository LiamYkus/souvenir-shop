import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import axios from "axios";
import { server } from "../../server";
import { useState } from "react";
import currency from "currency-formatter";
import { FaCircleCheck, FaFilePen } from "react-icons/fa6";
import { toast } from "react-toastify";

const AllProducts = () => {
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${server}/product/admin-all-products`, { withCredentials: true })
      .then((res) => {
        setData(res.data.products);
      })
      .then(() => setIsLoading(true));
  }, []);

  const handleIsActiveCheckbox = (e) => {
    setIsActive(e.target.checked);
  };

  const handleIsActive = () => {
    try {
      const dataToSend = {
        productId: selectedProduct._id,
        isActive,
      };
      axios
        .put(`${server}/product/admin-set-isactive-product`, dataToSend, {
          withCredentials: true,
        })
        .then((res) => toast.success(res.data.message))
        .then(() => setSelectedProduct(null))
        .then(() => window.location.reload());
    } catch (error) {}
  };
  const columns = [
    { field: "id", headerName: "ID Sản phẩm", flex: 2 },
    {
      field: "name",
      headerName: "Tên sản phẩm",
      flex: 2,
    },
    {
      field: "price",
      headerName: "Giá",
      flex: 1,
    },
    {
      field: "Stock",
      headerName: "Số lượng",
      headerAlign: "left",
      align: "left",
      type: "number",
      flex: 1,
    },

    {
      field: "sold",
      headerName: "Đã bán",
      headerAlign: "left",
      align: "left",
      type: "number",
      flex: 1,
    },
    {
      field: "view",
      flex: 1,
      headerName: "Xem",
      headerAlign: "left",
      align: "left",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={24} />
              </Button>
            </Link>
          </>
        );
      },
    },

    {
      field: "update",
      flex: 1,
      headerName: "Sửa",
      headerAlign: "left",
      align: "left",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() =>
                setSelectedProduct(data?.find((p) => p._id === params.id))
              }
            >
              <FaFilePen size={24} />
            </Button>
          </>
        );
      },
    },
    {
      field: "isActive",
      flex: 1,
      headerName: "Duyệt",
      headerAlign: "left",
      align: "left",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {params.row.isActive ? (
              <FaCircleCheck color="#50e991" size={24} />
            ) : (
              <FaCircleCheck color="#e60049" size={24} />
            )}
          </>
        );
      },
    },
  ];

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: `${currency.format(item.price, {
          code: "VND",
        })}`,
        Stock: item.stock,
        sold: item?.sold_out,
        isActive: item?.isActive,
      });
    });

  return (
    <div className="w-full m-4 bg-white">
      {isLoading ? (
        <>
          <h3 className="text-xl font-bold uppercase">Tất cả sản phẩm</h3>
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
          {selectedProduct && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex items-center justify-center z-[9999]">
              <div className="bg-white p-4 rounded-md w-1/5">
                <h2 className="text-xl font-bold uppercase text-center">
                  Cập nhật sản phẩm
                </h2>
                <div>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={handleIsActiveCheckbox}
                    className="checkbox checkbox-success"
                  />
                  {isActive ? (
                    <p className="font-bold text-success">
                      Sản phẩm đã được duyệt
                    </p>
                  ) : (
                    <p className="font-bold text-error">
                      Sản phẩm chưa được duyệt
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <button
                    onClick={handleIsActive}
                    className="btn btn-accent text-white font-bold mt-2"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="btn btn-error text-white font-bold mt-2"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default AllProducts;
