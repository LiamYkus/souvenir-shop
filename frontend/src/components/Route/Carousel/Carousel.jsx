import React, { useState, useEffect } from "react";
import { heroesData } from "../../../static/data";

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === heroesData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? heroesData.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const currentHero = heroesData[activeIndex];

  return (
    <div className="relative w-full h-64 sm:h-96 overflow-hidden">
      <div className="absolute w-full h-full flex items-center justify-center">
        <img
          src={currentHero.image_Url}
          alt={`Hero ${activeIndex}`}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-white bg-opacity-60 p-4">
        <h2 className="text-2xl font-bold">{currentHero.title}</h2>
        <p className="text-xl font-bold text-blue">{currentHero.description}</p>
      </div>
      <div className="absolute top-0 left-0 right-0 flex justify-between p-4">
        <button onClick={prevSlide} className="text-white hover:text-gray-300">
          &#10094;
        </button>
        <button onClick={nextSlide} className="text-white hover:text-gray-300">
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default Carousel;
