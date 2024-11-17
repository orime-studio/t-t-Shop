import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IParashaInput } from "../../@Types/productType";
import { createNewParasha } from "../../services/parasha-service";
import dialogs from "../../ui/dialogs";


const CreateParasha = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm<IParashaInput>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "components"
    });
    const navigate = useNavigate();

    const onSubmit = async (data: IParashaInput) => {
        try {
            await createNewParasha(data);
            dialogs.success("Success", "Parasha Created Successfully")
                .then(() => {
                    navigate("/parasha");
                });
        } catch (error: any) {
            dialogs.error("Error", error.response?.data?.message || "Failed to create Parasha");
        }
    };

    return (
        <div className="create-parasha-container bg-[#ffffff] text-gray-800 dark:bg-slate-600">
            <h2 className="dark:text-white">Create New Parasha</h2>
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

                <button type="submit" className="submit-button bg-slate-600 text-white dark:bg-slate-900">Create Parasha</button>
            </form>
        </div>
    );
};

export default CreateParasha;
