export const ROUTES = {
  HOME_PAGE: "/",
  PENDING: "/dashboard/",
  
  
};

export enum LANGUAGE {
  DEFAULT = "default",
  ENGLISH = "en",
  KANNADA = "ka",
  HINDI = "hi",
  MARATHI = "ma",
  BENGALI = "be",
  TELUGU = "ta",
}

export const LANGUAGES: Record<LANGUAGE, string> = {
  [LANGUAGE.DEFAULT]: "Select language",
  [LANGUAGE.ENGLISH]: "EN",
  [LANGUAGE.KANNADA]: "ಕನ್ನಡ",
  [LANGUAGE.HINDI]: "हिंदी",
  [LANGUAGE.MARATHI]: "मराठी",
  [LANGUAGE.BENGALI]: "বাংলা",
  [LANGUAGE.TELUGU]: "తెలుగు",
};

export const campaignColumnDefs = [
  {
    campaignId: 1,
    icon: "https://bigcity-object-store.blr1.digitaloceanspaces.com/bigcity-cashback/campaign/3ceeddbb-a322-4b16-823a-c10bbea3de1d.png",
    title: "Pulse Candy",
    startDate: "2025-01-09",
    endDate: "2026-01-09",
    status: 1,
  },
  {
    campaignId: 2,
    icon: "https://bigcity-object-store.blr1.digitaloceanspaces.com/bigcity-cashback/campaign/other-image.png",
    title: "Other Campaign",
    startDate: "2025-02-01",
    endDate: "2026-02-01",
    status: 0,
  },
];
