import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { FaArrowRight } from "react-icons/fa6";

import currency from "currency-formatter";

const AllRefundOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const refundOrders =
    orders &&
    orders.filter(
      (item) =>
        item.status === "Processing refund" || item.status === "Refund Success"
    );

  const columns = [
    { field: "id", headerName: "ID Đơn hàng", flex: 2 },

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
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },

    {
      field: "total",
      headerName: "Tổng cộng",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },

    {
      field: "detail",
      flex: 1,
      headerName: "Chi tiết",
      type: "number",
      headerAlign: "left",
      align: "left",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <FaArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  refundOrders &&
    refundOrders.forEach((item) => {
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
        <div className="w-full m-4 bg-white">
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

export default AllRefundOrders;
