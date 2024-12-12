import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "../server";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        await axios
          .post(`${server}/user/activation`, {
            activation_token,
          })
          .then((res) => {
            setTimeout(() => {
              navigate("/login");
              window.location.reload();
            }, 5000);
          })
          .catch((err) => {
            setError(true);
            setTimeout(() => {
              navigate("/");
              window.location.reload();
            }, 5000);
          });
      };
      sendRequest();
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-center">
      {error ? (
        <div className="flex flex-col">
          <p className="font-bold text-2xl text-error">
            Token của bạn đã hết hạn!
          </p>
          <p className="font-bold text-2xl text-error">
            Bạn sẽ được chuyển hướng đến trang chủ sau 5 giây.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          <p className="font-bold text-2xl text-success">
            Tài khoản của bạn đã được tạo thành công!
          </p>
          <p className="font-bold text-2xl text-success">
            Bạn sẽ được chuyển hướng đến trang đăng nhập sau 5 giây.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivationPage;
