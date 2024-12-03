import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import dialogs from "../../ui/dialogs";
import { ArticleInput } from "../../@Types/productType";
import { getArticleById, updateArticle } from "../../services/article-service";

const EditArticle = () => {
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, setValue, formState: { errors }, control } = useForm<ArticleInput>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "longText"
    });
    const [error, setError] = useState<Error | null>(null);
    const navigate = useNavigate();
    const [images, setImages] = useState<File[]>([]);
    const [imageNames, setImageNames] = useState<string[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        if (!id) {
            dialogs.error("Error", "Invalid article ID");
            return;
        }

        console.log("Fetching article with ID:", id);
        getArticleById(id)
            .then(res => {
                const article = res.data;
                console.log("Article data fetched:", article);
                setValue('source', article.source);
                setValue('title', article.title);
                setValue('miniText', article.miniText);
                setValue('alt', article.alt || article.title);
                setValue('longText', article.longText);
                setImageUrls(article.images.map((image: { url: string }) => image.url));
                setImageNames(article.images.map((image: { url: string }) => image.url.split('/').pop() || ""));
            })
            .catch(err => {
                console.error("Error fetching article:", err);
                setError(err);
            });
    }, [id, setValue]);

    const onSubmit = async (data: ArticleInput) => {
        console.log("Form data before submission:", data);

        if (!id) {
            dialogs.error("Error", "Invalid article ID");
            return;
        }

        if (!data.source || !data.title || !data.miniText || !data.alt) {
            dialogs.error("Error", "All fields are required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("source", data.source);
            formData.append("title", data.title);
            formData.append("miniText", data.miniText);
            formData.append("alt", data.alt);

            data.longText.forEach((page, index) => {
                formData.append(`longText[${index}][title]`, page.title);
                formData.append(`longText[${index}][text]`, page.text);
            });

            // טיפול בתמונות - אם יש תמונות חדשות להעלות
            if (images.length) {
                images.forEach((image) => {
                    formData.append("images", image); // הוספת תמונות חדשות
                });
            } else if (imageUrls.length) {
                imageUrls.forEach((url) => {
                    formData.append("imageUrls", url); // הוספת תמונות קיימות לפי ה-URL
                });
            } else {
                dialogs.error("Error", "At least one image is required");
                return;
            }

            console.log("FormData before sending:", [...formData.entries()]);
            const response = await updateArticle(id, formData);

            if (response.status === 200) {
                dialogs.success("Success", "Article updated successfully").then(() => {
                    navigate("/admin/dashboard");
                });
            } else {
                throw new Error(response.data.message || "Unexpected error");
            }
        } catch (error: any) {
            console.error("Error updating article:", error);
            dialogs.error("Error", error.response?.data?.message || "Failed to update the article");
        }
    };

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="edit-article-container">
            <h2>Edit Article</h2>
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="article-form">
                <section className="input-section">
                    <input className="input-field" placeholder="Author" {...register("source", { required: "Author is required" })} />
                    {errors.source && <p className="error-message">{errors.source.message}</p>}
                </section>
                <section className="input-section">
                    <input className="input-field" placeholder="Title" {...register("title", { required: "Title is required" })} />
                    {errors.title && <p className="error-message">{errors.title.message}</p>}
                </section>
                <section className="input-section">
                    <input className="input-field" placeholder="Short Description" {...register("miniText", { required: "Short description is required" })} />
                    {errors.miniText && <p className="error-message">{errors.miniText.message}</p>}
                </section>
                <section>
                    <label htmlFor="image-upload" className="file-upload-label">Select Images</label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            const validFiles = files.filter((file) => file.type.startsWith("image/"));
                            if (validFiles.length !== files.length) {
                                dialogs.error("Error", "Only image files are allowed");
                            }
                            setImages(validFiles);
                            setImageNames(validFiles.map((file) => file.name));
                        }}
                        className="file-input"
                    />
                    <div className="file-names-list">
                        {imageNames.map((name, index) => (
                            <p key={index} className="file-name">{name}</p>
                        ))}
                    </div>
                </section>
                <section className="input-section">
                    <input className="input-field" placeholder="Image Description (alt)" {...register("alt", { required: "Image description is required" })} />
                    {errors.alt && <p className="error-message">{errors.alt.message}</p>}
                </section>
                <section className="pages-section">
                    <h3 className="pages-header">Article Pages:</h3>
                    {fields.map((page, index) => (
                        <div key={page.id} className="article-page">
                            <input className="input-field" placeholder="Page Title" {...register(`longText.${index}.title` as const)} />
                            <textarea className="textarea-field" placeholder="Page Content" {...register(`longText.${index}.text` as const, { required: "Page content is required" })} />
                            <button type="button" className="remove-text-button" onClick={() => remove(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="add-text-button" onClick={() => append({ title: "", text: "" })}>Add Section</button>
                </section>
                <button type="submit" className="submit-button">Save</button>
            </form>
        </div>
    );
};

export default EditArticle;
