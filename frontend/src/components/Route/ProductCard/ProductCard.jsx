import React, { useState } from "react";
import currency from "currency-formatter";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { backend_url } from "../../../server";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { useEffect } from "react";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

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

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Sản phẩm đã có trong giỏ hàng!");
    } else {
      if (data.stock < 1) {
        toast.error("Sản phẩm số lượng có giới hạn!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Đã thêm vào giỏ hàng!");
      }
    }
  };

  return (
    <div className="w-full h-96 bg-white rounded shadow-lg relative cursor-pointer p-4">
      <Link to={`/product/${data._id}`}>
        <img
          src={`${backend_url}${data.images && data.images[0]}`}
          alt=""
          className="w-40 block mx-auto h-40 object-contain rounded"
        />
      </Link>
      <Link to={`/shop/preview/${data?.shop._id}`}>
        <h5 className="text-sm italic my-2">
          {" "}
          {data.shop.name.length > 20
            ? data.shop.name.slice(0, 15) + "..."
            : data.shop.name}
        </h5>
      </Link>
      <Link to={`/product/${data._id}`}>
        <h4 className="font-bold mb-2">
          {data.name.length > 35 ? data.name.slice(0, 27) + "..." : data.name}
        </h4>

        <div className="flex">
          <Ratings rating={data?.ratings} />
        </div>

        <div className="py-2 flex items-center justify-between">
          <div className="text-xl font-bold">
            {currency.format(data.price, { code: "VND" })}
          </div>
          <span className="font-bold text-success">
            Đã bán {data?.sold_out}
          </span>
        </div>
        {data?.stock === 0 && (
          <p className="font-bold text-error">
            Hết hàng
          </p>
        )}
      </Link>

      {/* side options */}
      <div>
        {click ? (
          <AiFillHeart
            size={24}
            className="cursor-pointer absolute right-2 top-5"
            onClick={() => removeFromWishlistHandler(data)}
            color={click ? "red" : "#333"}
            title="Xóa khỏi giỏ hàng yêu thích"
          />
        ) : (
          <AiOutlineHeart
            size={24}
            className="cursor-pointer absolute right-2 top-5"
            onClick={() => addToWishlistHandler(data)}
            color={click ? "red" : "#333"}
            title="Thêm vào giỏ hàng yêu thích"
          />
        )}
        <AiOutlineEye
          size={24}
          className="cursor-pointer absolute right-2 top-14"
          onClick={() => setOpen(!open)}
          color="#333"
          title="Xem nhanh"
        />
        <AiOutlineShoppingCart
          size={24}
          className="cursor-pointer absolute right-2 top-24"
          onClick={() => addToCartHandler(data._id)}
          color="#444"
          title="Thêm vào giỏ hàng"
        />
        {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
      </div>
    </div>
  );
};

export default ProductCard;
