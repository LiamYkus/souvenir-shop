import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../server";
const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState();
  const [isShop, setIsShop] = useState(false);
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`${server}/user/reset-password/${resetToken}`, {
        newPassword,
      })
      .then((res) => {
        toast.success("Cập nhật mật khẩu thành công!");
        navigate("/login");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  const handleShopResetPasswordSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`${server}/shop/reset-password/${resetToken}`, {
        newPassword,
      })
      .then((res) => {
        toast.success("Cập nhật mật khẩu thành công!");
        navigate("/shop-login");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold uppercase">
          Nhập mật khẩu mới
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isShop ? (
            <form onSubmit={handleShopResetPasswordSubmit}>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu mới
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="newPassword"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-info w-full text-white font-bold"
                >
                  Gửi
                </button>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setIsShop(false)}
                  className="btn btn-accent w-full text-white font-bold"
                >
                  Bạn là người dùng? Nhấn vào đây!!!
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPasswordSubmit}>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu mới
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="newPassword"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-info w-full text-white font-bold"
                >
                  Gửi
                </button>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setIsShop(true)}
                  className="btn btn-accent w-full text-white font-bold"
                >
                  Bạn là người bán hàng? Nhấn vào đây!!!
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
