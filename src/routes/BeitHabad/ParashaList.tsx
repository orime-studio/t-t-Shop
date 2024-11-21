import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllParashot } from "../../services/parasha-service";
import { Parasha } from "../../@Types/chabadType";
import './ParashaList.scss';

const ParashaList = () => {
  const [parashot, setParashot] = useState<Parasha[]>([]);
  const [loading, setLoading] = useState<boolean>(true);  // מצב טעינה
  const [error, setError] = useState<string | null>(null);  // שגיאה אם יש

  useEffect(() => {
    // קריאה ל-API
    getAllParashot()
      .then(res => {
        // לוודא שהתשובה היא מערך
        console.log('Fetched data:', res.data);  // לוג כדי לראות את הנתונים
        const data = Array.isArray(res.data) ? res.data : [];  // אם התשובה לא מערך, השתמש במערך ריק
        setParashot(data);
        setLoading(false);  // עדכון מצב טעינה
      })
      .catch(err => {
        console.error("Error fetching parashot:", err);
        setError("An error occurred while fetching the data.");  // הצגת שגיאה
        setLoading(false);  // עדכון מצב טעינה
      });
  }, []);

  // הצגת מידע למשתמש במקרה של טעינה או שגיאה
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="parasha-list">
      <h1>All Parashot</h1>
      {parashot.length === 0 ? (
        <p>No Parashot available.</p>  // אם אין פרשות להציג
      ) : (
        parashot.map(parasha => (
          <div key={parasha._id} className="parasha-item">
            <h2>{parasha.title}</h2>
            <p>{parasha.miniText}</p>
            <img 
              src={parasha.image.url} 
              alt={parasha.alt} 
              className="parasha-image" 
            />
            <Link to={`/beitChabad/parasha/${parasha._id}`}>Read More</Link>
          </div>
        ))
      )}
    </div>
  );
};

export default ParashaList;
