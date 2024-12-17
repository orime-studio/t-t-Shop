import { useForm, useFieldArray, Controller } from "react-hook-form";
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
    const { register, handleSubmit, formState: { errors }, control, setValue, getValues } = useForm<IProductInput>();
    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control,
        name: "variants"
    });

    const [mainImage, setMainImage] = useState<File | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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

    const handleAddColor = (index: number) => {
        const newColor = { name: "", quantity: 0 }; // Create new color object

        const currentColors = getValues(`variants.${index}.colors`);
        const updatedColors = [...currentColors, newColor];

        // Update colors array in react-hook-form
        setValue(`variants.${index}.colors`, updatedColors);
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

            // Adding colors
            const colorsArray = Array.isArray(variant.colors)
                ? variant.colors.map(color => String(color)) 
                : [String(variant.colors)];
            
            colorsArray.forEach((color, colorIndex) => {
                formData.append(`variants[${index}][colors][${colorIndex}]`, color);
            });
        });

        formData.append("alt", data.alt);
        formData.append("mainCategory", data.mainCategory);

        const tagsArray = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [];
        tagsArray.forEach((tag, index) => {
            formData.append(`tags[${index}]`, tag);
        });

        try {
            console.log("Form Data:", Object.fromEntries(formData.entries()));
            await createNewProduct(formData);
            dialogs.success("Success", "Product Created Successfully")
                .then(() => {
                    navigate("/");
                });
        } catch (error: any) {
            console.error("Form Data Error:", Object.fromEntries(formData.entries()));
            dialogs.error("Error", error.response?.data?.message || "Failed to create product");
            console.error(error);
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
                    <label>Main Image</label>
                    <input type="file" accept="image/*" onChange={handleMainImageChange} />
                    {mainImagePreview && <img src={mainImagePreview} alt="Main Image Preview" className="image-preview" />}
                </section>
                <section className="article-section">
                    <label>Additional Images</label>
                    <input type="file" accept="image/*" multiple onChange={handleImagesChange} />
                    <div className="image-previews">
                        {imagePreviews.map((preview, index) => (
                            <img key={index} src={preview} alt={`Preview ${index}`} className="image-preview" />
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
                    <input placeholder="Tags (comma separated)" {...register("tags", { required: "Tags are required" })} />
                    {errors.tags && <p className="text-red-500">{errors.tags.message}</p>}
                </section>
                <section>
                    <h3 className="text-xl font-bold text-gray-800">Variants</h3>
                    {variantFields.map((variant, index) => (
                        <div key={variant.id} className="p-4 mb-4 space-y-4 bg-white rounded shadow">
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    {...register(`variants.${index}.size`, { required: "Size is required" })}
                                    className="w-1/2 px-4 py-2 border rounded"
                                    placeholder="Enter size (e.g., S, M, L)"
                                />
                                <input
                                    type="number"
                                    {...register(`variants.${index}.price`, { required: "Price is required" })}
                                    className="w-1/2 px-4 py-2 border rounded"
                                    placeholder="Enter price"
                                />
                            </div>
                            <div>
                                <h4 className="font-bold">Colors</h4>
                                {variant.colors?.map((color, colorIndex) => (
                                    <div key={colorIndex} className="flex items-center space-x-4">
                                        <input
                                            type="text"
                                            {...register(`variants.${index}.colors.${colorIndex}.name`)}
                                            className="w-1/2 px-4 py-2 border rounded"
                                            placeholder="Color Name"
                                        />
                                        <input
                                            type="number"
                                            {...register(`variants.${index}.colors.${colorIndex}.quantity`)}
                                            className="w-1/4 px-4 py-2 border rounded"
                                            placeholder="Quantity"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleAddColor(index)}
                                    className="px-4 py-2 text-white bg-blue-500 rounded mt-2"
                                >
                                    Add Color
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                className="px-4 py-2 text-white bg-red-500 rounded"
                            >
                                Remove Variant
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendVariant({ size: "", price: 0, colors: [] })}
                        className="px-4 py-2 text-white bg-green-500 rounded"
                    >
                        Add Variant
                    </button>
                </section>
                <button type="submit">Create Product</button>
            </form>
        </div>
    );
};

export default CreateProduct;
