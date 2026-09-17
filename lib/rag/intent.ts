import { foldDiacritics, stripBrand } from "./normalize";

export type Topic =
  | "hours"
  | "contact"
  | "address-hcm"
  | "address-hn"
  | "mst"
  | "process"
  | "fee"
  | "visa-vn"
  | "evisa"
  | "gpld"
  | "tam-tru"
  | "bao-lanh"
  | "hphls"
  | "ho-chieu"
  | "apec"
  | "lltp"
  | "hoi-huong"
  | "nhap-tich"
  | "thue-nha"
  | "visa-countries"
  | "services"
  | "docs"
  | "time"
  | "unknown";

export type Suggestion = { label: string; text: string };

const SHORT_FOLLOW =
  /^(co|duoc|ok|oke|tiep|chi tiet|them|nua|va |roi|the nao|giay to|ho so|bao lau|mat bao lau|can gi|o dau|lam luon|duoc khong|tiep di|nua di|va gpld|roi nhe)(\b|$)/;

const PURPOSE_FOLLOW =
  /^(du lich|cong tac|du hoc|tham than|tham nha|dinh cu|b1|b2|f1|e2|phong van|ok|oke|vang|dung roi|vay|roi|tiep|chi tiet)(\b|$)/;

const FRESH_TOPIC: Topic[] = [
  "fee",
  "hours",
  "contact",
  "address-hcm",
  "address-hn",
  "mst",
  "process",
  "gpld",
  "visa-vn",
  "evisa",
  "bao-lanh",
  "tam-tru",
  "hphls",
  "ho-chieu",
  "apec",
  "lltp",
  "hoi-huong",
  "nhap-tich",
  "thue-nha",
  "services",
];

export function isShortFollowUp(q: string): boolean {
  const f = foldDiacritics(q).trim();
  return f.length > 0 && f.length <= 48 && SHORT_FOLLOW.test(f);
}

/** "du lịch" / "công tác" after an outbound-visa turn. */
export function isPurposeFollowUp(q: string): boolean {
  const f = foldDiacritics(q).trim();
  return f.length > 0 && f.length <= 48 && PURPOSE_FOLLOW.test(f);
}

export function detectPurpose(query: string): string | null {
  const f = foldDiacritics(query);
  if (/du hoc|\bf1\b/.test(f)) return "du học";
  if (/cong tac|cong vu/.test(f) && !/gio lam viec/.test(f)) return "công tác";
  if (/tham than|tham nha/.test(f)) return "thăm thân";
  if (/du lich|\bb2\b/.test(f)) return "du lịch";
  if (/\bb1\b/.test(f)) return "công tác";
  if (/phong van/.test(f)) return "phỏng vấn";
  return null;
}

export function lastDestination(
  messages: { role: string; content: string }[]
): DestinationId | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const d = detectDestination(messages[i].content);
    if (d) return d;
  }
  return null;
}

/**
 * Fee/guarantee detector — must NOT match brand "Gia" / "Nhị Gia".
 * Matches accented and unaccented Vietnamese (users often type không dấu).
 */
export function isFeeOrGuarantee(q: string): boolean {
  const cleaned = stripBrand(q);
  if (
    /phí|bao nhiêu tiền|bảng giá|báo giá|mức giá|cam kết|đảm bảo|chắc chắn đậu|100%\s*đậu|guarantee|how much|price list|quotation|\bcosts?\b|\bfees?\b/i.test(
      cleaned
    )
  ) {
    return true;
  }
  if (/giá\s*(bao|bao nhiêu|dịch vụ|làm|visa|gplđ|thẻ|hồ sơ)?/i.test(cleaned)) {
    return true;
  }
  const folded = foldDiacritics(cleaned);
  if (
    /\bphi\b|bao nhieu tien|bang gia|bao gia|muc gia|cam ket|dam bao|chac chan dau|100%\s*dau|guarantee/.test(
      folded
    )
  ) {
    return true;
  }
  if (
    /\b(gia bao nhieu|gia dich vu|gia lam|gia visa|gia gpld|gia ho so)\b/.test(
      folded
    )
  ) {
    return true;
  }
  return false;
}

