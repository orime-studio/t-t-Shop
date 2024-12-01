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
        if (id) {
            console.log("Fetching article with ID:", id);
            getArticleById(id)
                .then(res => {
                    const article = res.data;
                    console.log("Article data fetched:", article);
                    setValue('source', article.source);
                    setValue('title', article.title);
                    setValue('miniText', article.miniText);
                    setValue('alt', article.alt || article.title);
                    setImageUrls(article.images.map((image: { url: string }) => image.url));
                    setValue('longText', article.longText);
                    setImageNames(article.images.map((image: { url: string }) => image.url.split('/').pop() || ""));
                })
                .catch(err => {
                    console.error("Error fetching article:", err);
                    setError(err);
                });
        }
    }, [id, setValue]);

    const onSubmit = async (data: ArticleInput) => {
        console.log("Form data before submission:", data);  // הדפסת הנתונים לפני שליחה
        try {
            if (id) {
                const formData = new FormData();
                formData.append("source", data.source);
                formData.append("title", data.title);
                formData.append("miniText", data.miniText);

                data.longText.forEach((page, index) => {
                    formData.append(`longText[${index}][title]`, page.title);
                    formData.append(`longText[${index}][text]`, page.text);
                });

                formData.append("alt", data.alt);

                images.forEach((image, index) => {
                    formData.append(`images[${index}]`, image);
                });

                if (!images.length && imageUrls.length) {
                    imageUrls.forEach((url, index) => {
                        formData.append(`imageUrls[${index}]`, url);
                    });
                }

                // הצגת כל הנתונים שנשלחים ב-FormData
                formData.forEach((value, key) => {
                    console.log(`${key}: ${value}`);
                });

                // שליחה לשרת
                await updateArticle(id, formData);
                dialogs.success("Success", "Article updated successfully").then(() => {
                    navigate("/admin/dashboard");
                });
            }
        } catch (error: any) {
            console.error("Error updating article:", error);  // הצגת שגיאה אם יש
            if (error.response) {
                console.error("Server error response:", error.response.data);
            }
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
                    <label htmlFor="image-upload" className="file-upload-label">
                        בחר תמונות
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            console.log("Selected files:", files);  // בדיקת קבצים שנבחרו
                            setImages(files);
                            setImageNames(files.map((file) => file.name));
                        }}
                        className="file-input"
                    />
                    <div className="file-names-list">
                        {imageNames.map((name, index) => (
                            <p key={index} className="file-name">
                                {name}
                            </p>
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
                            <button type="button" className="remove-text-button" onClick={() => {
                                remove(index);
                                console.log("Removed section, current fields:", fields);  // בדיקת מצב לאחר מחיקה
                            }}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="add-text-button" onClick={() => {
                        append({ title: "", text: "" });
                        console.log("Added section, current fields:", fields);  // בדיקת מצב לאחר הוספה
                    }}>Add Section</button>
                </section>

                <button type="submit" className="submit-button">Save</button>
            </form>
        </div>
    );
};

export default EditArticle;
