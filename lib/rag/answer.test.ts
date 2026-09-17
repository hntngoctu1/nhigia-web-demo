import test from "node:test";
import assert from "node:assert/strict";
import { decideAnswer } from "./answer";

test("hours question returns instant office hours, not GPLĐ", () => {
  const d = decideAnswer([{ role: "user", content: "Giờ làm việc thế nào?" }]);
  assert.equal(d.kind, "instant");
  assert.equal(d.topic, "hours");
  assert.match(d.reply || "", /08:00/);
  assert.doesNotMatch(d.reply || "", /giấy phép lao động/i);
});

test("visa VN is instant grounded FAQ", () => {
  const d = decideAnswer([
    { role: "user", content: "Nhị Gia có làm Visa Việt Nam không?" },
  ]);
  assert.equal(d.kind, "instant");
  assert.equal(d.topic, "visa-vn");
  assert.match(d.reply || "", /visa/i);
  assert.ok((d.suggestions || []).length > 0);
});

test("unaccented fee question is safety, not hybrid", () => {
  const d = decideAnswer([{ role: "user", content: "phi lam visa bao nhieu?" }]);
  assert.equal(d.kind, "safety");
  assert.match(d.reply || "", /1900 6654/);
  assert.doesNotMatch(d.reply || "", /\d[\d.\s,]{3,}\s*(đồng|vnd)/i);
});

test("accented fee question is safety", () => {
  const d = decideAnswer([{ role: "user", content: "Phí làm visa bao nhiêu?" }]);
  assert.equal(d.kind, "safety");
});

test("US visa document question is hybrid, not generic which-service FAQ", () => {
  const d = decideAnswer([
    { role: "user", content: "lam visa sang my can chuan bi nhung gii" },
  ]);
  assert.equal(d.kind, "hybrid");
  assert.equal(d.topic, "visa-countries");
  assert.match(d.reply || "", /visa Mỹ/i);
  assert.doesNotMatch(d.reply || "", /phụ thuộc loại dịch vụ/i);
});

test("follow-up du lich after US visa is hybrid US, not baolanh RAG", () => {
  const d = decideAnswer([
    { role: "user", content: "lam visa sang my can chuan bi nhung gii" },
    {
      role: "assistant",
      content: "Dạ Nhị Gia hỗ trợ visa Mỹ. Anh/chị đi diện nào ạ?",
    },
    { role: "user", content: "du lich" },
  ]);
  assert.equal(d.kind, "hybrid");
  assert.equal(d.topic, "visa-countries");
  assert.equal(d.destination, "us");
  const ids = d.chunks.map((c) => c.id).join(" ");
  assert.match(ids, /visa-countries/);
  assert.doesNotMatch(ids, /baolanh|docs-generic/);
});

test("yes/no US visa question stays instant FAQ", () => {
  const d = decideAnswer([
    { role: "user", content: "Có tư vấn visa Mỹ không?" },
  ]);
  assert.equal(d.kind, "instant");
  assert.equal(d.topic, "visa-countries");
  assert.match(d.reply || "", /Mỹ/);
});

test("GPLĐ follow-up documents stay on work-permit checklist", () => {
  const d = decideAnswer([
    { role: "user", content: "Có làm giấy phép lao động không?" },
    { role: "assistant", content: "Dạ có ạ." },
    { role: "user", content: "Giấy tờ cần những gì?" },
  ]);
  assert.equal(d.kind, "instant");
  assert.match(d.reply || "", /doanh nghiệp|sức khỏe|lý lịch/i);
});
