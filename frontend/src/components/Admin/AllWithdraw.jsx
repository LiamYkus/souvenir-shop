import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { DataGrid } from "@material-ui/data-grid";
import { RxCross1 } from "react-icons/rx";
import { FaPencil, FaEye } from "react-icons/fa6";
import { toast } from "react-toastify";
import currency from "currency-formatter";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState("Processing");
  const [openModal, setOpenModal] = useState(false);
  const [sellerData, setSellerData] = useState();

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "ID Yêu cầu", flex: 2 },
    {
      field: "name",
      headerName: "Tên cửa hàng ",
      flex: 2,
    },
    {
      field: "shopId",
      headerName: "ID cửa hàng",
      flex: 2,
    },
    {
      field: "amount",
      headerName: "Số tiền",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      type: "text",
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
    {
      field: "view",
      headerName: "Xem",
      headerAlign: "left",
      align: "left",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <FaEye
              size={20}
              className="cursor-pointer"
              onClick={() => showModalHandler(params.row)}
            />
          </>
        );
      },
    },
    {
      field: "update",
      headerName: "Cập nhật",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
      renderCell: (params) => {
        return (
          <FaPencil
            size={20}
            className={`${
              params.row.status !== "Processing" ? "hidden" : ""
            }cursor-pointer`}
            onClick={() => setOpen(true) || setWithdrawData(params.row)}
          />
        );
      },
    },
  ];

  const handleSubmit = async () => {
    await axios
      .put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.shopId,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Cập nhật yêu cầu rút tiền thành công!");
        setData(res.data.withdraws);
        setOpen(false);
      });
  };

  const showModalHandler = async (row) => {
    const shopId = row.shopId;
    const response = await axios.get(`${server}/shop/get-shop-info/${shopId}`);
    setSellerData(response.data.shop);
    setOpenModal(true);
  };

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        shopId: item.seller._id,
        name: item.seller.name,
        amount: `${currency.format(item.amount, {
          code: "VND",
        })}`,
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
      });
    });
  return (
    <div className="w-full m-4">
      <h3 className="text-xl font-bold uppercase">Tất cả yêu cầu</h3>
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
      {openModal && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[50%] min-h-[40vh] bg-white rounded shadow p-4">
            <div className="flex justify-end w-full">
              <RxCross1 size={25} onClick={() => setOpenModal(false)} />
            </div>
            <h1 className="font-bold text-xl uppercase text-center">
              Thông tin phương thức rút tiền
            </h1>
            <p className="text-center font-bold text-lg">{sellerData.name}</p>
            <p>
              <span className="font-bold">Email :</span>
              {sellerData.email}
            </p>
            <p>
              <span className="font-bold">Số điện thoại :</span>
              {sellerData.phoneNumber}
            </p>
            <p>
              <span className="font-bold">Ngân hàng: </span>
              {sellerData.withdrawMethod.bankName}
            </p>
            <p>
              <span className="font-bold">Số tài khoản: </span>
              {sellerData.withdrawMethod.bankAccountNumber}
            </p>
            <p>
              <span className="font-bold">Chủ tài khoản: </span>
              {sellerData.withdrawMethod.bankHolderName}
            </p>
          </div>
        </div>
      )}
      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[50%] min-h-[40vh] bg-white rounded shadow p-4">
            <div className="flex justify-end w-full">
              <RxCross1 size={25} onClick={() => setOpen(false)} />
            </div>
            <h1 className="font-bold text-xl text-info uppercase text-center">
              Cập nhật trạng thái rút tiền
            </h1>
            <select
              name=""
              id=""
              onChange={(e) => setWithdrawStatus(e.target.value)}
              className="w-[200px] h-[35px] border rounded my-2"
            >
              <option value={withdrawStatus}>{withdrawData.status}</option>
              <option value={withdrawStatus}>Thành công</option>
            </select>
            <button
              className="btn btn-success text-white font-bold uppercase block my-2"
              onClick={handleSubmit}
            >
              Cập nhật
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
