import React, { useEffect, useState } from "react";
import axios from "axios";
import { Parasha } from "../../@Types/chabadType";

// טיפוס של הפרשות, תוכל לשנות לפי הצורך


const ParashaList = () => {
  const [parashot, setParashot] = useState<Parasha[]>([]);

  useEffect(() => {
    const fetchParashot = async () => {
      try {
        const response = await axios.get("/new-parashot");  // קריאה ל-API
        setParashot(response.data);  // כאן אנחנו מקבלים את הנתונים
      } catch (error) {
        console.error("Error fetching parashot:", error);
      }
    };

    fetchParashot();
  }, []);

  return (
    <div>
      <h1>All Parashot</h1>
      <ul>
        {parashot.map((parasha) => (
          <li key={parasha._id}>{parasha.title}</li>  // הצגת פרשה
        ))}
      </ul>
    </div>
  );
};

export default ParashaList;
