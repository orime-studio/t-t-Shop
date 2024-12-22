import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IProductInput } from "../@Types/productType"; // Assuming the types are imported correctly
import { useAuth } from "../hooks/useAuth";
import { createNewProduct } from "../services/product-service";
import dialogs from "../ui/dialogs";
import "./CreateProduct.scss";

const CreateProduct = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { control, handleSubmit, register, formState: { errors }, getValues, setValue } = useForm<IProductInput>({
    defaultValues: {
      variants: [{ size: "", price: 0, colors: [{ name: "", quantity: 0 }] }] // Default structure with colors
    }
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants"
  });

  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
    control,
    name: "variants.0.colors" // Make sure it's properly nested
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
    appendColor({ name: "", quantity: 0 });
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
      variant.colors.forEach((color, colorIndex) => {
        formData.append(`variants[${index}][colors][${colorIndex}][name]`, color.name);
        formData.append(`variants[${index}][colors][${colorIndex}][quantity]`, color.quantity.toString());
      });
    });

    formData.append("alt", data.alt);
    formData.append("mainCategory", data.mainCategory);

    const tagsArray = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [];
    tagsArray.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    try {
      await createNewProduct(formData);
      dialogs.success("Success", "Product Created Successfully")
        .then(() => navigate("/"));
    } catch (error: any) {
      dialogs.error("Error", error.response?.data?.message || "Failed to create product");
    }
  };

  return (
    <div className="create-product-container bg-[#ffffff] text-gray-800 dark:bg-slate-600">
      <h2 className="dark:text-white">Create New Product</h2>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* Title Section */}
        <section>
          <input placeholder="Title" {...register("title", { required: "Title is required" })} />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </section>

        {/* Subtitle Section */}
        <section>
          <input placeholder="Subtitle" {...register("subtitle", { required: "Subtitle is required" })} />
          {errors.subtitle && <p className="text-red-500">{errors.subtitle.message}</p>}
        </section>

        {/* Description Section */}
        <section>
          <input placeholder="Description" {...register("description", { required: "Description is required" })} />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </section>

        {/* Main Image Section */}
        <section className="article-section">
          <label>Main Image</label>
          <input type="file" accept="image/*" onChange={handleMainImageChange} />
          {mainImagePreview && <img src={mainImagePreview} alt="Main Image Preview" className="image-preview" />}
        </section>

        {/* Additional Images Section */}
        <section className="article-section">
          <label>Additional Images</label>
          <input type="file" accept="image/*" multiple onChange={handleImagesChange} />
          <div className="image-previews">
            {imagePreviews.map((preview, index) => (
              <img key={index} src={preview} alt={`Preview ${index}`} className="image-preview" />
            ))}
          </div>
        </section>

        {/* Variant and Colors Section */}
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

              {/* Colors */}
              {/* Colors */}
              <div>
                <h4 className="font-bold">Colors</h4>
                {colorFields.map((color, colorIndex) => (
                  <div key={color.id} className="flex items-center space-x-4">
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
                    {/* Remove Color Button */}
                    <button
                      type="button"
                      onClick={() => removeColor(colorIndex)}
                      className="px-2 py-1 text-white bg-red-500 rounded"
                    >
                      Remove
                    </button>
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


              {/* Remove Variant Button */}
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="px-4 py-2 text-white bg-red-500 rounded"
              >
                Remove Variant
              </button>
            </div>
          ))}

          {/* Add Variant Button */}
          <button
            type="button"
            onClick={() => appendVariant({ size: "", price: 0, colors: [{ name: "", quantity: 0 }] })}
            className="px-4 py-2 text-white bg-green-500 rounded"
          >
            Add Variant
          </button>
        </section>

        {/* Submit Button */}
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
