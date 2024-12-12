import React, { useState } from "react";
import { Link } from "react-router-dom";
import { backend_url } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import currency from "currency-formatter";
import {
  FaBagShopping,
  FaCircleArrowDown,
  FaCircleArrowUp,
  FaX,
} from "react-icons/fa6";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {cart && cart.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <FaX
                size={24}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5>Giỏ hàng trống !</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end p-2">
                <FaX
                  size={24}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>
              {/* Item length */}
              <div className="flex mx-4">
                <FaBagShopping size={24} />
                <h5 className="font-bold ml-2">
                  {cart && cart.length} Sản phẩm
                </h5>
              </div>

              {/* cart Single Items */}
              <br />
              <div className="w-full border-t">
                {cart &&
                  cart.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                    />
                  ))}
              </div>
            </div>

            <div className="m-4">
              {/* checkout buttons */}
              <Link to="/checkout">
                <button className="btn btn-accent font-bold text-white w-full">
                  Mua({`${currency.format(totalPrice, { code: "VND" })}`})
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.price * value;

  const increment = (data) => {
    if (data.stock < value + 1) {
      toast.error("Số lượng sản phẩm có hạn!");
    } else {
      setValue(value + 1);
      const updateCartData = { ...data, qty: value + 1 };
      quantityChangeHandler(updateCartData);
    }
  };

  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <FaCircleArrowUp
              size={24}
              color="#50e991"
              onClick={() => increment(data)}
            />
            <span className="pl-[10px]">{data.qty}</span>
            <FaCircleArrowDown
              size={24}
              color="#e60049"
              onClick={() => decrement(data)}
            />
          </div>
          <img
            src={`${backend_url}${data?.images[0]}`}
            alt=""
            className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
          />
          <div className="pl-[5px]">
            <h1>{data.name}</h1>
            <h4 className="font-[400] text-[15px] text-[#00000082]">
              {`${currency.format(data.price, { code: "VND" })}`} * {value}
            </h4>
            <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
              {/* US${totalPrice} */}
              {`${currency.format(totalPrice, { code: "VND" })}`}
            </h4>
          </div>
        </div>
        <FaX
          size={24}
          color="#e60049"
          onClick={() => removeFromCartHandler(data)}
        />
      </div>
    </div>
  );
};

export default Cart;
