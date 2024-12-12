import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { backend_url } from "../../../server";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className="w-full h-[80px] bg-white shadow sticky z-[30] top-0 left-0 flex items-center justify-between">
      <div className="mx-4">
        <Link to="/">
          <h1 className="font-bold text-4xl text-[#50e991] font-bold uppercase">
            Trang quản lý bán hàng
          </h1>
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to={`/shop/${seller._id}`}>
            <img
              src={`${backend_url}${seller.avatar}`}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
