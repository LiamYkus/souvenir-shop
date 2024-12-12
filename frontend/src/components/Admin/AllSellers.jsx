import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Button } from "@material-ui/core";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/sellers";
import { Link } from "react-router-dom";

const AllSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });

    dispatch(getAllSellers());
  };

  const columns = [
    {
      field: "id",
      headerName: "ID người bán",
      headerAlign: "left",
      align: "left",
      flex: 2,
    },

    {
      field: "name",
      headerName: "tên cửa hàng",
      headerAlign: "left",
      align: "left",
      flex: 2,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      headerAlign: "left",
      align: "left",
      flex: 2,
    },
    {
      field: "address",
      headerName: "Địa chỉ cửa hàng",
      type: "text",
      headerAlign: "left",
      align: "left",
      flex: 2,
    },

    {
      field: "joinedAt",
      headerName: "Tham gia",
      type: "text",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "  ",
      flex: 0.75,
      headerName: "Xem",
      headerAlign: "left",
      align: "left",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/shop/preview/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "delete",
      flex: 0.75,
      headerName: "Xóa",
      headerAlign: "left",
      align: "left",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => setUserId(params.id) || setOpen(true)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  sellers &&
    sellers.forEach((item) => {
      row.push({
        id: item._id,
        name: item?.name,
        email: item?.email,
        joinedAt: item.createdAt.slice(0, 10),
        address: item.address,
      });
    });

  return (
    <div className="w-full justify-center m-4">
      <h3 className="text-xl font-bold my-2 uppercase">Tất cả người bán</h3>
      <div className="w-full min-h-[45vh] bg-white rounded">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
      {open && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
          <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
            <div className="w-full flex justify-end cursor-pointer">
              <RxCross1 size={25} onClick={() => setOpen(false)} />
            </div>
            <h3 className="text-xl font-bold text-center uppercase m-4">
              Bạn có chắc chắn xóa người bán này?
            </h3>
            <div className="w-full flex items-center justify-center">
              <button
                onClick={() => setOpen(false)}
                className="btn btn-error font-bold text-white uppercase m-2"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => setOpen(false) || handleDelete(userId)}
                className="btn btn-success font-bold text-white uppercase m-2"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSellers;
