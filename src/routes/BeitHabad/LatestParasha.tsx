import React, { useEffect, useState } from "react";
import { Parasha } from "../../@Types/chabadType";
import { getLastParasha } from "../../services/parasha-service";  // ודא שאתה מייבא את הפונקציה
import './LatestParasha.scss';

const LastParasha = () => {
  const [lastParasha, setLastParasha] = useState<Parasha | null>(null);

  useEffect(() => {
    const fetchLastParasha = async () => {
      try {
        console.log("Fetching the last parasha..."); // לוג לפני הקריאה
        const data = await getLastParasha(); // קריאה לפונקציה שמביאה את הפרשה האחרונה
        console.log("Data received:", data); // לוג אחרי קבלת התגובה
        setLastParasha(data);
      } catch (error) {
        console.error("Error fetching last parasha:", error);
      }
    };

    fetchLastParasha(); // קריאה לפונקציה בעת טעינת הקומפוננטה
  }, []);

  return (
    <div className="latest-parasha">
      <h1>Last Parasha</h1>
      {lastParasha ? (
        <p>{lastParasha.title}</p>  // הצגת שם הפרשה האחרונה
      ) : (
        <p>Loading...</p> // תצוגת טקסט כאשר הנתונים עדיין נטענים
      )}
    </div>
  );
};

export default LastParasha;
