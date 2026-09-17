import test from "node:test";
import assert from "node:assert/strict";
import {
  detectDestination,
  detectTopic,
  expandQuery,
  isAvailabilityQuestion,
  isDetailQuestion,
  isFeeOrGuarantee,
  looksLikeInventedPrice,
} from "./intent";

test("fee detector matches accented and unaccented price questions", () => {
  assert.equal(isFeeOrGuarantee("Phí làm visa bao nhiêu?"), true);
  assert.equal(isFeeOrGuarantee("phi lam visa bao nhieu?"), true);
  assert.equal(isFeeOrGuarantee("Bảng giá GPLĐ"), true);
  assert.equal(isFeeOrGuarantee("Cam kết đậu 100% không?"), true);
});

test("fee detector does not treat brand Nhị Gia as a price", () => {
  assert.equal(isFeeOrGuarantee("Nhị Gia làm những dịch vụ gì?"), false);
  assert.equal(isFeeOrGuarantee("Liên hệ Nhị Gia thế nào?"), false);
  assert.equal(isFeeOrGuarantee("NG có làm visa không?"), false);
});

test("hours is not classified as work permit", () => {
  assert.equal(detectTopic("Giờ làm việc thế nào?"), "hours");
  assert.equal(detectTopic("gio lam viec may gio?"), "hours");
  assert.equal(detectTopic("Có làm giấy phép lao động không?"), "gpld");
});

test("core service intents", () => {
  assert.equal(detectTopic("Nhị Gia có làm Visa Việt Nam không?"), "visa-vn");
  assert.equal(detectTopic("Có làm E-Visa không?"), "evisa");
  assert.equal(detectTopic("Có làm thẻ APEC không?"), "apec");
  assert.equal(detectTopic("Địa chỉ văn phòng TP.HCM ở đâu?"), "address-hcm");
  assert.equal(detectTopic("Mã số thuế là gì?"), "mst");
});

test("follow-up giấy tờ keeps previous GPLĐ topic", () => {
  const { topic, prevTopic, query } = expandQuery([
    { role: "user", content: "Có làm giấy phép lao động không?" },
    { role: "assistant", content: "Dạ có ạ." },
    { role: "user", content: "Giấy tờ cần những gì?" },
  ]);
  assert.equal(prevTopic, "gpld");
  assert.equal(topic, "docs");
  assert.match(query, /giấy phép lao động/i);
});

test("du lich after US visa stays on US outbound", () => {
  const { topic, destination, query } = expandQuery([
    { role: "user", content: "lam visa sang my can chuan bi nhung gii" },
    { role: "assistant", content: "Dạ Nhị Gia hỗ trợ visa Mỹ. Anh/chị đi diện nào ạ?" },
    { role: "user", content: "du lich" },
  ]);
  assert.equal(destination, "us");
  assert.equal(topic, "visa-countries");
  assert.match(query, /Mỹ|du lịch/i);
});

test("unaccented US visa prep is outbound, not generic docs", () => {
  const q = "lam visa sang my can chuan bi nhung gii";
  assert.equal(detectDestination(q), "us");
  assert.equal(detectTopic(q), "visa-countries");
  assert.equal(isDetailQuestion(q), true);
  assert.equal(isAvailabilityQuestion(q), false);
});

test("availability US visa stays a yes/no service question", () => {
  const q = "Có tư vấn visa Mỹ không?";
  assert.equal(detectTopic(q), "visa-countries");
  assert.equal(isAvailabilityQuestion(q), true);
  assert.equal(isDetailQuestion(q), false);
});

test("invented price filter catches concrete VND amounts", () => {
  assert.equal(looksLikeInventedPrice("Phí khoảng 5.000.000 đồng"), true);
  assert.equal(
    looksLikeInventedPrice("Anh/chị gọi 1900 6654, MST 0318691849."),
    false
  );
});
