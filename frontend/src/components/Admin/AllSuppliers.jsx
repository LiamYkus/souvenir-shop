import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import {
  createSupplier,
  getAllSuppliers,
  deleteSupplier,
} from "../../redux/actions/supplier";
import { FaTrash, FaModx } from "react-icons/fa6";
import { backend_url } from "../../server";

const AllBanners = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState("");
  const [preview, setPreview] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState("");

  const { isLoading, allSuppliers } = useSelector((state) => state.suppliers);

  const dispatch = useDispatch();

  const handlePreview = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setPreview(file.preview);
  };

  const handleDelete = (id) => {
    try {
      dispatch(deleteSupplier(id));
      toast.success("Xóa nhà cung cấp thành công!");
    } catch (error) {
      toast.error("Xóa nhà cung cấp thất bại!");
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && image && address && phoneNumber && email) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", image);
      formData.append("address", address);
      formData.append("phoneNumber", phoneNumber);
      formData.append("email", email);
      console.log(formData)
      dispatch(createSupplier(formData));
      setName("");
      setImage(null);
      setPreview(null);
      setAddress("");
      setPhoneNumber("");
      setEmail("");
      toast.success("Nhà cung cấp đã được thêm thành công!");
    } else {
      toast.error("Thêm nhà cung cấp thất bại!");
    }
  };

  const columns = [
    { field: "id", headerName: "ID Nhà cung cấp", flex: 1, hide: true },
    {
      field: "name",
      headerName: "Tên nhà cung cấp",
      flex: 1,
    },
    {
      field: "image",
      headerName: "Hình ảnh",
      flex: 1,
      renderCell: (params) => {
        return (
          <img
            src={`${backend_url}${params.row.image}`}
            className="max-w-full	max-h-full object-cover rounded"
          />
        );
      },
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },

    {
      field: "phoneNumber",
      headerName: "Số điện thoại",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "delete",
      flex: 0.5,
      headerName: "Xóa",
      headerAlign: "left",
      align: "left",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.row.id)}>
              <FaTrash size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  allSuppliers &&
    allSuppliers.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        image: item.image,
        address: item.address,
        phoneNumber: item.phoneNumber,
        email: item.email,
      });
    });

  console.log(allSuppliers);

  return (
    <div className="w-full m-4">
      <div className="flex justify-between">
        <form onSubmit={handleSubmit}>
          <div className="flex mb-6">
            <div className="w-full">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Tên nhà cung cấp
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex mb-6">
            <div className="w-full">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Hình ảnh
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="file"
                onChange={(e) => {
                  setImage(e.target.files[0]); // Set image state
                  handlePreview(e);
                }}
              />
            </div>
          </div>

          <div className="flex mb-6">
            <div className="w-full">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Địa chỉ
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="flex mb-6">
            <div className="w-full">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Số điện thoại
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="flex mb-6">
            <div className="w-full">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Email
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-display font-semibold py-2 px-4 rounded"
            >
              Upload
            </button>
          </div>
        </form>
        <div className="mx-auto">
          {preview && (
            <img src={preview} alt="Preview" className="h-96 rounded" />
          )}
        </div>
      </div>
      <div className="my-4">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
};

export default AllBanners;
