import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../ProductCard/ProductCard";
import { FaFire } from "react-icons/fa6";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  const activeProducts = allProducts?.filter((product) => product.isActive);

  useEffect(() => {
    const allProductsData = activeProducts ? [...activeProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
    const firstFive = sortedData && sortedData.slice(0, 5);
    setData(firstFive);
  }, [allProducts]);

  return (
    <div className="my-8 mx-24">
      <div className="flex my-4">
        <FaFire size={36} color="#e60049" />
        <h1 className="text-3xl font-bold uppercase italic ml-2">Bán chạy</h1>
      </div>
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] border-0">
        {data && data.length !== 0 && (
          <>
            {data &&
              data.map((i, index) => <ProductCard data={i} key={index} />)}
          </>
        )}
      </div>
    </div>
  );
};

export default BestDeals;
