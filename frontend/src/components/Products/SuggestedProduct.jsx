import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaInfinity } from "react-icons/fa6";
import ProductCard from "../Route/ProductCard/ProductCard";

const SuggestedProduct = ({ data }) => {
  const { allProducts } = useSelector((state) => state.products);
  const [productData, setProductData] = useState();
  const activeProducts = allProducts?.filter(
    (product) => product.isActive === true
  );
  useEffect(() => {
    const d =
      activeProducts &&
      activeProducts.filter((i) => i.category === data.category);
    setProductData(d);
  }, [allProducts]);

  return (
    <>
      {data ? (
        <div className="my-8 mx-24">
          <div className="flex my-4">
            <FaInfinity color="#9b19f5" size={36} />
            <h1 className="text-3xl font-bold uppercase italic ml-2">
              Sản phẩm liên quan
            </h1>
          </div>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {productData &&
              productData.map((i, index) => (
                <ProductCard data={i} key={index} />
              ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SuggestedProduct;