/** True when a model reply appears to invent a concrete price. */
export function looksLikeInventedPrice(text: string): boolean {
  const f = foldDiacritics(text);
  if (/\d[\d.\s,]{1,12}\s*(vnd|dong|trieu|nghin|ngan|usd|\$)/.test(f)) {
    return true;
  }
  if (/phi (la|khoang|tu)\s*\d/.test(f)) return true;
  if (/bang gia (dich vu|chi tiet|ni yem)/.test(f)) return true;
  return false;
}

export type DestinationId =
  | "us"
  | "cn"
  | "kr"
  | "jp"
  | "au"
  | "tw"
  | "uk"
  | "schengen"
  | "sg";

export const DEST_LABEL: Record<DestinationId, string> = {
  us: "Mỹ",
  cn: "Trung Quốc",
  kr: "Hàn Quốc",
  jp: "Nhật Bản",
  au: "Úc",
  tw: "Đài Loan",
  uk: "Anh",
  schengen: "Schengen / châu Âu",
  sg: "Singapore",
};

/** Country/region the customer wants to go to (outbound), not Vietnam inbound. */
export function detectDestination(query: string): DestinationId | null {
  const f = foldDiacritics(query);
  if (
    /(visa|sang|di|du hoc|cong tac|du lich|qua|den|toi)\s+(my|hoa ky|hoa ki)\b/.test(
      f
    ) ||
    /\b(hoa ky|hoa ki|\busa\b|united states)\b/.test(f) ||
    /\b(b1\s*\/?\s*b2|ds-?160)\b/.test(f) ||
    /visa.{0,24}\bmy\b/.test(f)
  ) {
    return "us";
  }
  if (
    /trung quoc|china|visa\s*(tq|trung)\b|sang trung|di trung/.test(f)
  ) {
    return "cn";
  }
  if (/han quoc|korea|visa han|sang han|di han\b/.test(f)) return "kr";
  if (/nhat ban|japan|visa nhat|sang nhat|di nhat/.test(f)) return "jp";
  if (
    (/visa uc|du hoc uc|sang uc|\baustralia\b/.test(f) ||
      (/\buc\b/.test(f) && /visa|du hoc|sang |di uc/.test(f)))
  ) {
    return "au";
  }
  if (/dai loan|taiwan/.test(f)) return "tw";
  if (
    /anh quoc|united kingdom|\buk\b|visa anh|sang anh|du hoc anh/.test(f)
  ) {
    return "uk";
  }
  if (
    /schengen|chau au|visa (phap|duc|\by\b|ha lan)|europe/.test(f)
  ) {
    return "schengen";
  }
  if (/singapore|visa sing|sang sing/.test(f)) return "sg";
  return null;
}

export function isOutboundVisa(query: string): boolean {
  const f = foldDiacritics(query);
  if (detectDestination(query)) return true;
  return /visa (cac nuoc|quoc te|nuoc ngoai)|visa nuoc ngoai/.test(f);
}

/** Checklist / conditions / interview — not a yes/no "có làm không?". */
export function isDetailQuestion(query: string): boolean {
  const f = foldDiacritics(query);
  return /chuan bi|giay to|ho so|can nhung gi|can gi|checklist|dieu kien|phong van|ds-?160|mien visa|loai visa|\bb1\b|\bb2\b|\bf1\b|nhung gi|thu tuc|quy dinh|moi nhat|hien nay/.test(
    f
  );
}

export function isAvailabilityQuestion(query: string): boolean {
  const f = foldDiacritics(query);
  return /co (lam|tu van|ho tro|nhan)|lam duoc khong|co dich vu|nhi gia co/.test(
    f
  );
}

/** Gõ không dấu / typo — still send original to the model, this is for search. */
export function rewriteForSearch(
  query: string,
  destHint?: DestinationId | null
): string {
  const dest = destHint || detectDestination(query);
  const purpose = detectPurpose(query);
  const label = dest ? DEST_LABEL[dest] : "";
  if (dest === "us") {
    const area = purpose || "B1 B2 giấy tờ";
    return `visa Mỹ ${area} công dân Việt Nam đại sứ quán`.trim();
  }
  if (label) {
    return `visa ${label} ${purpose || "giấy tờ thủ tục"} công dân Việt Nam`.trim();
  }
  return query.replace(/\s+/g, " ").trim();
}

