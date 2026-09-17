import type { Suggestion, Topic } from "@/lib/rag/intent";

const HOTLINE = "1900 6654";
const EMAIL = "info@nhigia.vn";

export const EN_INSTANT: Partial<Record<Topic, string>> = {
  hours: `We are open Monday–Friday 08:00–17:30 and Saturday 08:00–12:00. Call ${HOTLINE} or email ${EMAIL} during office hours, or leave your details on the website.`,
  contact: `Call ${HOTLINE} or email ${EMAIL}. HCMC: 186–188 Nguyen Duy, Chanh Hung. Hanoi: T608 Ton Quang Phiet, Nghia Do. Hours: Mon–Fri 08:00–17:30, Sat 08:00–12:00.`,
  "address-hcm": `Nhi Gia HCMC office: 186–188 Nguyen Duy, Chanh Hung, Ho Chi Minh City. Hotline ${HOTLINE}.`,
  "address-hn": `Nhi Gia Hanoi office: T608 Ton Quang Phiet, Nghia Do, Hanoi. Hotline ${HOTLINE}.`,
  mst: `Tax ID (MST) of Nhi Gia Trading Investment and Services JSC is 0318691849. Hotline ${HOTLINE}.`,
  process: `Five steps: free file review → contract & intake → complete the file → submit and track → handover and aftercare. Share a brief outline so we can suggest a path.`,
  fee: `We cannot quote fees or guarantee visa/work-permit approval on chat — that needs a real file review. Please call ${HOTLINE} / ${EMAIL}. I can still outline services, documents or the process.`,
  "visa-vn": `Yes. We assist foreign nationals with Vietnam visas (including E-Visa and sponsorship letters where suitable), from choosing the visa type to completing the file. Share nationality, purpose and intended dates. Hotline ${HOTLINE}.`,
  evisa: `Yes. Vietnam’s electronic visa (E-Visa) is available for many nationalities. We help you check conditions and complete the filing. Tell us your purpose and travel dates.`,
  gpld: `Yes. We support work permits for foreign nationals, plus related visa/residence if needed. Please share nationality, job role and current documents.`,
  "tam-tru": `Yes. Temporary residence cards suit longer stays tied to work, investment or family. Tell us your current visa type and purpose.`,
  "bao-lanh": `Yes. We assist with Vietnam entry sponsorship letters. Share the guest’s nationality and purpose of entry.`,
  services: `Nhi Gia handles Vietnam visas, work permits, residence, sponsorship letters, E-Visa and legalisation for foreign clients; passports, APEC cards and criminal-record certificates for Vietnamese clients; plus VIP repatriation, naturalisation and expert housing.`,
  time: `Processing time depends on the file, nationality and the receiving authority — we do not lock a number of days on chat. After a review, a specialist can give an expected window. Call ${HOTLINE}.`,
};

export const EN_SUGGEST: Partial<Record<Topic, Suggestion[]>> = {
  hours: [
    { label: "Contact", text: "How can I contact Nhi Gia?" },
    { label: "HCMC office", text: "Where is the HCMC office?" },
  ],
  contact: [
    { label: "Hours", text: "What are your office hours?" },
    { label: "HCMC", text: "Where is the HCMC office?" },
    { label: "Hanoi", text: "Where is the Hanoi office?" },
  ],
  "visa-vn": [
    { label: "E-Visa", text: "Do you handle Vietnam E-Visa?" },
    { label: "Sponsorship", text: "Do you help with entry sponsorship letters?" },
    { label: "Contact", text: "How can I contact Nhi Gia?" },
  ],
  gpld: [
    { label: "Residence card", text: "Do you handle temporary residence cards?" },
    { label: "Process", text: "How does your process work?" },
    { label: "Contact", text: "How can I contact Nhi Gia?" },
  ],
  fee: [
    { label: "Process", text: "How does your process work?" },
    { label: "Contact", text: "How can I contact Nhi Gia?" },
  ],
};
