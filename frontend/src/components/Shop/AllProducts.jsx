import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import {
  FaFilePen,
  FaLink,
  FaTrash,
  FaEye,
  FaCircleCheck,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";
import { updateProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import currency from "currency-formatter";
import { toast } from "react-toastify";
import { AiOutlinePlusCircle } from "react-icons/ai";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const handleImageChange = (e) => {
    e.preventDefault();

    let files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
  };

  const averagePriceIn =
    selectedProduct &&
    selectedProduct.invoices.reduce((sum, i) => sum + i.price, 0) /
      selectedProduct.invoices.length;

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      if (price < 0 || price < averagePriceIn) {
        toast.error("Cập nhật sản phẩm thất bại!");
        return;
      }
      const newForm = new FormData();
      images.forEach((image) => {
        newForm.append("images", image);
      });
      newForm.append("name", name);
      newForm.append("description", description);
      newForm.append("price", price);
      newForm.append("shopId", seller._id);
      dispatch(updateProduct(selectedProduct._id, newForm));
      setSelectedProduct(null);
      toast.success("Cập nhật sản phẩm thành công!");
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {}
  };
  const columns = [
    { field: "id", headerName: "ID SP", hide: true },
    {
      field: "name",
      headerName: "Tên sản phẩm",
      flex: 2,
    },
    {
      field: "price",
      headerName: "Giá",
      flex: 1,
    },
    {
      field: "stock",
      headerName: "Số lượng",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },

    {
      field: "sold",
      headerName: "Đã bán",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "update",
      flex: 1,
      headerName: "Sửa",
      headerAlign: "left",
      align: "left",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() =>
                setSelectedProduct(products.find((p) => p._id === params.id))
              }
            >
              <FaFilePen size={20} />
            </Button>
          </>
        );
      },
    },
    {
      field: "delete",
      flex: 1,
      headerName: "Xóa",
      type: "number",
      headerAlign: "left",
      align: "left",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <FaTrash size={20} />
            </Button>
          </>
        );
      },
    },
    {
      field: "detail",
      headerName: "Chi tiết",
      flex: 1,
      headerAlign: "left",
      align: "left",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <FaLink size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "isActive",
      headerName: "Active",
      flex: 1,
      headerAlign: "left",
      align: "left",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {params.row.isActive ? (
              <FaCircleCheck color="#50e991" size={24} />
            ) : (
              <FaCircleCheck color="#e60049" size={24} />
            )}
          </>
        );
      },
    },
  ];

  const row = [];

  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: `${currency.format(item.price, {
          code: "VND",
        })}`,
        stock: item.stock,
        sold: item?.sold_out,
        isActive: item?.isActive,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-4 bg-white">
          <div className="my-4 text-xl font-bold uppercase">
            Tất cả sản phẩm
          </div>
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />

          {selectedProduct && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex items-center justify-center z-[9999]">
              <div className="bg-white p-4 rounded w-1/2">
                <h2 className="text-xl font-bold uppercase text-center">
                  Cập nhật sản phẩm
                </h2>
                <form onSubmit={handleSubmit}>
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
                      placeholder={selectedProduct.name}
                    />
                  </div>
                  <div className="mt-2">
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
                      placeholder={selectedProduct.description}
                    ></textarea>
                  </div>
                  <div className="mt-2">
                    <label className="pb-2">
                      Giá{" "}
                      <span className="text-error">
                        Giá nhập trung bình hiện tại là {averagePriceIn}
                      </span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={price}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder={selectedProduct.price}
                    />
                  </div>
                  <div className="mt-2">
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
                    />
                    <div className="w-full flex items-center flex-wrap mb-2">
                      <label htmlFor="upload">
                        <AiOutlinePlusCircle
                          size={30}
                          className="mt-3"
                          color="#555"
                        />
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
                    <div className="flex flex-col mt-2">
                      <button
                        type="submit"
                        className="btn btn-accent font-bold w-full text-white"
                      >
                        Cập nhật sản phẩm
                      </button>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="btn btn-error text-white font-bold mt-2"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllProducts;