export function inboundDocsTopic(topic: Topic): boolean {
  return (
    topic === "gpld" ||
    topic === "visa-vn" ||
    topic === "evisa" ||
    topic === "bao-lanh" ||
    topic === "tam-tru" ||
    topic === "hphls" ||
    topic === "ho-chieu" ||
    topic === "apec" ||
    topic === "lltp"
  );
}

export function detectTopic(query: string): Topic {
  const f = foldDiacritics(stripBrand(query));
  if (!f.trim()) return "unknown";
  if (isFeeOrGuarantee(query)) return "fee";

  // Hours before GPLĐ — "làm việc" is a false friend of work permit.
  if (
    /gio lam viec|gio mo cua|lam viec may gio|mo cua luc nao|thu 7 co|lam thu 7|gio lam|may gio (mo|lam)|lam viec the nao|office hours|opening hours|working hours/.test(
      f
    )
  ) {
    return "hours";
  }
  if (/ma so thue|\bmst\b|tax id|tax code/.test(f)) return "mst";
  if (
    /dia chi.*(ha noi|\bhn\b)|van phong ha noi|chi nhanh ha noi|ha noi o dau/.test(
      f
    )
  ) {
    return "address-hn";
  }
  if (
    /dia chi.*(hcm|ho chi minh|sai gon)|van phong.*(hcm|sai gon|ho chi minh)|tru so|hcm o dau/.test(
      f
    )
  ) {
    return "address-hcm";
  }
  if (
    /lien he|hotline|email|so dien thoai|1900|goi (dau|the nao|o dau)|how (can|do) i contact|phone number/.test(
      f
    )
  ) {
    return "contact";
  }
  if (
    /quy trinh|5 buoc|cac buoc|lam ho so ra sao|how (does it|do you) work|your process/.test(
      f
    )
  ) {
    return "process";
  }
  if (/e-?\s*visa|thi thuc dien tu/.test(f)) return "evisa";
  if (/gpld|giay phep lao dong|work\s*permit/.test(f)) return "gpld";
  if (/bao lanh|cong van nhap canh/.test(f)) return "bao-lanh";
  if (/the tam tru|\btam tru\b/.test(f)) return "tam-tru";
  if (/hop phap hoa|lanh su|apostille/.test(f)) return "hphls";
  if (/\bapec\b|the doanh nhan/.test(f)) return "apec";
  if (/ly lich tu phap|\blltp\b|phieu ly lich/.test(f)) return "lltp";
  if (/hoi huong|viet kieu/.test(f)) return "hoi-huong";
  if (/nhap tich|quoc tich viet/.test(f)) return "nhap-tich";
  if (/thue nha|nha cho chuyen gia/.test(f)) return "thue-nha";
  if (/ho chieu|passport/.test(f)) return "ho-chieu";
  // Outbound (visa Mỹ / sang Mỹ / B1-B2…) before inbound "có làm visa" and generic docs.
  if (isOutboundVisa(query)) return "visa-countries";
  if (/visa (viet nam|vn)|lam visa vn|co lam visa/.test(f)) return "visa-vn";
  if (/dich vu gi|lam nhung gi|chuyen ve gi|nhung dich vu/.test(f)) {
    return "services";
  }
  if (/giay to|ho so can|can nhung gi|chuan bi gi/.test(f)) return "docs";
  if (
    /bao lau|mat bao nhieu ngay|thoi gian xu ly|bao nhieu ngay|bao lau xong/.test(
      f
    )
  ) {
    return "time";
  }
  return "unknown";
}

