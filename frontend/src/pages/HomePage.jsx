import React from "react";
import Header from "../components/Layout/Header";
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Footer from "../components/Layout/Footer";
import Banner from "../components/Route/Banner/Banner";
const HomePage = () => {
  return (
    <div>
      <Header activeHeading={1} />
      <Banner />
      <Categories />
      <BestDeals />
      <FeaturedProduct />
      <Footer />
    </div>
  );
};

export default HomePage;