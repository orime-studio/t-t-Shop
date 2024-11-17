import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ParashaDetail.scss";
import { IParasha } from "../../@Types/productType";
import { getParashaById } from "../../services/parasha-service";

const ParashaDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [parasha, setParasha] = useState<IParasha | null>(null);

    useEffect(() => {
        if (id) {
            getParashaById(id)
                .then(res => setParasha(res.data))
                .catch(err => console.error(err));
        }
    }, [id]);

    if (!parasha) {
        return <div>Loading...</div>;
    }

    return (
        <div className="parasha-detail">
            <h1>{parasha.title}</h1>
            {parasha.components.map((component, index) => (
                <div key={index} className="component">
                    {component.type === "title" && <h2>{component.content}</h2>}
                    {component.type === "text" && <p>{component.content}</p>}
                    {component.type === "image" && component.image && <img src={component.image.url} alt={component.alt} />}
                    {/* Add additional component types here */}
                </div>
            ))}
        </div>
    );
};

export default ParashaDetail;
