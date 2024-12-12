import React, { useState } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import {
  loadUser,
  updateUserInformation,
} from "../../redux/actions/user";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import currency from "currency-formatter";

const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(name, email, phoneNumber, password));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    const formData = new FormData();

    formData.append("image", e.target.files[0]);

    await axios
      .put(`${server}/user/update-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        dispatch(loadUser());
        toast.success("Avatar đã được cập nhật thành công!");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="w-full">
      {/* profile */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <div className="avatar">
                <div className="w-48 rounded-full">
                  <img src={`${backend_url}${user?.avatar}`} />
                </div>
              </div>
              <div className="w-[48px] h-[48px] bg-neutral-content rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleImage}
                />
                <label htmlFor="image">
                  <AiOutlineCamera size={24} />
                </label>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full">
            <form onSubmit={handleSubmit} aria-required={true}>
              <div className="w-full 800px:flex block my-2">
                <div className="w-full 800px:mx-2">
                  <label className="block my-2 font-bold uppercase">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    className="input input-bordered input-accent w-full"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-full 800px:mx-2">
                  <label className="block my-2 font-bold uppercase">
                    Email
                  </label>
                  <input
                    type="text"
                    className="input input-bordered input-accent w-full"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full 800px:flex block my-2">
                <div className="w-full 800px:mx-2">
                  <label className="block my-2 font-bold uppercase">
                    Số điện thoại: (+84)
                  </label>

                  <input
                    type="number"
                    className="input input-bordered input-accent w-full"
                    required
                    placeholder="+84"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="w-full 800px:mx-2">
                  <label className="block my-2 font-bold uppercase">
                    Nhập mật khẩu để thay đổi thông tin{" "}
                  </label>
                  <input
                    type="password"
                    className="input input-bordered input-accent w-full"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-accent text-white font-bold uppercase m-2"
              >
                Cập nhật
              </button>
            </form>
          </div>
        </>
      )}

      {/* order */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}

      {/* Refund */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}

      {/* Track order */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/* Change Password */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

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
      field: " ",
      flex: 1,
      headerName: "Chi tiết",
      type: "number",
      headerAlign: "left",
      align: "left",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
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
        itemsQty: item.cart.length,
        total: `${currency.format(item.totalPrice, { code: "VND" })}`,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const eligibleOrders =
    orders && orders.filter((item) => item.status === "Processing refund");

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
      field: " ",
      flex: 1,
      headerAlign: "left",
      align: "left",
      headerName: "Chi tiết",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
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

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        // total: "US$ " + item.totalPrice,
        total: `${currency.format(item.totalPrice, { code: "VND" })}`,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};

const TrackOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 2 },

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
      field: "Chi tiết",
      flex: 1,
      headerAlign: "left",
      align: "left",
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
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
        // total: "US$ " + item.totalPrice,
        total: `${currency.format(item.totalPrice, { code: "VND" })}`,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.success);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="w-full">
      <h1 className="block text-xl text-center font-bold text-accent uppercase my-4">
        Đổi mật khẩu
      </h1>
      <div className="w-full">
        <form
          aria-required
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className="w-full 800px:w-[50%]">
            <label className="block mb-2 font-bold uppercase">
              Nhập mật khẩu cũ
            </label>
            <input
              type="password"
              className="input input-bordered input-accent w-full"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="w-full 800px:w-[50%] my-2">
            <label className="block mb-2 font-bold uppercase">
              Nhật mật khẩu mới
            </label>
            <input
              type="password"
              className="input input-bordered input-accent w-full"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="w-full 800px:w-[50%] my-2">
            <label className="block mb-2 font-bold uppercase">
              Nhập lại mật khẩu mới
            </label>
            <input
              type="password"
              className="input input-bordered input-accent w-full"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-accent font-bold text-white uppercase my-2"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileContent;
