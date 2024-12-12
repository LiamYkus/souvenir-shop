import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/actions/user";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@material-ui/core";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/user/delete-user/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });

    dispatch(getAllUsers());
  };

  const columns = [
    { field: "id", headerName: "ID Người dùng", flex: 2 },

    {
      field: "name",
      headerName: "Tên",
      flex: 2,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      flex: 2,
    },
    {
      field: "role",
      headerName: "Vai trò",
      type: "text",
      flex: 1,
    },

    {
      field: "joinedAt",
      headerName: "Tham gia",
      type: "text",
      flex: 1,
    },

    {
      field: "delete",
      flex: 1,
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
  users &&
    users.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        joinedAt: item.createdAt.slice(0, 10),
      });
    });

  return (
    <div className="w-full m-4">
      <h3 className="text-xl font-bold uppercase">Tất cả người dùng</h3>
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
      {open && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
          <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
            <div className="w-full flex justify-end cursor-pointer">
              <RxCross1 size={25} onClick={() => setOpen(false)} />
            </div>
            <h3 className="text-xl font-bold text-center uppercase m-4">
              Bạn có muốn xóa người dùng này?
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

export default AllUsers;
