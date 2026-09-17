import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description:
    "Điều khoản sử dụng website Nhị Gia — phạm vi thông tin, chatbot và liên hệ tư vấn.",
  alternates: { canonical: "/dieu-khoan" },
};

export default function TermsPage() {
  return (
    <>
      <main id="main-content" className="section-y">
        <article className="prose-page px-4">
          <nav className="mb-6 text-xs text-muted" aria-label="Breadcrumb">
            <a href="/" className="hover:text-navy">
              Trang chủ
            </a>
            <span className="mx-1.5 opacity-50" aria-hidden>
              /
            </span>
            <span className="text-navy">Điều khoản sử dụng</span>
          </nav>
          <p className="section-eyebrow">Pháp lý</p>
          <h1>Điều khoản sử dụng</h1>
          <p className="lead">
            Khi truy cập nhigia.vn hoặc website demo này, bạn đồng ý dùng thông tin
            để tìm hiểu dịch vụ và liên hệ tư vấn — không thay thế tư vấn pháp lý
            theo hồ sơ cụ thể.
          </p>
          <h2>1. Phạm vi thông tin</h2>
          <p>
            Nội dung mang tính giới thiệu. Điều kiện hồ sơ, thời gian xử lý và chi
            phí phụ thuộc quy định hiện hành và thẩm định từng trường hợp. Website
            không cấu thành cam kết đậu visa, GPLĐ hay bất kỳ kết quả hành chính nào.
          </p>
          <h2>2. Dịch vụ tư vấn</h2>
          <p>
            Việc gửi form hoặc chat chưa tạo hợp đồng dịch vụ. Hợp đồng, phạm vi việc
            và phí (nếu có) chỉ có hiệu lực khi hai bên thống nhất bằng văn bản.
          </p>
          <h2>3. Chatbot</h2>
          <p>
            Trợ lý ảo trả lời theo tài liệu công khai trên website. Không cung cấp
            bảng giá bịa đặt, không nhận giấy tờ tùy thân qua chat, không thay chuyên
            viên thẩm định.
          </p>
          <h2>4. Sở hữu nội dung</h2>
          <p>
            Tên, nhận diện và nội dung trên website thuộc Nhị Gia hoặc bên được phép.
            Không sao chép để gây nhầm lẫn thương hiệu.
          </p>
          <h2>5. Liên hệ</h2>
          <p>
            Hotline <a href="tel:19006654">1900 6654</a> · Email{" "}
            <a href="mailto:info@nhigia.vn">info@nhigia.vn</a> · MST 0318691849
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
