import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import currency from "currency-formatter";
import { FaBox, FaMoneyBill, FaProductHunt } from "react-icons/fa6";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));
  }, []);

  const availableBalance = seller?.availableBalance.toFixed(2);

  const columns = [
    { field: "id", headerName: "ID Đơn hàng", minWidth: 150, flex: 1 },

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
                <AiOutlineArrowRight size={20} />
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
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: `${currency.format(item.totalPrice, { code: "VND" })}`,
        status: item.status,
      });
    });
  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Tổng quan</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <FaMoneyBill size={36} color="#50e991" />
            <h3 className="text-xl ml-2">
              Thu nhập (Với 10% phí dich vụ){" "}
              <span className="text-[16px]"></span>
            </h3>
          </div>
          <h5 className="text-xl font-bold pt-2 pl-10">
            {currency.format(availableBalance, { code: "VND" })}
          </h5>
          <Link to="/dashboard-withdraw-money">
            <h5 className="pt-4 pl-[2] text-[#077f9c]">Yêu cầu rút tiền</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <FaBox size={36} color="#e6d800" />
            <h3 className="text-xl ml-2">Đơn hàng</h3>
          </div>
          <h5 className="text-xl font-bold pt-2 pl-10">
            {orders && orders.length}
          </h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">Danh sách đơn hàng</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <FaProductHunt
              size={36}
              color="#0bb4ff"
            />
            <h3 className="text-xl ml-2">Sản phẩm</h3>
          </div>
          <h5 className="text-xl font-bold pt-2 pl-10">
            {products && products.length}
          </h5>
          <Link to="/dashboard-products">
            <h5 className="pt-4 pl-2 text-[#077f9c]">Danh sách sản phẩm</h5>
          </Link>
        </div>
      </div>
      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Đơn hàng mới nhất</h3>
      <div className="w-full min-h-[45vh] bg-white rounded">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
};

export default DashboardHero;
