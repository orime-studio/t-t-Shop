import React, { useEffect, useState } from "react";
import axios from "axios";

const LastParasha = () => {
  const [lastParasha, setLastParasha] = useState(null);

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
        <p>{lastParasha.name}</p>  // הצגת שם הפרשה האחרונה
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LastParasha;
