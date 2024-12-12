import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import {
  createBanner,
  deleteBanner,
  updateBanner,
  getAllBanners,
} from "../../redux/actions/banner";
import { FaTrash, FaModx } from "react-icons/fa6";
import { backend_url } from "../../server";

const AllBanners = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [link, setLink] = useState("");
  const [preview, setPreview] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [updateIsActive, setUpdateIsActive] = useState(false);

  const { isLoading, allBanners } = useSelector((state) => state.banners);

  const dispatch = useDispatch();

  const handlePreview = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setPreview(file.preview);
  };

  const handleDelete = (id) => {
    try {
      dispatch(deleteBanner(id));
      toast.success("Xóa banner thành công!");
    } catch (error) {
      toast.error("Xóa banner thất bại!");
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const handleUpdate = () => {
    try {
      const dataToSend = { isActive: updateIsActive };
      dispatch(updateBanner(selectedBanner, dataToSend));
      toast.success("Cập nhật banner thành công!");
    } catch (error) {
      toast.error("Cập nhật banner thất bại!");
    } finally {
      setSelectedBanner(null);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && image && link) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", image);
      formData.append("link", link);
      formData.append("isActive", isActive);
      dispatch(createBanner(formData));
      setName("");
      setImage(null);
      setPreview(null);
      setLink("");
      setPreview(null);
      setIsActive(false);
      toast.success("Banner đã được tạo thành công!");
    } else {
      toast.error("Banner đã được tạo thất bại!");
    }
  };

  const handleChangeCheckbox = (e) => {
    setUpdateIsActive(e.target.checked);
  };

  const columns = [
    { field: "id", headerName: "ID Banner", flex: 1, hide: true },
    {
      field: "name",
      headerName: "Tên Banner",
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
      field: "link",
      headerName: "Đường dẫn",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },

    {
      field: "isActive",
      headerName: "isActive",
      headerAlign: "left",
      align: "left",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <>
            {params.row.isActive === true ? (
              <p className="text-success font-bold">True</p>
            ) : (
              <p className="text-error font-bold">False</p>
            )}
          </>
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
    {
      field: "update",
      headerName: "Cập nhật",
      headerAlign: "left",
      align: "left",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() => {
                setSelectedBanner(params.row.id);
              }}
            >
              <FaModx size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  allBanners &&
    allBanners.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        image: item.image,
        link: item.link,
        isActive: item.isActive,
      });
    });

  console.log(allBanners);

  return (
    <div className="w-full m-4">
      <div className="flex justify-between">
        <form onSubmit={handleSubmit}>
          <div className="flex mb-6">
            <div className="w-full">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Tên banner
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
                Đường dẫn
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="checkbox"
            />
            <label className="ml-2 text-gray-700">Active</label>
          </div>
          <div>
            <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-display font-semibold py-2 px-4 rounded">
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
      {selectedBanner && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-xl font-bold uppercase text-center">
              Cập nhật Banner
            </h2>
            <div className="my-4">
              <label htmlFor="updateIsActive" className="font-bold">
                Trạng thái:
              </label>
              <input
                type="checkbox"
                checked={updateIsActive}
                id="updateIsActive"
                onChange={handleChangeCheckbox}
                className="checkbox checkbox-success block"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleUpdate}
                className="btn btn-success font-bold text-white uppercase"
              >
                Cập nhật
              </button>
              <button
                onClick={() => setSelectedBanner(null)}
                className="btn btn-error font-bold text-white uppercase"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBanners;
