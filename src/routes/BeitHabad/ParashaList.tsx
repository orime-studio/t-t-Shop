import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ParashaList.scss";
import { IParasha } from "../../@Types/productType";
import { getAllParashot } from "../../services/parasha-service";

const ParashaList = () => {
    const [parashot, setParashot] = useState<IParasha[]>([]);

    useEffect(() => {
        getAllParashot()
            .then(res => setParashot(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="parasha-list">
            <h1>All Parashot</h1>
            {parashot.length === 0 ? (
                <p>No Parashot available.</p>
            ) : (
                parashot.map((parasha) => (
                    <div key={parasha._id} className="parasha-item">
                        <h2>{parasha.title}</h2>
                        <p>{parasha.components.find(c => c.type === 'text')?.content.substring(0, 100)}...</p>
                        <Link to={`/parasha/${parasha._id}`}>Read More</Link>
                    </div>
                ))
            )}
        </div>
    );
};

export default ParashaList;
