import React, { useEffect, useState } from "react";
import { Parasha } from "../../@Types/chabadType";
import { getLastParasha } from "../../services/parasha-service"; // ודא שאתה מייבא את הפונקציה
import './LatestParasha.scss';

const LastParasha = () => {
  const [lastParasha, setLastParasha] = useState<Parasha | null>(null);

  useEffect(() => {
    console.log("useEffect ran!"); // לוג ראשוני לבדיקה
  }, []);
  

  useEffect(() => {
    console.log("Fetching last parasha...");
    getLastParasha()
      .then(res => {
        console.log("Fetched last parasha:", res); // לוג לתוצאה מהשרת
        setLastParasha(res);
      })
      .catch(err => {
        console.error("Error fetching last parasha:", err); // לוג במקרה של שגיאה
      });
  }, []);

  console.log("Rendered lastParasha state:", lastParasha); // לוג למצב הנוכחי של lastParasha

  return (
    <div className="latest-parasha">
      <h1>Last Parasha</h1>
      {lastParasha ? (
        <p>{lastParasha.title}</p> // הצגת שם הפרשה האחרונה
      ) : (
        <p>Loading...</p> // תצוגת טקסט כאשר הנתונים עדיין נטענים
      )}
    </div>
  );
};

export default LastParasha;
