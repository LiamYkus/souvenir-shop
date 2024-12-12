import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { createCategory, deleteCategory } from "../../redux/actions/category";
import { FaTrash } from "react-icons/fa6";
import { backend_url } from "../../server";

const AllCategories = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const { isLoading, allCategories } = useSelector((state) => state.categories);

  const dispatch = useDispatch();

  const handlePreview = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setPreview(file.preview);
  };

  const handleDelete = (id) => {
    try {
      dispatch(deleteCategory(id));
      toast.success("Xóa danh mục thành công!");
    } catch (error) {
      toast.error("Xóa danh mục thất bại!");
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && image) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", image);
      console.log(formData.get("name"));
      dispatch(createCategory(formData));
      setName("");
      setImage(null);
      setPreview(null);
      toast.success("Danh mục đã được thêm thành công!");
    } else {
      toast.error("Thêm danh mục thất bại!");
    }
  };

  console.log(allCategories);

  const columns = [
    { field: "id", headerName: "ID Danh mục", flex: 1, hide: true },
    {
      field: "name",
      headerName: "Tên danh mục",
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
  allCategories &&
    allCategories.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        image: item.image,
      });
    });

  return (
    <div className="w-full m-4">
      <div className="flex justify-between">
        <form onSubmit={handleSubmit}>
          <div className="flex mb-6">
            <div className="w-full">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Tên danh mục
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

export default AllCategories;
