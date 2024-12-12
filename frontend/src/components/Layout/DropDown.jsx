import React from "react";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../../server";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  const submitHandle = (i) => {
    navigate(`/products?category=${i.name}`);
    setDropDown(false);
    window.location.reload();
  };
  const submitAllProduct = (i) => {
    navigate(`/products`);
    setDropDown(false);
    window.location.reload();
  };
  return (
    <div className="pb-4 w-[370px] bg-[#fff] absolute z-30 rounded-b-md shadow-sm ">
    
     <div
            
            className="flex items-center"
            onClick={() => submitAllProduct()}
          >
            <h3 className="m-3 cursor-pointer select-none font-medium">🌟 Tất cả sản phẩm ✨✨✨</h3>
          </div>
    
      
      {categoriesData &&
        categoriesData.map((i, index) => (
          <div
            key={index}
            className="flex items-center"
            onClick={() => submitHandle(i)}
          >
            <img
              // src={i.image}
              src={`${backend_url}${i.image}`}
              style={{
                width: "35px",
                height: "35px",
                objectFit: "contain",
                marginLeft: "10px",
                userSelect: "none",
               
              }}
              alt=""
            />
            <h3 className="m-3 cursor-pointer select-none ">{i.name}</h3>
          </div>
        ))}
    </div>
  );
};

export default DropDown;
