import React, { useEffect, useState } from "react";
import {
  FaBagShopping,
  FaCashRegister,
  FaUserAstronaut,
  FaDna,
  FaRegMessage,
} from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { backend_url, server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import currency from "currency-formatter";

const OrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  const totalPriceWithoutShippingFee =
    data && data.cart
      ? data.cart.reduce((sum, item) => sum + item.price * item.qty, 0)
      : 0;

  const orderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/update-order-status/${id}`,
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Cập nhật đơn hàng thành công!");
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const refundOrderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/order-refund-success/${id}`,
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Cập nhật đơn hàng thành công!");
        dispatch(getAllOrdersOfShop(seller._id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleMessageSubmit = async () => {
    const groupTitle = seller._id + data.user._id;
    const userId = data.user._id;
    const sellerId = seller._id;
    await axios
      .post(`${server}/conversation/create-new-conversation`, {
        groupTitle,
        userId,
        sellerId,
      })
      .then((res) => {
        navigate(`/dashboard-messages?${res.data.conversation._id}`);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  console.log(data);
  return (
    <div className="py-4 min-h-screen mx-24">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <FaBagShopping size={30} />
          <h1 className="mx-2 font-bold text-accent text-xl uppercase">
            Chi tiết đơn hàng
          </h1>
        </div>
        <Link to="/dashboard-orders">
          <button className="btn btn-error uppercase text-white font-bold">
            Quay lại
          </button>
        </Link>
      </div>

      <div className="w-full flex items-center justify-between my-4">
        <h5>
          <span className="uppercase">ID đơn hàng: </span>
          <span className="font-bold">{data?._id}</span>
        </h5>
        <h5>
          <span className="uppercase">Thời gian: </span>
          <span className="font-bold">{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {data &&
        data?.cart.map((item, index) => (
          <div className="w-full flex items-start my-4">
            <img
              src={`${backend_url}/${item.images[0]}`}
              alt=""
              className="w-24 rounded"
            />
            <div className="w-full mx-2">
              <h5 className="font-bold text-xl">{item.name}</h5>
              <h5 className="text-xl">
                {currency.format(item.price, { code: "VND" })} x {item.qty}
              </h5>
            </div>
          </div>
        ))}

      <div className="border-t w-full text-right flex flex-col py-4">
        <h5>
          <span className="uppercase font-bold">Phí giao hàng: </span>
          <span className="font-bold text-accent">
            {data &&
              `${currency.format(
                data.totalPrice - totalPriceWithoutShippingFee,
                { code: "VND" }
              )}`}
          </span>
        </h5>
        <h5>
          <span className="uppercase font-bold">Tổng tiền: </span>
          <span className="font-bold  text-accent">
            {data && `${currency.format(data.totalPrice, { code: "VND" })}`}
          </span>
        </h5>
      </div>
      <div className="w-full 800px:flex">
        <div className="w-full">
          <div className="my-4 flex">
            <FaUserAstronaut size={30} />
            <span className="font-bold text-xl uppercase text-accent mx-2">
              Thông tin khách hàng
            </span>
          </div>
          <h4 className="text-lg">
            <span className="uppercase">Tên khách hàng:</span>{" "}
            <span className="font-bold">{data?.user?.name}</span>
          </h4>
          <h4 className="text-lg">
            <span className="uppercase">Địa chỉ:</span>{" "}
            <span className="font-bold">{data?.shippingAddress.address1}</span>
          </h4>
          {/* <h4 className=" text-[20px]">{data?.shippingAddress.country}</h4> */}
          {/* <h4 className=" text-[20px]">{data?.shippingAddress.city}</h4> */}
          <h4 className="text-lg">
            <span className="uppercase">Số điện thoại:</span>{" "}
            <span className="font-bold">
              {data?.shippingAddress?.phoneNumber}
            </span>
          </h4>
        </div>
        <div className="w-full">
          <div className="my-4 flex">
            <FaCashRegister size={30} />
            <span className="font-bold text-xl uppercase text-accent mx-2">
              Thông tin đơn hàng
            </span>
          </div>
          <h4 className="text-lg">
            <span className="uppercase">Trạng thái:</span>{" "}
            <span className="font-bold">
              {data?.paymentInfo?.status
                ? data?.paymentInfo?.status
                : "Chưa thanh toán"}
            </span>
          </h4>
        </div>
      </div>
      <div className="my-4 flex">
        <FaDna size={30} />
        <span className="font-bold text-xl uppercase text-accent mx-2">
          Trạng thái đơn hàng
        </span>
      </div>
      {data?.status !== "Processing refund" &&
        data?.status !== "Refund Success" && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select select-accent w-full max-w-xs"
          >
            {[
              "Processing",
              "Transferred to delivery partner",
              "Shipping",
              "Received",
              "On the way",
              "Delivered",
            ]
              .slice(
                [
                  "Processing",
                  "Transferred to delivery partner",
                  "Shipping",
                  "Received",
                  "On the way",
                  "Delivered",
                ].indexOf(data?.status)
              )
              .map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
          </select>
        )}
      {data?.status === "Processing refund" ||
      data?.status === "Refund Success" ? (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
          {["Processing refund", "Refund Success"]
            .slice(
              ["Processing refund", "Refund Success"].indexOf(data?.status)
            )
            .map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
        </select>
      ) : null}

      <div className="mx-2">
        <button
          onClick={handleMessageSubmit}
          className="btn btn-info text-white font-bold my-2"
        >
          Gửi tin nhắn <FaRegMessage size={24} />
        </button>
      </div>

      <button
        className="btn btn-accent font-bold text-white uppercase mx-2"
        onClick={
          data?.status !== "Processing refund"
            ? orderUpdateHandler
            : refundOrderUpdateHandler
        }
      >
        Cập nhật
      </button>
    </div>
  );
};

export default OrderDetails;
