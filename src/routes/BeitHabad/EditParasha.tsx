import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import './EditParasha.scss';

import { useState, useEffect } from "react";
import { getParashaById, updateParasha } from "../../services/parasha-service";
import { ParashaInput } from "../../@Types/chabadType";
import dialogs from "../../ui/dialogs";

const EditParasha = () => {
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, setValue, formState: { errors }, control } = useForm<ParashaInput>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "parashPage"
    });
    const [error, setError] = useState<Error | null>(null);
    const navigate = useNavigate();
    const [image, setImage] = useState<File | null>(null);
    const [imageName, setImageName] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        if (id) {
            getParashaById(id) // Assuming this is fetching the parasha data
                .then(res => {
                    const parasha = res.data;
                    setValue('author', parasha.author);
                    setValue('title', parasha.title);
                    setValue('miniText', parasha.miniText);
                    setValue('alt', parasha.alt);
                    setImageUrl(parasha.image?.url || "");

                    // Set the parashPage array
                    setValue('parashPage', parasha.parashPage);

                    // If there is an existing image
                    setImageName(parasha.image?.url.split('/').pop() || "");
                })
                .catch(err => setError(err));
        }
    }, [id, setValue]);

    const onSubmit = async (data: ParashaInput) => {
        try {
            if (id) {
                const formData = new FormData();
                formData.append("author", data.author);
                formData.append("title", data.title);
                formData.append("miniText", data.miniText);

                // Add parashPage
                data.parashPage.forEach((page, index) => {
                    formData.append(`parashPage[${index}][title]`, page.title);
                    formData.append(`parashPage[${index}][text]`, page.text);
                });

                formData.append("alt", data.alt);
                if (image) {
                    formData.append("image", image);
                } else {
                    formData.append("imageUrl", imageUrl); // Use the existing image if no new image is selected
                }

                await updateParasha(id, formData); // Assuming updateProduct is also used for parasha updates
                dialogs.success("Success", "Parasha updated successfully").then(() => {
                    navigate("/admin/dashboard");
                });
            }
        } catch (error: any) {
            dialogs.error("Error", error.response?.data?.message || "Failed to update parasha");
            console.log(error);
        }
    };

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="create-card-container text-gray-800 dark:bg-slate-600">
            <h2>Edit Parasha</h2>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <section>
                    <input placeholder="Author" {...register("author", { required: "Author is required" })} />
                    {errors.author && <p className="text-red-500">{errors.author.message}</p>}
                </section>
                <section>
                    <input placeholder="Title" {...register("title", { required: "Title is required" })} />
                    {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                </section>
                <section>
                    <input placeholder="Mini Text" {...register("miniText", { required: "Mini text is required" })} />
                    {errors.miniText && <p className="text-red-500">{errors.miniText.message}</p>}
                </section>
                <section>
                    <input
                        type="file"
                        accept="image/*"
                        className="custom-file-upload"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setImage(file);
                            setImageName(file ? file.name : "");
                        }}
                    />
                    {imageName && <p className="file-name">{imageName}</p>}
                </section>
                <section>
                    <input placeholder="Image Description" {...register("alt", { required: "Image description is required" })} />
                    {errors.alt && <p className="text-red-500">{errors.alt.message}</p>}
                </section>

                <section>
                    <h3 className="mb-2">Parasha Pages:</h3>
                    {fields.map((page, index) => (
                        <div key={page.id} className="parasha-page">
                            <input placeholder="Page Title" {...register(`parashPage.${index}.title` as const, { required: "Page Title is required" })} />
                            <textarea placeholder="Page Text" {...register(`parashPage.${index}.text` as const, { required: "Page Text is required" })} />
                            <button type="button" className="removeButton" onClick={() => remove(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="add-page-button" onClick={() => append({ title: "", text: "" })}>Add Page</button>
                </section>

                <button type="submit" className="bg-slate-600 text-white dark:bg-slate-900">Save</button>
            </form>
        </div>
    );
};

export default EditParasha;