export function expandQuery(
  messages: { role: string; content: string }[]
): {
  query: string;
  topic: Topic;
  prevTopic: Topic;
  destination: DestinationId | null;
} {
  const users = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.trim())
    .filter(Boolean);
  const last = users[users.length - 1] || "";
  const prev = users[users.length - 2] || "";
  const prevTopic = prev ? detectTopic(prev) : "unknown";
  const destination =
    detectDestination(last) || lastDestination(messages);
  let topic = detectTopic(last);

  if (FRESH_TOPIC.includes(topic) && !isPurposeFollowUp(last)) {
    return { query: last, topic, prevTopic, destination };
  }

  const follow =
    isShortFollowUp(last) ||
    isPurposeFollowUp(last) ||
    topic === "unknown" ||
    topic === "docs" ||
    topic === "time";

  if (follow && destination && (prevTopic === "visa-countries" || lastDestination(messages.slice(0, -1)))) {
    const label = DEST_LABEL[destination];
    const purpose = detectPurpose(last);
    return {
      query: purpose
        ? `visa ${label} diện ${purpose} cần chuẩn bị những gì`
        : `visa ${label} ${last}`,
      topic: "visa-countries",
      prevTopic,
      destination,
    };
  }

  if (
    follow &&
    prev &&
    (isShortFollowUp(last) ||
      isPurposeFollowUp(last) ||
      topic === "docs" ||
      topic === "time" ||
      topic === "unknown")
  ) {
    if (topic === "unknown") topic = prevTopic;
    return { query: `${prev} ${last}`, topic, prevTopic, destination };
  }
  return { query: last, topic, prevTopic, destination };
}

export const TOPIC_CHUNK: Partial<Record<Topic, string[]>> = {
  hours: ["qa-hours", "intro-1"],
  contact: ["qa-2", "intro-1"],
  "address-hcm": ["qa-hcm", "intro-1", "qa-2"],
  "address-hn": ["qa-hn", "intro-1", "qa-2"],
  mst: ["qa-mst", "intro-1"],
  process: ["qa-3", "process"],
  fee: ["safety"],
  "visa-vn": ["qa-visa-vn", "tip-visa-vn", "svc-foreign"],
  evisa: ["qa-5", "tip-evisa"],
  gpld: ["qa-4", "tip-gpld"],
  "tam-tru": ["qa-6", "tip-tam-tru"],
  "bao-lanh": ["qa-7", "tip-bao-lanh"],
  hphls: ["qa-hphls", "tip-hop-phap-hoa"],
  "ho-chieu": ["qa-hochieu", "qa-8", "svc-vn"],
  apec: ["qa-apec", "qa-8", "svc-vn"],
  lltp: ["qa-lltp", "qa-8", "svc-vn"],
  "hoi-huong": ["qa-hoihuong", "svc-vip"],
  "nhap-tich": ["qa-nhaptich", "svc-vip"],
  "thue-nha": ["qa-thuenha", "svc-vip"],
  "visa-countries": ["qa-visa-countries", "svc-visa-countries", "tip-china-visa"],
  services: ["qa-1", "svc-foreign", "svc-vn", "svc-vip"],
};

export function docsChunkId(prevTopic: Topic): string {
  if (prevTopic === "gpld") return "qa-docs-gpld";
  if (prevTopic === "visa-vn" || prevTopic === "evisa") return "qa-docs-visa";
  if (prevTopic === "bao-lanh") return "qa-docs-baolanh";
  if (prevTopic === "tam-tru") return "qa-docs-tamtru";
  return "qa-docs-generic";
}

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { label: "Dịch vụ", text: "Nhị Gia làm những dịch vụ gì?" },
  { label: "Quy trình", text: "Quy trình làm hồ sơ ra sao?" },
  { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
];

