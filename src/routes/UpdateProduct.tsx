import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateProduct.scss";
import dialogs from "../ui/dialogs";
import { getProductById, updateProduct } from "../services/product-service";
import { IProductInput } from "../@Types/productType";
import { useState, useEffect } from "react";

const EditProduct = () => {
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, setValue, formState: { errors }, control } = useForm<IProductInput>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants"
    });
    const [error, setError] = useState<Error | null>(null);
    const navigate = useNavigate();

    const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
        control,
        name: "variants.0.colors"
    });

    const [images, setImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    useEffect(() => {

        if (!id) {
            dialogs.error("Error", "Invalid article ID");
            return;
        }

        if (id) {
            getProductById(id)
                .then(res => {
                    const product = res.data;

                    if (product.mainImage && product.mainImage.url) {
                        setMainImagePreview(product.mainImage.url); // שימוש ב-URL של תמונת mainImage
                    }

                    setValue('title', product.title);
                    setValue('subtitle', product.subtitle);
                    setValue('description', product.description);
                    setValue('alt', product.alt);
                    setValue('variants', product.variants || []);
                    setValue('mainCategory', product.mainCategory);
                    setValue('tags', product.tags || []);

                    const existingImageUrls = product.images.map((image: { url: string }) => image.url);
                    setImageUrls(existingImageUrls);
    
                    // יצירת תצוגות מקדימות לתמונות
                    setImagePreviews(existingImageUrls);
                })
                .catch(err => setError(err));
        }
    }, [id, setValue]);

    const onSubmit = async (data: IProductInput) => {
        console.log("Form data before submission:", data);

        if (!id) {
            dialogs.error("Error", "Invalid article ID");
            return;
        }
        if (!data.title || !data.subtitle || !data.description || !data.alt || !data.variants || !data.mainCategory || !data.tags) {
            dialogs.error("Error", "All fields are required");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("subtitle", data.subtitle);
            formData.append("description", data.description);
            formData.append("alt", data.alt);
            formData.append("mainCategory", data.mainCategory);
            data.tags.forEach((tag, index) => {
                formData.append(`tags[${index}]`, tag);
            });

            // הוספת variants
            data.variants.forEach((variant, index) => {
                formData.append(`variants[${index}][size]`, variant.size);
                formData.append(`variants[${index}][price]`, variant.price.toString());
                variant.colors.forEach((color, colorIndex) => {
                    formData.append(`variants[${index}][colors][${colorIndex}][name]`, color.name);
                    formData.append(`variants[${index}][colors][${colorIndex}][quantity]`, color.quantity.toString());
                });
            });

            if (mainImage) {
                formData.append("mainImage", mainImage);
            } else if (mainImagePreview) {
                formData.append("mainImageUrl", mainImagePreview); // שליחת ה-URL של התמונה הקיימת
            }
            if (images.length) {
                images.forEach((image) => {
                    formData.append("images", image); // Add new images
                });
            } else if (imageUrls.length) {
                imageUrls.forEach((url) => {
                    formData.append("images", url); // Add existing images by URL
                });
            } else {
                dialogs.error("Error", "At least one image is required");
                return;
            }

            console.log("FormData before sending:", [...formData.entries()]);

            const response = await updateProduct(id, formData);

            if (response.status === 200) {
                dialogs.success("Success", "Article updated successfully").then(() => {
                    navigate("/admin/dashboard");
                });
            } else {
                throw new Error(response.data.message || "Unexpected error");
            }
        } catch (error: any) {
            console.error("Error updating product:", error);
            dialogs.error("Error", error.response?.data?.message || "Failed to update the product");
        }
    }

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="create-card-container text-gray-800 dark:bg-slate-600">
            <h2>Edit Product</h2>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <section>
                    <input placeholder="Title" {...register("title", { required: "Title is required" })} />
                    {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                </section>
                <section>
                    <input placeholder="Subtitle" {...register("subtitle", { required: "Subtitle is required" })} />
                    {errors.subtitle && <p className="text-red-500">{errors.subtitle.message}</p>}
                </section>
                <section>
                    <input placeholder="Description" {...register("description", { required: "Description is required" })} />
                    {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                </section>
                <section>
                    <label htmlFor="main-image-upload" className="file-upload-label">Main Image</label>
                    <input
                        id="main-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files ? e.target.files[0] : null;
                            if (file) {
                                if (!file.type.startsWith("image/")) {
                                    dialogs.error("Error", "Only image files are allowed");
                                    return;
                                }

                                setMainImage(file); // שמירת התמונה הראשית
                                setMainImagePreview(URL.createObjectURL(file)); // יצירת URL זמני לתצוגה מקדימה
                            }
                        }}
                        className="file-input"
                        name="mainImage"
                    />

                    {/* תצוגת מקדימה של תמונת Main */}
                    {mainImagePreview && (
                        <div className="image-preview">
                            <img src={mainImagePreview} alt="Main Image Preview" />
                        </div>
                    )}
                </section>

                <section>
                    <label htmlFor="image-upload" className="file-upload-label">Additional Images</label>
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
                            setImagePreviews(validFiles.map((file) => URL.createObjectURL(file))); // יצירת URLs זמניים
                        }}
                        className="file-input"
                        name="images"
                    />

                    <div className="image-previews">
                        {imagePreviews.map((preview, index) => (
                            <img key={index} src={preview} alt={`Preview ${index + 1}`} className="image-preview" />
                        ))}
                    </div>
                </section>

                <section>
                    <input placeholder="Image Description" {...register("alt", { required: "Image description is required" })} />
                    {errors.alt && <p className="text-red-500">{errors.alt.message}</p>}
                </section>

                <section>
                    <input placeholder="Main Category" {...register("mainCategory", { required: "Main category is required" })} />
                    {errors.mainCategory && <p className="text-red-500">{errors.mainCategory.message}</p>}
                </section>

                <section>
                    <input placeholder="Tags" {...register("tags", { required: "Tags are required" })} />
                    {errors.tags && <p className="text-red-500">{errors.tags.message}</p>}
                </section>

                <section>
                    <h3 className="mb-2">Variants:</h3>
                    {fields.map((variant, index) => (
                        <div key={variant.id} className="variant">
                            <input placeholder="Size" {...register(`variants.${index}.size` as const, { required: "Size is required" })} />
                            <input placeholder="Price" type="number" step="0.01" {...register(`variants.${index}.price` as const, { required: "Price is required" })} />
                            
                            <h4>Colors:</h4>
                            {colorFields.map((color, colorIndex) => (
                                <div key={color.id} className="color">
                                    <input placeholder="Color Name" {...register(`variants.${index}.colors.${colorIndex}.name` as const, { required: "Color name is required" })} />
                                    <input placeholder="Quantity" type="number" {...register(`variants.${index}.colors.${colorIndex}.quantity` as const, { required: "Quantity is required" })} />
                                    <button type="button" className="removeButton" onClick={() => removeColor(colorIndex)}>Remove Color</button>
                                </div>
                            ))}
                            <button type="button" className="add-color-button" onClick={() => appendColor({ name: "", quantity: 0 })}>Add Color</button>
                            
                            <button type="button" className="removeButton" onClick={() => remove(index)}>Remove Variant</button>
                        </div>
                    ))}
                    <button type="button" className="add-variant-button" onClick={() => append({ size: "", price: 0, colors: [], })}>Add Variant</button>
                </section>

                <button type="submit" className=" bg-slate-600 text-white dark:bg-slate-900">Save</button>
            </form>
        </div>
    );
};

export default EditProduct;