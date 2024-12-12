import React from "react";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import { backend_url } from "../../../server";
import { Link } from "react-router-dom";

const Banner = () => {
  const { allBanners } = useSelector((state) => state.banners);
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
  };

  const activeBanners = allBanners?.filter((banner) => banner.isActive);

  return (
    <div className="mx-24 my-4">
      <Slider {...settings}>
        {activeBanners?.map((i) => (
          <Link to={i.link} key={i.id}>
            <div className="rounded">
              <img
                src={`${backend_url}${i.image}`}
                alt={i.name}
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
