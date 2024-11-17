import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IParasha } from "../../@Types/productType";
import { getLatestParasha } from "../../services/parasha-service";

const LatestParasha = () => {
    const [parasha, setParasha] = useState<IParasha | null>(null);

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
            <h2>Latest Parasha</h2>
            <h3>{parasha.title}</h3>
            <Link to={`/parasha/${parasha._id}`}>Read More</Link>
        </div>
    );
};

export default LatestParasha;
