import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { backend_url } from "../../../server";
import { FaList } from "react-icons/fa6";

const Categories = () => {
  const { allCategories } = useSelector((state) => state.categories);
  const navigate = useNavigate();

  return (
    <div className="my-8 mx-24">
      <div className="flex my-4">
        <FaList size={36} color="#0bb4ff" />
        <h1 className="text-3xl font-bold uppercase italic ml-2">
          Danh mục sản phẩm
        </h1>
      </div>

      <div id="categories">
        <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
          {allCategories?.map((i) => {
            const handleSubmit = (i) => {
              navigate(`/products?category=${i.name}`);
            };
            return (
              <div
                className="w-full flex items-center justify-between cursor-pointer overflow-hidden shadow-lg p-2"
                key={i._id}
                onClick={() => handleSubmit(i)}
              >
                <h5 className="text-xl font-bold">{i.name}</h5>
                <img
                  src={`${backend_url}${i.image}`}
                  className="w-32 rounded object-cover"
                  alt=""
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
