import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Parasha } from "../../@Types/chabadType";
import { getLastParasha } from "../../services/parasha-service";
import { Card } from "flowbite-react"; // ייבוא ה-Card של Flowbite
import './LatestParasha.scss';

const LastParasha = () => {
  const [lastParasha, setLastParasha] = useState<Parasha | null>(null);

  useEffect(() => {
    console.log("Fetching last parasha...");
    getLastParasha()
      .then(res => {
        console.log("Fetched last parasha:", res);
        setLastParasha(res);
      })
      .catch(err => {
        console.error("Error fetching last parasha:", err);
      });
  }, []);

  return (
    <div className="latest-parasha">
      {lastParasha ? (
        <Link to={`/beitChabad/parasha/${lastParasha._id}`} className="parasha-link">
          <Card className="parasha-card">
            {lastParasha.image?.url && (
              <img
                src={lastParasha.image.url}
                alt={lastParasha.image.alt || lastParasha.title}
                className="parasha-image"
              />
            )}
            <h2 className="parasha-title">{lastParasha.title}</h2>
            <p className="parasha-mini-text">{lastParasha.miniText}</p>
            <p className="parasha-author">{lastParasha.author}</p>
          </Card>
        </Link>
      ) : (
        <p>No last Parasha available at the moment.</p>
      )}
    </div>
  );
};

export default LastParasha;