const SUGGEST_MAP: Partial<Record<Topic, Suggestion[]>> = {
  gpld: [
    { label: "Giấy tờ GPLĐ", text: "Giấy tờ cần cho giấy phép lao động là gì?" },
    { label: "Thẻ tạm trú", text: "Có làm thẻ tạm trú không?" },
    { label: "Quy trình", text: "Quy trình làm hồ sơ ra sao?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  "visa-vn": [
    { label: "E-Visa", text: "Có làm E-Visa Việt Nam không?" },
    { label: "Bảo lãnh", text: "Có hỗ trợ bảo lãnh / công văn nhập cảnh không?" },
    { label: "Giấy tờ", text: "Visa Việt Nam cần giấy tờ gì?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  evisa: [
    { label: "Visa VN", text: "Nhị Gia có làm Visa Việt Nam không?" },
    { label: "Bảo lãnh", text: "Có hỗ trợ bảo lãnh / công văn nhập cảnh không?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  "bao-lanh": [
    { label: "Visa VN", text: "Nhị Gia có làm Visa Việt Nam không?" },
    { label: "E-Visa", text: "Có làm E-Visa Việt Nam không?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  "tam-tru": [
    { label: "GPLĐ", text: "Có làm giấy phép lao động / work permit không?" },
    { label: "Quy trình", text: "Quy trình làm hồ sơ ra sao?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  contact: [
    { label: "Giờ làm việc", text: "Giờ làm việc thế nào?" },
    { label: "Địa chỉ HCM", text: "Địa chỉ văn phòng TP.HCM ở đâu?" },
    { label: "Địa chỉ Hà Nội", text: "Địa chỉ chi nhánh Hà Nội ở đâu?" },
  ],
  hours: [
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
    { label: "Địa chỉ HCM", text: "Địa chỉ văn phòng TP.HCM ở đâu?" },
  ],
  "address-hcm": [
    { label: "Địa chỉ Hà Nội", text: "Địa chỉ chi nhánh Hà Nội ở đâu?" },
    { label: "Giờ làm việc", text: "Giờ làm việc thế nào?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  "address-hn": [
    { label: "Địa chỉ HCM", text: "Địa chỉ văn phòng TP.HCM ở đâu?" },
    { label: "Giờ làm việc", text: "Giờ làm việc thế nào?" },
  ],
  services: [
    { label: "Visa VN", text: "Nhị Gia có làm Visa Việt Nam không?" },
    { label: "GPLĐ", text: "Có làm giấy phép lao động / work permit không?" },
    { label: "E-Visa", text: "Có làm E-Visa Việt Nam không?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  fee: [
    { label: "Quy trình", text: "Quy trình làm hồ sơ ra sao?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
    { label: "Dịch vụ", text: "Nhị Gia làm những dịch vụ gì?" },
  ],
  apec: [
    { label: "Hộ chiếu", text: "Có làm hộ chiếu không?" },
    { label: "Lý lịch tư pháp", text: "Có làm lý lịch tư pháp không?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  "ho-chieu": [
    { label: "Thẻ APEC", text: "Có làm thẻ APEC không?" },
    { label: "Visa nước ngoài", text: "Có tư vấn visa Trung Quốc, Mỹ, Hàn không?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  "visa-countries": [
    { label: "Du lịch", text: "Visa Mỹ diện du lịch B1/B2 cần giấy tờ gì?" },
    { label: "Công tác", text: "Visa Mỹ diện công tác cần chuẩn bị gì?" },
    { label: "Du học", text: "Du học Mỹ cần visa và giấy tờ gì?" },
    { label: "Phỏng vấn", text: "Phỏng vấn visa Mỹ cần lưu ý gì?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  process: [
    { label: "Dịch vụ", text: "Nhị Gia làm những dịch vụ gì?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  hphls: [
    { label: "GPLĐ", text: "Có làm giấy phép lao động / work permit không?" },
    { label: "Lý lịch tư pháp", text: "Có làm lý lịch tư pháp không?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  "hoi-huong": [
    { label: "Nhập tịch", text: "Có làm nhập tịch Việt Nam không?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  "nhap-tich": [
    { label: "Hồi hương", text: "Có làm hồi hương cho Việt kiều không?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  "thue-nha": [
    { label: "GPLĐ", text: "Có làm giấy phép lao động / work permit không?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  lltp: [
    { label: "Hộ chiếu", text: "Có làm hộ chiếu không?" },
    { label: "Hợp pháp hóa", text: "Có làm hợp pháp hóa lãnh sự không?" },
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
  ],
  mst: [
    { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
    { label: "Địa chỉ HCM", text: "Địa chỉ văn phòng TP.HCM ở đâu?" },
  ],
};

export function suggestionsFor(
  topic: Topic,
  prevTopic: Topic = "unknown",
  dest: DestinationId | null = null
): Suggestion[] {
  const t =
    topic === "docs" || topic === "time" || topic === "unknown"
      ? prevTopic !== "unknown"
        ? prevTopic
        : topic
      : topic;
  if (t === "visa-countries" && dest && dest !== "us") {
    const name = DEST_LABEL[dest];
    return [
      { label: "Giấy tờ", text: `Visa ${name} cần chuẩn bị giấy tờ gì?` },
      { label: "Phỏng vấn", text: `Phỏng vấn visa ${name} cần lưu ý gì?` },
      { label: "Liên hệ", text: "Liên hệ Nhị Gia thế nào?" },
    ];
  }
  return SUGGEST_MAP[t] || DEFAULT_SUGGESTIONS;
}
