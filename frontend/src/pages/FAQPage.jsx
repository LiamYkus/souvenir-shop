import React from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";

const FAQPage = () => {
  return (
    <div>
      <Header activeHeading={4} />
      <Faq />
      <Footer />
    </div>
  );
};

const Faq = () => {
  return (
    <div className="mx-24 my-4">
      <div className="text-4xl font-bold uppercase mb-4">FAQ</div>
      <div className="collapse collapse-plus border">
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title text-xl font-medium">
          Tôi có thể đặt hàng qua điện thoại hoặc email không?
        </div>
        <div className="collapse-content">
          <p>
            Có, quý khách có thể đặt hàng qua điện thoại, email hoặc trực tiếp
            trên website. Chúng tôi sẽ xác nhận đơn hàng và thu tiền khi giao
            hàng.
          </p>
        </div>
      </div>
      <div className="collapse collapse-plus border">
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title text-xl font-medium">
          Tôi có thể tham khảo hàng trước khi đặt mua không?
        </div>
        <div className="collapse-content">
          <p>
            Có, quý khách có thể xem hình ảnh sản phẩm chi tiết với nhiều góc
            chụp khác nhau trên website. Nếu có nhu cầu xem trực tiếp, quý khách
            vui lòng liên hệ với chúng tôi để được hỗ trợ.
          </p>
        </div>
      </div>
      <div className="collapse collapse-plus border">
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title text-xl font-medium">
          Tôi có thể đổi/trả hàng sau khi nhận không?
        </div>
        <div className="collapse-content">
          <p>
            Có, tất cả sản phẩm đều áp dụng chính sách đổi/trả hàng trong vòng 7
            ngày nếu hàng không đúng mô tả hoặc lỗi từ nhà sản xuất. Quý khách
            vui lòng liên hệ ngay với chúng tôi để được giải quyết.
          </p>
        </div>
      </div>
      <div className="collapse collapse-plus border">
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title text-xl font-medium">
          Chi phí vận chuyển được tính như thế nào?
        </div>
        <div className="collapse-content">
          <p>
            Chi phí vận chuyển được tính dựa trên giá trị đơn hàng và địa chỉ
            giao hàng. Quý khách vui lòng xem bảng giá vận chuyển được niêm yết
            công khai trên website.
          </p>
        </div>
      </div>
      <div className="collapse collapse-plus border">
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title text-xl font-medium">
          Tôi cần xuất hóa đơn VAT khi mua hàng?
        </div>
        <div className="collapse-content">
          <p>
            Đối với khách hàng cá nhân thì không yêu cầu hóa đơn VAT. Chúng tôi
            sẽ xuất hóa đơn GTGT nếu khách hàng là tổ chức có nhu cầu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
