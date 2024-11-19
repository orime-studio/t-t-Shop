import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IParasha } from "../../@Types/productType";
import { getAllParashot } from "../../services/parasha-service";
import { Parasha } from "../../@Types/chabadType";

const ParashaList = () => {
    const [parashot, setParashot] = useState<Parasha[]>([]);

    useEffect(() => {
        getAllParashot()
            .then(res => setParashot(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="parasha-list">
            <h1>Parashot</h1>
            {parashot.map(parasha => (
                <div key={parasha.title} className="parasha-item">
                    <Link to={`/parasha/${parasha.title}`}>{parasha.title}</Link>
                </div>
            ))}
        </div>
    );

};

export default ParashaList;
