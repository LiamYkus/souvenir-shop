import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { FaEye } from "react-icons/fa6";
import currency from "currency-formatter";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "ID đơn hàng", flex: 2 },

    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Số lượng",
      headerAlign: "left",
      align: "left",
      type: "number",
      flex: 1,
    },

    {
      field: "total",
      headerName: "Tổng cộng",
      headerAlign: "left",
      align: "left",
      type: "number",
      flex: 1,
    },

    {
      field: " ",
      flex: 1,
      headerName: "Xem",
      headerAlign: "left",
      align: "left",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <FaEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: `${currency.format(item.totalPrice, { code: "VND" })}`,
        status: item.status,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-4 bg-white">
          <div className="my-4 text-xl font-bold uppercase">
            Tất cả đơn hàng
          </div>
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllOrders;
