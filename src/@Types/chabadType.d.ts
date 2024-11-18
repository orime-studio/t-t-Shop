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
  
  type ShabbatData = {
    date: string;
    parasha: string;
    candles: string;
    havdalah: string;
  };