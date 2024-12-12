import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : ""
  );
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipcode] = useState(seller && seller.zipCode);

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setAvatar(file);

    const formData = new FormData();

    formData.append("image", e.target.files[0]);

    await axios
      .put(`${server}/shop/update-shop-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((res) => {
        dispatch(loadSeller());
        toast.success("Thay đổi Avatar thành công!");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/shop/update-seller-info`,
        {
          name,
          address,
          // zipCode,
          phoneNumber,
          description,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Cập nhật thông tin thành công!");
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="flex w-full 800px:w-[80%] flex-col justify-center my-5">
        <div className="w-full flex items-center justify-center">
          <div className="relative">
            <img
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : `${backend_url}/${seller.avatar}`
              }
              alt=""
              className="w-[200px] h-[200px] rounded-full cursor-pointer"
            />
            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleImage}
              />
              <label htmlFor="image">
                <AiOutlineCamera />
              </label>
            </div>
          </div>
        </div>

        {/* shop info */}
        <form
          aria-aria-required={true}
          className="flex flex-col items-center"
          onSubmit={updateHandler}
        >
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full">
              <label className="font-bold mb-2">Tên cửa hàng</label>
            </div>
            <input
              type="name"
              placeholder={`${seller.name}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered input-accent w-full"
              required
            />
          </div>
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full">
              <label className="font-bold mb-2">Mô tả</label>
            </div>
            <input
              type="name"
              placeholder={`${
                seller?.description
                  ? seller.description
                  : "Thêm mô tả cho cửa hàng của bạn..."
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input input-bordered input-accent w-full"
            />
          </div>
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full">
              <label className="font-bold mb-2">Địa chỉ cửa hàng</label>
            </div>
            <input
              type="name"
              placeholder={seller?.address}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input input-bordered input-accent w-full"
              required
            />
          </div>

          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full">
              <label className="font-bold mb-2">Số điện thoại</label>
            </div>
            <input
              type="number"
              placeholder={seller?.phoneNumber}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input input-bordered input-accent w-full"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full btn btn-success font-bold text-white mt-4"
            >
              Cập nhật thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
