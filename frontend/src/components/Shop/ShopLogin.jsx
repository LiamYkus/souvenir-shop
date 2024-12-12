import { React, useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const ShopLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(
        `${server}/shop/login-shop`,
        {
          email,
          password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Đăng nhập thành công!");
        navigate("/dashboard");
        window.location.reload(true);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`${server}/shop/forgot-password`, {
        email,
      })
      .then((res) => {
        toast.success(res.data.message);
        setTimeout(() => window.location.reload(), 3000);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="font-bold text-3xl uppercase text-center">
          {isForgotPassword ? "Quên mật khẩu" : "Đăng nhập vào cửa hàng"}
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isForgotPassword ? (
            <form onSubmit={handleForgotPasswordSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  onClick={() => setIsForgotPassword(false)}
                  className="btn btn-accent w-full text-white font-bold"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </label>
                <div className="mt-1 relative">
                  <input
                    type={visible ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {visible ? (
                    <AiOutlineEye
                      className="absolute right-2 top-2 cursor-pointer"
                      size={25}
                      onClick={() => setVisible(false)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className="absolute right-2 top-2 cursor-pointer"
                      size={25}
                      onClick={() => setVisible(true)}
                    />
                  )}
                </div>
              </div>
              <div>
                <div className="flex">
                  <input
                    type="checkbox"
                    name="remember-me"
                    id="remember-me"
                    className="checkbox checkbox-success"
                  />
                  <label htmlFor="remember-me" className="mx-2">
                    Lưu đăng nhập
                  </label>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="btn btn-info w-full text-white font-bold"
                >
                  Đăng nhập
                </button>
              </div>
              <div className="flex">
                <h4>Bạn chưa có tài khoản?</h4>
                <Link to="/shop-create" className="text-info font-bold mx-2">
                  Đăng ký ngay
                </Link>
              </div>
              <div>
                <Link to="/" className="text-info font-bold">
                  Trang chủ
                </Link>
              </div>
              <div className="flex">
                <button
                  onClick={() => setIsForgotPassword(true)}
                  className="btn btn-warning font-bold text-white"
                >
                  Quên mật khẩu
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopLogin;
