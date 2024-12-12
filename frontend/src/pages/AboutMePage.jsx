import React from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";

const AboutMePage = () => {
  return (
    <div>
      <Header activeHeading={5} />
      <AboutMe />
      <Footer />
    </div>
  );
};

const AboutMe = () => {
  return (
    <div className="mx-24 my-4">
      <h1 className="text-3xl font-bold mb-4">
          Giới thiệu Về Chip Chip
      </h1>

      <div className="mb-8">
        <p className="mb-4">
            Hãy để Chip Chip Shop trở thành quân sư cho bạn trong việc chọn quà nhé!
        </p>

        <p className="mb-4">
            - Sản phẩm:
            + Luôn tiên phong cập nhật các xu hướng mới nhất về thời trang, quà tặng, quà lưu niệm
            + Độc đáo, sáng tạo, đa dạng, luôn cập nhật những xu hướng mới nhất trên thị trường….
            + Cung cấp sản phẩm với số lượng lớn cho event, sự kiện, cưới hỏi…
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Dịch vụ tư vấn và gói quà chuyên nghiệp</h3>

        <p className="mb-2">
            + Phong cách ấn tượng, độc đáo.
            + Hoàn toàn MIỄN PHÍ dành cho thành viên.
            + Nhận gói quà và gia công hộp quà với số lượng lớn.
            + Gói quà tận nơi theo yêu cầu.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Đội ngũ nhân viên</h3>

        <p className="mb-2">
            chuyên nghiệp, nhiệt tình, thân thiện
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4"> Đặt hàng và giao hàng nhanh chóng</h3>

        <p className="mb-2">
            Bạn sẽ được tận hưởng cảm giác mua sắm thỏa thích ngay tại nhà qua:
            Hotline: 08 628 666 28 – 0938 12 33 55
            Website: chipchipshop.com.
            Facebook: www.facebook.com/WwwChipChipShopCom

            Chip Chip Giao hàng trên toàn quốc

            Bạn chỉ thanh toán khi nhận được hàng tại nhà
        </p>
      </div>
    </div>
  );
};

export default AboutMePage;
