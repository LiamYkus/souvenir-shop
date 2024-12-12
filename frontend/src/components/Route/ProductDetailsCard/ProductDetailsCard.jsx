import React, { useEffect, useState } from "react";
import {
  FaCartShopping,
  FaHeart,
  FaStar,
  FaArrowTrendUp,
  FaRegMessage,
  FaX,
} from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import currency from "currency-formatter";
import axios from "axios";
import { backend_url, server } from "../../../server";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  //   const [select, setSelect] = useState(false);

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
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
      toast.error("Please login to create a conversation");
    }
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Sản phẩm đã có trong giỏ hàng!");
    } else {
      if (data.stock < count) {
        toast.error("Sản phẩm số lượng có giới hạn!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Sản phẩm đã thêm vào giỏ hàng!");
      }
    }
  };

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };
  return (
    <div className="bg-white rounded">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="h-4/5 w-4/5 800px:w-3/4 overflow-y-scroll bg-white rounded shadow p-4 relative">
            <FaX
              size={24}
              className="top-0 right-0 absolute 800px:top-2 800px:right-2 z-50"
              onClick={() => setOpen(false)}
            />

            <div className="block mt-2 w-full 800px:flex 800px:m-0">
              <div className="w-full 800px:w-1/2">
                <img
                  src={`${backend_url}${data.images && data.images[0]}`}
                  alt=""
                  className="rounded "
                />
              </div>

              <div className="w-full 800px:w-1/2">
                <h1 className="font-bold text-2xl m-4">{data.name}</h1>
                <div className="flex m-4">
                  <div className="text-xl font-bold">
                    {currency.format(data.price, { code: "VND" })}
                  </div>
                </div>
                {
                  <p className="m-4 whitespace-pre-line">
                    {data.description.length > 200 ? (
                      <>
                        {data.description.slice(0, 130)} ...
                        <Link to={`/product/${data._id}`}>
                          {" "}
                          <p className="italic">Nhấn để xem thêm</p>
                        </Link>
                      </>
                    ) : (
                      data.description
                    )}
                  </p>
                }
                <div className="flex flex-col w-32 rounded-lg relative bg-transparent m-4">
                  <div className="flex">
                    <button
                      className="bg-error text-gray-600 hover:text-gray-700 hover:bg-gray-300 h-full w-20 rounded-l cursor-pointer outline-none"
                      onClick={decrementCount}
                    >
                      <span className="m-auto text-2xl font-bold">−</span>
                    </button>

                    <input
                      type="number"
                      className="outline-none focus:outline-none text-center w-full bg-base-100 font-bold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none"
                      value={count}
                    />

                    <button
                      className="bg-success text-gray-600 hover:text-gray-700 hover:bg-gray-300 h-full w-20 rounded-r cursor-pointer"
                      onClick={incrementCount}
                    >
                      <span className="m-auto text-2xl font-bold">+</span>
                    </button>
                  </div>
                </div>
                <div className="m-4">
                  {click ? (
                    <>
                      <button
                        onClick={() => removeFromWishlistHandler(data)}
                        className="btn btn-error font-bold flex text-white"
                      >
                        <FaHeart size={24} />
                        Đã thích
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => addToWishlistHandler(data)}
                      className="btn font-bold flex text-black"
                    >
                      <FaHeart size={24} />
                      Thích
                    </button>
                  )}
                </div>
                <div className="m-4">
                  <button
                    onClick={() => addToCartHandler(data._id)}
                    className="btn btn-accent text-white font-bold flex"
                  >
                    <FaCartShopping size={24} />
                    Thêm vào giỏ
                  </button>
                </div>

                <div className="m-4">
                  <button
                    onClick={handleMessageSubmit}
                    className="btn btn-info text-white font-bold flex"
                  >
                    <FaRegMessage size={24} />
                    Gửi tin nhắn
                  </button>
                </div>

                <div className="stats shadow m-4 w-full">
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      <FaStar size={24} color="yellow" />
                    </div>
                    <div className="stat-title">Đánh giá</div>
                    <div className="stat-value text-primary">
                      {data?.ratings}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <FaArrowTrendUp size={24} color="red" />
                    </div>
                    <div className="stat-title">Đã bán</div>
                    <div className="stat-value text-secondary">
                      {data?.sold_out}
                    </div>
                    <div className="stat-desc">Còn lại {data?.stock}</div>
                  </div>
                  <div className="stat">
                    <Link to={`/shop/preview/${data.shop._id}`}>
                      <div className="stat-title">Xem chi tiết</div>
                      <div className="stat-figure text-secondary">
                        <div className="avatar">
                          <div className="w-16 rounded-full">
                            <img src={`${backend_url}${data?.shop?.avatar}`} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
