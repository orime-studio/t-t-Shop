import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./CreateProduct.scss";
import dialogs from "../ui/dialogs";
import { useAuth } from "../hooks/useAuth";
import { IProductInput } from "../@Types/productType";
import { useState } from "react";
import { createNewProduct } from "../services/product-service";

const CreateProduct = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, control } = useForm<IProductInput>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants"
    });

    const [mainImage, setMainImage] = useState<File | null>(null);

    const [images, setImages] = useState<File[]>([]);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageNames, setImageNames] = useState<string[]>([]);
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const file = e.target.files[0];
            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages(files);
        setImagePreviews(files.map(file => URL.createObjectURL(file)));
    };


    const onSubmit = async (data: IProductInput) => {
        if (!token) {
            dialogs.error("Error", "No authentication token found.");
            return;
        }
        if (!mainImage) {
            dialogs.error("Error", "Please select a main image.");
            return;
        }

        if (!data.variants.length) {
            dialogs.error("Error", "Please add at least one variant.");
            return;
        }

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("subtitle", data.subtitle);
        formData.append("description", data.description);

        formData.append("mainImage", mainImage);

        images.forEach((image) => {
            formData.append("images", image);
        });

        data.variants.forEach((variant, index) => {
            formData.append(`variants[${index}][size]`, variant.size);
            formData.append(`variants[${index}][price]`, variant.price.toString());
            formData.append(`variants[${index}][quantity]`, variant.quantity.toString());
        });

        formData.append("alt", data.alt);

        // הוספת כל התמונות ל-FormData


        try {
            console.log("Form Data:", Object.fromEntries(formData.entries())); // לוג לפני שליחה
            await createNewProduct(formData);
            dialogs.success("Success", "Product Created Successfully")
                .then(() => {
                    navigate("/");
                });
        } catch (error: any) {
            console.log("Form Data Error:", Object.fromEntries(formData.entries())); // לוג בשגיאה
            dialogs.error("Error", error.response?.data?.message || "Failed to create product");
            console.log(error);
        }
    };

    return (
        <div className="create-card-container bg-[#ffffff] text-gray-800 dark:bg-slate-600">
            <h2 className="dark:text-white">Create New Product</h2>
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

                <section className="article-section">
                    <label htmlFor="mainImage" className="article-input-label">Main Image</label>
                    <input
                        className="article-input-file"
                        type="file"
                        accept="image/*"
                        name="mainImage" // שם השדה מותאם לנתיב בשרת
                        onChange={handleMainImageChange}
                    />
                    {mainImagePreview && <img src={mainImagePreview} alt="Main Image Preview" className="image-preview" />}
                </section>

                {/* שדה עבור התמונות הנוספות */}
                <section className="article-section">
                    <label htmlFor="images" className="article-input-label">Additional Images</label>
                    <input
                        className="article-input-file"
                        type="file"
                        accept="image/*"
                        name="images" // שם השדה מותאם לנתיב בשרת
                        multiple
                        onChange={handleImagesChange}
                    />
                    <div className="image-previews">
                        {imagePreviews.map((imagePreview, index) => (
                            <img key={index} src={imagePreview} alt={`Preview ${index}`} className="image-preview" />
                        ))}
                    </div>
                </section>

                <section>
                    <input placeholder="Image Description" {...register("alt", { required: "Image description is required" })} />
                    {errors.alt && <p className="text-red-500">{errors.alt.message}</p>}
                </section>

                <section>
                    <h3 className="mb-2">Variants:</h3>
                    {fields.map((variant, index) => (
                        <div key={variant.id} className="variant">
                            <input placeholder="Size" {...register(`variants.${index}.size` as const, { required: "Size is required" })} />
                            <input placeholder="Price" type="number" step="0.01" {...register(`variants.${index}.price` as const, { required: "Price is required" })} />
                            <input placeholder="Quantity" type="number" {...register(`variants.${index}.quantity` as const, { required: "Quantity is required" })} />
                            <button type="button" className="removeButton" onClick={() => remove(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="add-variant-button" onClick={() => append({ _id: "", size: "", price: null, quantity: null })}>Add Variant</button>
                </section>
                <button type="submit" className="submit-button bg-slate-600 text-white dark:bg-slate-900">Create Product</button>
            </form>
        </div>
    );
};

export default CreateProduct;
