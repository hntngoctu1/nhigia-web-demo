import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description:
    "Cách Nhị Gia thu thập, sử dụng và bảo vệ thông tin khi bạn liên hệ tư vấn visa và di trú.",
  alternates: { canonical: "/chinh-sach-bao-mat" },
};

export default function PrivacyPage() {
  return (
    <>
      <main id="main-content" className="section-y">
        <article className="prose-page px-4">
          <nav className="mb-6 text-xs text-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-navy">
              Trang chủ
            </Link>
            <span className="mx-1.5 opacity-50" aria-hidden>
              /
            </span>
            <span className="text-navy">Chính sách bảo mật</span>
          </nav>
          <p className="section-eyebrow">Pháp lý</p>
          <h1>Chính sách bảo mật</h1>
          <p className="lead">
            Công ty Cổ phần Đầu tư Thương mại và Dịch vụ Nhị Gia (MST 0318691849)
            tôn trọng thông tin bạn cung cấp khi dùng website và kênh tư vấn.
          </p>
          <h2>1. Thông tin chúng tôi thu thập</h2>
          <p>
            Khi bạn gửi form, chat hoặc gọi điện, chúng tôi có thể nhận họ tên, số
            điện thoại, email, tên tổ chức và nội dung nhu cầu tư vấn. Website còn
            ghi nhận dữ liệu kỹ thuật tối thiểu (địa chỉ IP, thời điểm gửi) để chống
            spam và bảo vệ hệ thống.
          </p>
          <h2>2. Mục đích sử dụng</h2>
          <p>
            Thông tin dùng để liên hệ tư vấn dịch vụ visa, GPLĐ, di trú; sắp xếp lịch;
            cải thiện trải nghiệm trên website; và đáp ứng yêu cầu của cơ quan có thẩm
            quyền khi pháp luật bắt buộc.
          </p>
          <h2>3. Lưu trữ và bảo vệ</h2>
          <p>
            Dữ liệu được lưu trên hệ thống nội bộ với quyền truy cập hạn chế theo vai
            trò. Chúng tôi không bán thông tin cá nhân cho bên thứ ba vì mục đích
            quảng cáo. Thời gian lưu phù hợp với mục đích tư vấn và nghĩa vụ pháp lý.
          </p>
          <h2>4. Chatbot</h2>
          <p>
            Nội dung hội thoại được dùng để trả lời trong phiên và cải thiện chất
            lượng tư vấn tham khảo. Chatbot không thay thế chuyên viên và không được
            dùng để gửi giấy tờ nhạy cảm (hộ chiếu, giấy tờ tùy thân).
          </p>
          <h2>5. Quyền của bạn</h2>
          <p>
            Bạn có thể yêu cầu xem, sửa hoặc xóa thông tin liên hệ đã gửi, trong phạm
            vi pháp luật cho phép, qua hotline 1900 6654 hoặc email info@nhigia.vn.
          </p>
          <h2>6. Liên hệ</h2>
          <p>
            Hotline <a href="tel:19006654">1900 6654</a> · Email{" "}
            <a href="mailto:info@nhigia.vn">info@nhigia.vn</a>
            <br />
            TP.HCM: 186–188 Nguyễn Duy, P.Chánh Hưng · Hà Nội: T608 Tôn Quang Phiệt,
            Nghĩa Đô.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
