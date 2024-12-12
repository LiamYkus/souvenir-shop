import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { backend_url, server } from "../server";
import { RxCross1 } from "react-icons/rx";
import {
  FaBagShopping,
  FaMotorcycle,
  FaCashRegister,
  FaRegMessage,
} from "react-icons/fa6";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import currency from "currency-formatter";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch]);

  // useEffect(() => {
  //   const getConversation = async () => {
  //     try {
  //       const resonse = await axios.get(
  //         `${server}/conversation/get-all-conversation-user/${user?._id}`,
  //         {
  //           withCredentials: true,
  //         }
  //       );

  //       setConversations(resonse.data.conversations);
  //     } catch (error) {
  //       // console.log(error);
  //     }
  //   };
  //   getConversation();
  // }, [user]);
  // const conversation = conversations.find((conversation) => {
  //   return conversation.members.includes(user._id);
  // });

  const data = orders && orders.find((item) => item._id === id);
  const totalPriceWithoutShippingFee =
    data && data.cart
      ? data.cart.reduce((sum, item) => sum + item.price * item.qty, 0)
      : 0;
  const reviewHandler = async (e) => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
        setComment("");
        setRating(null);
        setOpen(false);
      })
      .then((res) => {
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const refundHandler = async () => {
    await axios
      .put(`${server}/order/order-refund/${id}`, {
        status: "Processing refund",
      })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      // const groupTitle = data._id + user._id;
      const groupTitle = data.shop + user._id;
      const userId = user._id;
      const sellerId = data.shop;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Vui lòng đăng nhập để nhắn tin");
    }
  };

  console.log(data);

  return (
    <div className="py-4 min-h-screen mx-24">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <FaBagShopping size={30} />
          <h1 className="mx-2 font-bold text-accent text-xl uppercase">
            Thông tin đơn hàng
          </h1>
        </div>
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
        data?.cart.map((item, index) => {
          return (
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
              {!item.isReviewed && data?.status === "Delivered" ? (
                <button
                  className="btn btn-accent text-white font-bold"
                  onClick={() => setOpen(true) || setSelectedItem(item)}
                >
                  Đánh giá SP
                </button>
              ) : null}
            </div>
          );
        })}

      {/* review popup */}
      {open && (
        <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
          <div className="w-[50%] h-min bg-[#fff] shadow rounded-md p-3">
            <div className="w-full flex justify-end">
              <RxCross1
                size={36}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-xl font-bold uppercase text-center my-2">
              Đánh giá sản phẩm
            </h2>
            <div className="w-full flex ">
              <img
                src={`${backend_url}/${selectedItem?.images[0]}`}
                alt=""
                className="w-24 rounded"
              />
              <div className="w-full mx-2">
                <div className="font-bold text-xl">{selectedItem?.name}</div>
                <h4 className="text-xl">
                  {currency.format(selectedItem?.price, {
                    code: "VND",
                  })}{" "}
                  x {selectedItem?.qty}
                </h4>
              </div>
            </div>
            {/* ratings */}
            <h5 className="mt-2 font-bold text-lg uppercase">
              Đánh giá :<span className="text-red-500">*</span>
            </h5>
            <div className="flex w-full">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(255,255,0)"
                    size={24}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(255,255,0)"
                    size={24}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <div className="w-full my-2">
              <label className="block font-bold uppercase text-lg">
                Viết đánh giá
                <span className="mx-2 text-neutral-content">
                  (không bắt buộc)
                </span>
              </label>
              <textarea
                name="comment"
                id=""
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Hãy để lại bình luận, nhận xét của bạn về sản phẩm nhé, điều này cực kì hữu ích cho những người mua khác và cả chính cửa hàng đó!"
                className="textarea textarea-accent w-full"
              ></textarea>
            </div>
            <button
              className="btn btn-success text-white font-bold"
              onClick={rating > 1 ? reviewHandler : null}
            >
              Gửi
            </button>
          </div>
        </div>
      )}

      <div className="border-t w-full text-right">
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
      </div>
      <div className="w-full 800px:flex">
        <div className="w-full">
          <div className="my-4 flex">
            <FaMotorcycle size={36} />
            <span className="font-bold text-xl uppercase text-accent mx-2">
              Thông tin giao hàng
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
        <div className="w-full flex flex-col">
          <div className="my-4 flex">
            <FaCashRegister size={36} />
            <span className="font-bold text-xl uppercase text-accent mx-2">
              Thông tin thanh toán
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
          {data?.status === "Delivered" && (
            <div>
              <button
                onClick={refundHandler}
                className="btn btn-warning font-bold text-white uppercase my-2"
              >
                Yêu cầu trả hàng
              </button>
            </div>
          )}
          <div>
            <button
              onClick={handleMessageSubmit}
              className="btn btn-info text-white font-bold my-2"
            >
              Gửi tin nhắn <FaRegMessage size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetails;
