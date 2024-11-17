import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import "./EditParasha.scss";
import { IParashaInput } from "../../@Types/productType";
import { getParashaById, updateParasha } from "../../services/parasha-service";
import dialogs from "../../ui/dialogs";

const EditParasha = () => {
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<IParashaInput>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "components"
    });
    const [error, setError] = useState<Error | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            getParashaById(id)
                .then(res => {
                    const parasha = res.data;
                    setValue('title', parasha.title);
                    setValue('components', parasha.components);
                })
                .catch(err => setError(err));
        }
    }, [id, setValue]);

    const onSubmit = async (data: IParashaInput) => {
        try {
            if (id) {
                await updateParasha(id, data);
                dialogs.success("Success", "Parasha updated successfully").then(() => {
                    navigate("/parasha");
                });
            }
        } catch (error: any) {
            dialogs.error("Error", error.response?.data?.message || "Failed to update Parasha");
        }
    };

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="edit-parasha-container text-gray-800 dark:bg-slate-600">
            <h2>Edit Parasha</h2>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <section>
                    <input placeholder="Title" {...register("title", { required: "Title is required" })} />
                    {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                </section>

                <section>
                    <h3 className="mb-2">Components:</h3>
                    {fields.map((component, index) => (
                        <div key={component.id} className="component">
                            <select {...register(`components.${index}.type` as const, { required: "Component type is required" })}>
                                <option value="banner">Banner</option>
                                <option value="image">Image</option>
                                <option value="title">Title</option>
                                <option value="text">Text</option>
                            </select>
                            <input placeholder="Content" {...register(`components.${index}.content` as const, { required: "Content is required" })} />
                            <button type="button" className="removeButton" onClick={() => remove(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="add-component-button" onClick={() => append({ type: "text", content: "" })}>Add Component</button>
                </section>

                <button type="submit" className="bg-slate-600 text-white dark:bg-slate-900">Save</button>
            </form>
        </div>
    );
};

export default EditParasha;
