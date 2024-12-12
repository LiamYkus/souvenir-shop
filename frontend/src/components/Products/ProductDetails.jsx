import React, { useEffect, useState } from "react";
import currency from "currency-formatter";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaRegMessage } from "react-icons/fa6";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { backend_url, server } from "../../server";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const { id } = useParams();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist]);


  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };
  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Sản phẩm đã có trong giỏ hàng!");
    } else {
      if (data.stock < 1) {
        toast.error("Sản phẩm có số lượng giới hạn!");
      } else if (data.stock < count) {
        toast.error("Sản phẩm có số lượng giới hạn!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Sản phẩm đã thêm vào giỏ hàng!");
      }
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(2);
  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      // const groupTitle = data._id + user._id;
      const groupTitle = data.shop._id + user._id;

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
      toast.error("Vui lòng đăng nhập để nhắn tin");
    }
  };
  return (
    <div className="bg-white">
      {data ? (
        <div className="mx-24">
          <div className="w-full my-4">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={`${backend_url}${data && data.images[select]}`}
                  alt=""
                  className="w-[80%] rounded-[8px]"
                />
                <div className="w-full flex">
                  {data &&
                    data.images.map((i, index) => (
                      <div
                        className={`${
                          select === 0 ? "border" : "null"
                        } cursor-pointer`}
                      >
                        <img
                          src={`${backend_url}${i}`}
                          alt=""
                          className="h-[115px] overflow-hidden mr-3 mt-3"
                          onClick={() => setSelect(index)}
                        />
                      </div>
                    ))}
                  <div
                    className={`${
                      select === 1 ? "border" : "null"
                    } cursor-pointer`}
                  ></div>
                </div>
              </div>
              <div className="w-full 800px:w-[50%]">
                <h1 className="font-bold text-2xl">{data.name}</h1>
                <div>
                  Thể loại: <i className="text-error">{data.category}</i>
                </div>
                <span className="font-bold text-success">
                  Đã bán {data?.sold_out} sản phẩm
                </span>
                <div className="text-xl font-bold">
                  {currency.format(data.price, { code: "VND" })}
                </div>
                <div className="font-bold text-warning">
                  Còn lại {data?.stock} sản phẩm
                </div>

                <div className="flex flex-row h-10 w-32 rounded-lg relative bg-transparent my-4">
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
                <div className="flex flex-col items-start my-4">
                  {data?.stock === 0 ? (
                    <p className="text-xl font-bold text-error">
                      Sản phẩm hiện đang hết hàng
                    </p>
                  ) : (
                    <button
                      onClick={() => addToCartHandler(data._id)}
                      className="btn btn-outline btn-info text-white font-bold text-xl rounded"
                    >
                      Thêm vào giỏ hàng <AiOutlineShoppingCart size={24} />
                    </button>
                  )}
                  <div className="flex items-center mt-2">
                    {click ? (
                      <>
                        <AiFillHeart
                          size={40}
                          className="cursor-pointer"
                          onClick={() => removeFromWishlistHandler(data)}
                          color={click ? "red" : "#333"}
                          title="Xóa khỏi mục yêu thích"
                        />
                        <span className="text-xl font-semibold ml-2">
                          Đã thích{" "}
                        </span>
                      </>
                    ) : (
                      <>
                        <AiOutlineHeart
                          size={40}
                          className="cursor-pointer"
                          onClick={() => addToWishlistHandler(data)}
                          color={click ? "red" : "#333"}
                          title="Thêm vào mục yêu thích"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col my-8">
                  <div className="flex">
                    <Link to={`/shop/preview/${data?.shop._id}`}>
                      <div className="avatar">
                        <div className="w-24 rounded-full">
                          <img src={`${backend_url}${data?.shop?.avatar}`} />
                        </div>
                      </div>
                    </Link>
                    <Link to={`/shop/preview/${data?.shop._id}`}>
                      <div className="font-bold text-lg">{data.shop.name}</div>
                    </Link>
                  </div>
                  {isAuthenticated && (
                    <div>
                      <button
                        onClick={handleMessageSubmit}
                        className="btn btn-info text-white font-bold"
                      >
                        Gửi tin nhắn <FaRegMessage size={24} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={`font-bold text-lg uppercase ${
              active === 1 ? "text-info" : ""
            }`}
            onClick={() => setActive(1)}
          >
            Giới thiệu
          </h5>
        </div>
        <div className="relative">
          <h5
            className={`font-bold text-lg uppercase ${
              active === 2 ? "text-warning" : ""
            }`}
            onClick={() => setActive(2)}
          >
            Đánh giá
          </h5>
        </div>
        <div className="relative">
          <h5
            className={`font-bold text-lg uppercase ${
              active === 3 ? "text-accent" : ""
            }`}
            onClick={() => setActive(3)}
          >
            Cửa hàng
          </h5>
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center overflow-y-scroll">
          {data &&
            data.reviews.map((item, index) => (
              <div className="w-full flex my-2 bg-base-200 rounded">
                <div className="avatar m-2">
                  <div className="w-24 rounded-full">
                    <img src={`${backend_url}/${item.user.avatar}`} />
                  </div>
                </div>
                <div className="mx-2">
                  <div className="w-full flex items-center">
                    <h1 className="font-bold text-xl mr-2 text-accent">
                      {item.user.name}
                    </h1>
                    <Ratings rating={data?.ratings} />
                  </div>
                  <div className="items-center">
                    <p>{item.comment}</p>
                  </div>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data && data.reviews.length === 0 && (
              <h5>Sản phẩm chưa có đánh giá!</h5>
            )}
          </div>
        </div>
      ) : null}

      {active === 3 && (
        <div className="w-full block 800px:flex m-2">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data.shop._id}`}>
              <div className="flex items-center">
                <div className="avatar">
                  <div className="w-24 rounded-full">
                    <img src={`${backend_url}${data?.shop?.avatar}`} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-accent">
                    {data.shop.name}
                  </h3>
                  <h5 className="font-bold text-warning">
                    ({averageRating}/5) đánh giá
                  </h5>
                </div>
              </div>
            </Link>
            <p className="pt-2">{data.shop.description}</p>
          </div>
          <div className="w-full 800px:w-[50%] 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-bold">
                Tham gia: <span>{data.shop?.createdAt?.slice(0, 10)}</span>
              </h5>
              <h5 className="font-bold mt-2">
                Số lượng sản phẩm: <span>{products && products.length}</span>
              </h5>
              <h5 className="font-bold mt-2">
                Số lượng Review: <span>{totalReviewsLength}</span>
              </h5>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
