import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const { allCategories } = useSelector((state) => state.categories);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Sản phẩm được tạo thành công");
      navigate("/dashboard");
      window.location.reload();
    }
  }, [dispatch]);

  const handleImageChange = (e) => {
    e.preventDefault();

    let files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (price < 0) {
      toast.error("Tạo sản phẩm thất bại!");
      return;
    }

    const newForm = new FormData();

    images.forEach((image) => {
      newForm.append("images", image);
    });
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("price", price);
    newForm.append("shopId", seller._id);
    dispatch(createProduct(newForm));
    toast.success("Sản phẩm đã được tạo thành công!");
    navigate(`/dashboard-products`);
    window.location.reload();
  };

  return (
    <div className="w-full bg-white mx-4">
      <h5 className="font-bold text-xl text-center uppercase my-4">
        Thêm sản phẩm
      </h5>
      {/* create product form */}
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên sản phẩm..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Mô tả <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Thêm mô tả sản phẩm..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Thể loại <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a category">Chọn danh mục SP</option>
            {allCategories?.map((i) => (
              <option value={i.name} key={i._id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Giá</label>
          <input
            type="number"
            name="price"
            value={price}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Thêm giá của sản phẩm"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Hình ảnh <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name=""
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
            required
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {images &&
              images.map((i) => (
                <img
                  src={URL.createObjectURL(i)}
                  key={i}
                  alt=""
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
          </div>
          <br />
          <div>
            <button
              type="submit"
              className="btn btn-accent font-bold w-full text-white"
            >
              Thêm sản phẩm
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
