import React, { useEffect, useState } from "react";
import { Parasha } from "../../@Types/chabadType";
import { getLastParasha } from "../../services/parasha-service";  // ודא שאתה מייבא את הפונקציה
import './LatestParasha.scss';

const LastParasha = () => {
  const [lastParasha, setLastParasha] = useState<Parasha | null>(null);

  useEffect(() => {
getLastParasha()
  .then(res => {
    setLastParasha(res);
})
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
