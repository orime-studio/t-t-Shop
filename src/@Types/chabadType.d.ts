type CandleLightingItem = {
    title: string;
    date: string;
    category: string;
    hebrew: string;
    memo?: string;
};

type HebcalData = {
    items: CandleLightingItem[];
};

export type ShabbatData = {
    date: string;
    parasha: string;
    candles: string;
    havdalah: string;
};


export type Parasha = {
    author: string;          // שם המחבר
    title: string;           // כותרת הפרשה
    miniText: string;        // טקסט מקוצר שמתאר את הפרשה
    alt: string;             // תיאור התמונה (alt)
    image: IImage;    // תמונה של הפרשה
    parashPage: ParashPage[]; // רשימת עמודי הפרשה
};

export type ParashPage = {
    title: string; // כותרת של עמוד
    text: string;  // תוכן של עמוד
};