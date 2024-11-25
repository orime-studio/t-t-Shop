import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // כדי להשתמש בקישור לדף אחר
import { Parasha } from "../../@Types/chabadType";
import { getLastParasha } from "../../services/parasha-service"; // ודא שאתה מייבא את הפונקציה
import './LatestParasha.scss';

const LastParasha = () => {
  const [lastParasha, setLastParasha] = useState<Parasha | null>(null);

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
          {lastParasha ? (
              <Link to={`/beitChabad/parasha/${lastParasha._id}`} className="parasha-link">
                  <div className="parasha-card">
                      {lastParasha.image?.url && ( // הצגת תמונה רק אם יש URL
                          <img
                              src={lastParasha.image.url}
                              alt={lastParasha.image.alt || lastParasha.title}
                              className="parasha-image"
                          />
                      )}
                      <h2 className="parasha-title">{lastParasha.title}</h2>
                      <p className="parasha-mini-text">{lastParasha.miniText}</p>

                      <p className="parasha-author">By: {lastParasha.author}</p>
                  </div>
              </Link>
          ) : (
              <p>No last Parasha available at the moment.</p>
          )}
      </div>
  );

};

export default LastParasha;
