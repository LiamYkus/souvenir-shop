import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { getAllSellers } from "../../redux/actions/sellers";
import currency from "currency-formatter";
import { FaBox, FaMoneyBill, FaTable } from "react-icons/fa6";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, []);

  const adminEarning =
    adminOrders &&
    adminOrders.reduce((acc, item) => acc + item.totalPrice * 0.1, 0);

  const adminBalance = adminEarning?.toFixed(2);

  const columns = [
    { field: "id", headerName: "ID đơn hàng", flex: 1 },

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
      field: "createdAt",
      headerName: "Thời gian",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
  ];

  const row = [];
  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: `${currency.format(item?.totalPrice, {
          code: "VND",
        })}`,
        status: item?.status,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });

  return (
    <>
      {adminOrderLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4">
          <h3 className="text-[22px] font-Poppins pb-2">Tổng quan</h3>
          <div className="w-full block 800px:flex items-center justify-between">
            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <FaMoneyBill size={36} color="#50e991" />
                <h3 className="text-xl ml-2">Tổng thu nhập</h3>
              </div>
              <h5 className="text-xl font-bold pt-2 pl-10">
                {currency.format(adminBalance, {
                  code: "VND",
                })}
              </h5>
            </div>

            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <FaTable size={36} />
                <h3 className="text-xl ml-2">
                  Quản lý người bán hàng
                </h3>
              </div>
              <h5 className="text-xl font-bold pt-2 pl-10">
                {sellers && sellers.length}
              </h5>
              <Link to="/admin-sellers">
                <h5 className="pt-4 pl-2 text-[#077f9c]">
                  Xem danh sách cửa hàng
                </h5>
              </Link>
            </div>

            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <FaBox size={36} color="#e6d800" />
                <h3 className="text-xl ml-2">Đơn hàng</h3>
              </div>
              <h5 className="text-xl font-bold pt-2 pl-10">
                {adminOrders && adminOrders.length}
              </h5>
              <Link to="/admin-orders">
                <h5 className="pt-4 pl-2 text-[#077f9c]">
                  Xem danh sách đơn hàng
                </h5>
              </Link>
            </div>
          </div>

          <br />
          <h3 className="text-[22px] font-Poppins pb-2">Đơn hàng mới nhất</h3>
          <div className="w-full min-h-[45vh] bg-white rounded">
            <DataGrid
              rows={row}
              columns={columns}
              pageSize={4}
              disableSelectionOnClick
              autoHeight
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardMain;
