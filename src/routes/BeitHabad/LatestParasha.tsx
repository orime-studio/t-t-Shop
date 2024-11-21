import React, { useEffect, useState } from "react";
import axios from "axios";
import { Parasha } from "../../@Types/chabadType";

const LastParasha = () => {
  const [lastParasha, setLastParasha] = useState<Parasha | null>(null);

  useEffect(() => {
    const fetchLastParasha = async () => {
      try {
        const response = await axios.get("/parashot", {
          params: { last: "true" },
        });
        setLastParasha(response.data);  // עדכון עם הפרשה האחרונה
      } catch (error) {
        console.error("Error fetching last parasha:", error);
      }
    };

    fetchLastParasha();
  }, []);

  return (
    <div>
      <h1>Last Parasha</h1>
      {lastParasha ? (
        <p>{lastParasha.title}</p>  // הצגת שם הפרשה האחרונה
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LastParasha;
