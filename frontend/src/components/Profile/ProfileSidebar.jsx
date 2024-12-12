import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlinePassword,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  return (
    <div className="w-full bg-white shadow-sm rounded mx-2">
      <div
        className="flex items-center cursor-pointer w-full uppercase font-bold"
        onClick={() => setActive(1)}
      >
        <RxPerson size={24} />
        <span
          className={`mx-2 hover:text-error ${
            active === 1 ? "text-accent" : ""
          } 800px:block hidden`}
        >
          Trang cá nhân
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full my-8 uppercase font-bold"
        onClick={() => setActive(2)}
      >
        <HiOutlineShoppingBag size={24} />
        <span
          className={`mx-2 hover:text-error ${
            active === 2 ? "text-accent" : ""
          } 800px:block hidden`}
        >
          Đơn đặt hàng
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full my-8 uppercase font-bold"
        onClick={() => setActive(3)}
      >
        <HiOutlineReceiptRefund size={24} />
        <span
          className={`mx-2 hover:text-error ${
            active === 3 ? "text-accent" : ""
          } 800px:block hidden`}
        >
          Đơn hoàn tiền
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full my-8 uppercase font-bold"
        onClick={() => setActive(4) || navigate("/inbox")}
      >
        <AiOutlineMessage size={24} />
        <span
          className={`mx-2 hover:text-error ${
            active === 4 ? "text-accent" : ""
          } 800px:block hidden`}
        >
          Tin nhắn
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full my-8 uppercase font-bold"
        onClick={() => setActive(5)}
      >
        <MdOutlineTrackChanges size={24} />
        <span
          className={`mx-2 hover:text-error ${
            active === 5 ? "text-accent" : ""
          } 800px:block hidden`}
        >
          Theo dõi đơn hàng
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full my-8 uppercase font-bold"
        onClick={() => setActive(6)}
      >
        <RiLockPasswordLine size={24} />
        <span
          className={`mx-2 hover:text-error ${
            active === 6 ? "text-accent" : ""
          } 800px:block hidden`}
        >
          Đổi mật khẩu
        </span>
      </div>

      {user && user?.role === "Admin" && (
        <Link to="/admin/dashboard">
          <div
            className="flex items-center cursor-pointer w-full my-8 uppercase font-bold"
            onClick={() => setActive(8)}
          >
            <MdOutlineAdminPanelSettings size={24} />
            <span
              className={`mx-2 hover:text-error ${
                active === 8 ? "text-accent" : ""
              } 800px:block hidden`}
            >
              Quản lý
            </span>
          </div>
        </Link>
      )}
      <div
        className="single_item flex items-center cursor-pointer w-full my-8 uppercase font-bold"
        onClick={logoutHandler}
      >
        <AiOutlineLogin size={24} />
        <span
          className={`mx-2 hover:text-error ${
            active === 8 ? "text-accent" : ""
          } 800px:block hidden`}
        >
          Đăng xuất
        </span>
      </div>
    </div>
  );
};

export default ProfileSidebar;
