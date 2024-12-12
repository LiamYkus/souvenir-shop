import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../../server";

import {
  AiOutlineFolderAdd,
  AiOutlineGift,
  AiOutlineLogout,
} from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { IoAnalytics } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import {
  LiaFileInvoiceSolid,
  LiaFileInvoiceDollarSolid,
} from "react-icons/lia";

const DashboardSideBar = ({ active }) => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    axios
      .get(`${server}/shop/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/shop-login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  return (
    // <div className="w-full h-[90vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
      <div className="w-full bg-white shadow-sm sticky top-0 left-0 z-10">
          {/* single item */}
          <div className="w-full flex items-center p-4 hover:bg-neutral-content">
              <Link to="/dashboard" className="w-full flex items-center">
                  <RxDashboard size={30}/>
                  <h5
                      className={`hidden 800px:block text-xl px-2 hover:text-[#e60049] font-bold ${
                          active === 1 ? "text-[#50e991] font-bold" : " "
                      }`}
                  >
                      Dashboard
                  </h5>
              </Link>
          </div>

          <div className="w-full flex items-center p-4 hover:bg-neutral-content">
              <Link to="/dashboard-orders" className="w-full flex items-center">
                  <FiShoppingBag size={30}/>
                  <h5
                      className={`hidden 800px:block text-xl px-2 hover:text-[#e60049] font-bold ${
                          active === 2 ? "text-[#50e991] font-bold" : " "
                      }`}
                  >
                      Đơn hàng
                  </h5>
              </Link>
          </div>

          <div className="w-full flex items-center p-4 hover:bg-neutral-content">
              <Link to="/dashboard-products" className="w-full flex items-center">
                  <FiPackage size={30}/>
                  <h5
                      className={`hidden 800px:block text-xl px-2 hover:text-[#e60049] font-bold ${
                          active === 3 ? "text-[#50e991] font-bold" : " "
                      }`}
                  >
                      Sản phẩm
                  </h5>
              </Link>
          </div>

          <div className="w-full flex items-center p-4 hover:bg-neutral-content">
              <Link
                  to="/dashboard-create-product"
                  className="w-full flex items-center"
              >
                  <AiOutlineFolderAdd size={30}/>
                  <h5
                      className={`hidden 800px:block text-xl px-2 hover:text-[#e60049] font-bold ${
                          active === 4 ? "text-[#50e991] font-bold" : " "
                      }`}
                  >
                      Thêm sản phẩm
                  </h5>
              </Link>
          </div>

          <div className="w-full flex items-center p-4 hover:bg-neutral-content">
              <Link to="/dashboard-invoices" className="w-full flex items-center">
                  <LiaFileInvoiceSolid size={30}/>
                  <h5
                      className={`hidden 800px:block text-xl px-2 hover:text-[#e60049] font-bold ${
                          active === 12 ? "text-[#50e991] font-bold" : " "
                      }`}
                  >
                      Hóa đơn
                  </h5>
              </Link>
          </div>

          <div className="w-full flex items-center p-4 hover:bg-neutral-content">
              <Link
                  to="/dashboard-create-purchase-invoice"
                  className="w-full flex items-center"
              >
                  <LiaFileInvoiceDollarSolid size={30}/>
                  <h5
                      className={`hidden 800px:block text-xl px-2 hover:text-[#e60049] font-bold ${
                          active === 13 ? "text-[#50e991] font-bold" : " "
                      }`}
                  >
                      Thêm phiếu nhập
                  </h5>
              </Link>
          </div>

          <div className="w-full flex items-center p-4 hover:bg-neutral-content">
              <Link
                  to="/dashboard-withdraw-money"
                  className="w-full flex items-center"
              >
                  <CiMoneyBill size={30}/>
                  <h5
                      className={`hidden 800px:block text-xl px-2 hover:text-[#e60049] font-bold ${
                          active === 7 ? "text-[#50e991] font-bold" : " "
                      }`}
                  >
                      Rút tiền
                  </h5>
              </Link>
          </div>

          <div className="w-full flex items-center p-4 hover:bg-neutral-content">
              <Link to="/dashboard-messages" className="w-full flex items-center">
                  <BiMessageSquareDetail size={30}/>
                  <h5
                      className={`hidden 800px:block text-xl px-2 hover:text-[#e60049] font-bold ${
                          active === 8 ? "text-[#50e991] font-bold" : " "
                      }`}
                  >
                      Tin nhắn
                  </h5>
              </Link>
          </div>

          <div className="w-full flex items-center p-4 hover:bg-neutral-content">
              <Link to="/dashboard-coupouns" className="w-full flex items-center">
                  <AiOutlineGift size={30}/>
                  <h5
                      className={`hidden 800px:block text-xl px-2 hover:text-[#e60049] font-bold ${
                          active === 9 ? "text-[#50e991] font-bold" : " "
                      }`}
                  >
                      Mã giảm giá
                  </h5>
              </Link>
          </div>

          <div className="w-full flex items-center p-4 hover:bg-neutral-content">
              <Link to="/dashboard-refunds" className="w-full flex items-center">
                  <HiOutlineReceiptRefund size={30}/>
                  <h5
                      className={`hidden 800px:block text-xl px-2 hover:text-[#e60049] font-bold ${
                          active === 10 ? "text-[#50e991] font-bold" : " "
                      }`}
                  >
                      Hoàn tiền
                  </h5>
              </Link>
          </div>

          <div className="w-full flex items-center p-4 hover:bg-neutral-content">
              <Link to="/dashboard-analytics" className="w-full flex items-center">
                  <IoAnalytics size={30}/>
                  <h5
                      className={`hidden 800px:block text-xl px-2 hover:text-[#e60049] font-bold ${
                          active === 14 ? "text-[#50e991] font-bold" : " "
                      }`}
                  >
                      Phân tích
                  </h5>
              </Link>
          </div>

          <div className="w-full flex items-center p-4 hover:bg-neutral-content">
              <Link to="/settings" className="w-full flex items-center">
                  <CiSettings size={30}/>
                  <h5
                      className={`hidden 800px:block text-xl px-2 hover:text-[#e60049] font-bold ${
                          active === 11 ? "text-[#50e991] font-bold" : " "
                      }`}
                  >
                      Sửa thông tin
                  </h5>
              </Link>
          </div>

          <div
              className="w-full flex items-center p-4 hover:bg-neutral-content"
              onClick={logoutHandler}
          >
              <AiOutlineLogout size={30}/>
              <h5
                  className={`hidden 800px:block text-xl px-2 hover:text-[#e60049] font-bold`}
              >
                  Đăng xuất
              </h5>
          </div>
      </div>
  );
};

export default DashboardSideBar;
