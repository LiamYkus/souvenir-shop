import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaHighlighter } from "react-icons/fa6";
import ProductCard from "../ProductCard/ProductCard";

const FeaturedProduct = () => {
  const { allProducts } = useSelector((state) => state.products);
  const activeProducts = allProducts?.filter((product) => product.isActive);

  return (
    <div className="my-8 mx-24">
      <div className="flex my-4">
        <FaHighlighter color="#50e991" size={36} />
        <h1 className="text-3xl font-bold uppercase italic ml-2">
          Sản phẩm nổi bật
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] border-0">
        {activeProducts &&
          activeProducts.map((i, index) => (
            <ProductCard data={i} key={index} />
          ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
