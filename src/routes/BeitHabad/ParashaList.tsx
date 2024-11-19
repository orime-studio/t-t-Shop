import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllParashot } from "../../services/parasha-service";
import { Parasha } from "../../@Types/chabadType";

const ParashaList = () => {
    const [parashot, setParashot] = useState<Parasha[]>([]);

    useEffect(() => {
        getAllParashot()
            .then(res => {
                console.log("Fetched Parashot:", res.data);
                setParashot(res.data);
            })
            .catch(err => console.error("Error fetching Parashot:", err))
            .finally(() => console.log("Final Parashot state:", parashot));
    }, []);

    return (
        <div className="parasha-list">
            <h1>All Parashot</h1>
            {parashot.length === 0 ? (
                <p>No Parashot available.</p>
            ) : (
                parashot.map(parasha => {
                    console.log("Rendering Parasha:", parasha);
                    return (
                        <div key={parasha.title} className="parasha-item">
                            <h2>{parasha.title}</h2>
                            <p>{parasha.miniText}</p>
                            <img 
                                src={parasha.image.url} 
                                alt={parasha.alt} 
                                className="parasha-image" 
                            />
                            <Link to={`/parasha/${parasha.title}`}>Read More</Link>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ParashaList;
