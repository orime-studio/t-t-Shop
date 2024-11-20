import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IParasha } from "../../@Types/productType";
import { getLatestParasha } from "../../services/parasha-service";
import { Parasha } from "../../@Types/chabadType";

const LatestParasha = () => {
    const [parasha, setParasha] = useState<Parasha | null>(null);

    useEffect(() => {
        getLatestParasha()
            .then(res => setParasha(res.data[0]))
            .catch(err => console.error(err));
    }, []);

    if (!parasha) {
        return <div>Loading...</div>;
    }

    return (
        <div className="latest-parasha">
            <img
                src={parasha.image.url}
                alt={parasha.alt}
                className="parasha-image"
            />
            <h2>Latest Parasha</h2>
            <h3>{parasha.title}</h3>
            <Link to={`/parasha/${parasha._id}`}>Read More</Link>
        </div>
    );
};

export default LatestParasha;
