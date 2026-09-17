import test from "node:test";
import assert from "node:assert/strict";
import { htmlToText, parseDdgLite } from "./web";

const DDG_FIXTURE = `
<tr>
  <td valign="top">1.&nbsp;</td>
  <td>
    <a rel="nofollow" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fvn.usembassy.gov%2Fvi%2Frequired%2Ddocuments%2F&amp;rut=abc" class='result-link'>Các Giấy tờ được Yêu cầu - Đại sứ quán</a>
  </td>
</tr>
<tr>
  <td>&nbsp;&nbsp;&nbsp;</td>
  <td class='result-snippet'>Người xin visa nên nộp hộ chiếu, ảnh, xác nhận DS-160 và giấy tờ chứng minh ràng buộc tại Việt Nam.</td>
</tr>
<tr>
  <td valign="top">2.&nbsp;</td>
  <td>
    <a rel="nofollow" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com%2Fblog&amp;rut=def" class='result-link'>Blog tư vấn</a>
  </td>
</tr>
<tr>
  <td>&nbsp;&nbsp;&nbsp;</td>
  <td class='result-snippet'>Một bài viết chung về visa.</td>
</tr>
`;

test("parseDdgLite extracts decoded official URL first", () => {
  const snips = parseDdgLite(DDG_FIXTURE);
  assert.ok(snips.length >= 2);
  assert.equal(
    snips[0].url,
    "https://vn.usembassy.gov/vi/required-documents/"
  );
  assert.match(snips[0].text, /DS-160/);
  assert.match(snips[0].title, /Giấy tờ/i);
});

test("htmlToText strips tags", () => {
  assert.equal(htmlToText("<b>hộ chiếu</b> còn hạn"), "hộ chiếu còn hạn");
});
