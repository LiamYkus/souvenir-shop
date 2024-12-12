import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { FaArrowLeft } from "react-icons/fa6";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  return (
    <div className="w-full h-[80vh] flex flex-col justify-center items-center">
      {data && data?.status === "Processing" ? (
        <h1 className="text-xl uppercase font-bold">
          Đơn hàng đang được xử lý.
        </h1>
      ) : data?.status === "Transferred to delivery partner" ? (
        <h1 className="text-xl uppercase font-bold">
          Đơn hàng của bạn đang trên đường giao cho đối tác giao hàng.
        </h1>
      ) : data?.status === "Shipping" ? (
        <h1 className="text-xl uppercase font-bold">
          Đơn đặt hàng của bạn đang được vận chuyển với đối tác giao hàng của
          chúng tôi.
        </h1>
      ) : data?.status === "Received" ? (
        <h1 className="text-xl uppercase font-bold">
          Đơn hàng đã đến khu vực của bạn và chuẩn bị giao hàng.
        </h1>
      ) : data?.status === "On the way" ? (
        <h1 className="text-xl uppercase font-bold">Đang giao hàng.</h1>
      ) : data?.status === "Delivered" ? (
        <h1 className="text-xl uppercase font-bold text-success">
          Đơn hàng đã được giao!
        </h1>
      ) : data?.status === "Processing refund" ? (
        <h1 className="text-xl uppercase font-bold">
          Yêu cầu trả hàng và hoàn tiền đang được xử lý!
        </h1>
      ) : data?.status === "Refund Success" ? (
        <h1 className="text-xl uppercase font-bold text-success">
          Trả hàng và hoàn tiền thành công!
        </h1>
      ) : null}
      <Link to={"/profile"} className="flex my-4">
        <FaArrowLeft size={24} />
        <span className="font-bold uppercase text-xl">
          Trở về trang tổng quan
        </span>
      </Link>
    </div>
  );
};

export default TrackOrder;
