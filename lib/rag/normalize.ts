/** Fold Vietnamese diacritics for retrieval matching (keep original text for display). */
export function foldDiacritics(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

/** Remove brand mentions so fee detectors do not match "Nhị Gia" / "Gia". */
export function stripBrand(text: string): string {
  return text
    .replace(/nhị\s*gia/gi, " ")
    .replace(/nhi\s*gia/gi, " ")
    // Capital NG only — JS \bng\b also strips the "ng" ending of
    // "động"/"không" because Vietnamese letters are non-word chars.
    .replace(/\bNG\b/g, " ");
}
