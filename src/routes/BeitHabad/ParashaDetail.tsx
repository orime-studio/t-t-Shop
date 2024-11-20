import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Parasha } from "../../@Types/chabadType";
import { getParashaById } from "../../services/parasha-service";

const ParashaDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [parasha, setParasha] = useState<Parasha | null>(null);

    useEffect(() => {
        if (id) {
            getParashaById(id)
                .then(res => setParasha(res.data))
                .catch(err => console.error("Error fetching parasha:", err));
        }
    }, [id]);

    if (!parasha) {
        return <div>Loading...</div>;
    }

    return (
        <div className="parasha-detail">
            <h1>{parasha.title}</h1>
            <img
                src={parasha.image.url}
                alt={parasha.alt || "Parasha Image"}
                className="parasha-image"
            />
            <div className="parasha-pages">
                {parasha.parashPage.map((page, index) => (
                    <div key={index} className="parasha-page">
                        <h2>{page.title}</h2>
                        <p>{page.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParashaDetail;
