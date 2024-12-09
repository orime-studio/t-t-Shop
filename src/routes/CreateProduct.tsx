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
  const [images, setImages] = useState<FileList | null>(null);

  const onSubmit = async (data: IProductInput) => {
    if (!token) {
      dialogs.error("Error", "No authentication token found.");
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
    formData.append("basePrice", data.basePrice.toString());
    formData.append("alt", data.alt);

    if (data.salePrice) {
      formData.append("salePrice", data.salePrice.toString());
    }

    if (data.shippingTime) {
      formData.append("shippingTime", data.shippingTime.toString());
    }

    // Add categories
    const categories = Array.isArray(data.categories)
      ? data.categories
      : data.categories.split(",").map((cat) => cat.trim());
    categories.forEach((cat) => formData.append("categories[]", cat));

    // Add variants
    data.variants.forEach((variant, index) => {
      formData.append(`variants[${index}].size.value`, variant.size.value);
      formData.append(`variants[${index}].size.additionalCost`, variant.size.additionalCost.toString());
      formData.append(`variants[${index}].color.value`, variant.color.value);
      formData.append(`variants[${index}].color.additionalCost`, variant.color.additionalCost.toString());
      formData.append(`variants[${index}].quantity`, variant.quantity.toString());
    });

    // Add images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    } else {
      dialogs.error("Error", "Please upload at least one image.");
      return;
    }

    try {
      console.log("Form Data:", Object.fromEntries(formData.entries()));
      await createNewProduct(formData);
      dialogs.success("Success", "Product Created Successfully")
        .then(() => {
          navigate("/");
        });
    } catch (error: any) {
      console.error("Form Submission Error:", error.response?.data || error.message);
      dialogs.error("Error", error.response?.data?.message || "Failed to create product.");
    }
  };

  return (
    <div className="create-card-container bg-[#ffffff] text-gray-800 dark:bg-slate-600">
      <h2 className="dark:text-white">Create New Product</h2>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <section>
          <input placeholder="Title" {...register("title", { required: "Title is required" })} />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </section>

        {/* Subtitle */}
        <section>
          <input placeholder="Subtitle" {...register("subtitle", { required: "Subtitle is required" })} />
          {errors.subtitle && <p className="text-red-500">{errors.subtitle.message}</p>}
        </section>

        {/* Description */}
        <section>
          <input placeholder="Description" {...register("description", { required: "Description is required" })} />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </section>

        {/* Base Price */}
        <section>
          <input
            placeholder="Base Price"
            type="number"
            {...register("basePrice", { required: "Base price is required" })}
          />
          {errors.basePrice && <p className="text-red-500">{errors.basePrice.message}</p>}
        </section>

        {/* Sale Price */}
        <section>
          <input placeholder="Sale Price" type="number" {...register("salePrice")} />
        </section>

        {/* Shipping Time */}
        <section>
          <input
            placeholder="Shipping Time (in days)"
            type="number"
            {...register("shippingTime")}
          />
        </section>

        {/* Categories */}
        <section>
          <input placeholder="Categories (comma separated)" {...register("categories")} />
        </section>

        {/* Image Upload */}
        <section>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(e.target.files || null)}
          />
        </section>

        {/* Image Alt */}
        <section>
          <input
            placeholder="Image Description"
            {...register("alt", { required: "Image description is required" })}
          />
          {errors.alt && <p className="text-red-500">{errors.alt.message}</p>}
        </section>

        {/* Variants */}
        <section>
          <h3 className="mb-2">Variants:</h3>
          {fields.map((variant, index) => (
            <div key={variant.id} className="variant">
              <input
                placeholder="Size"
                {...register(`variants.${index}.size.value`, { required: "Size is required" })}
              />
              <input
                placeholder="Size Additional Cost"
                type="number"
                step="0.01"
                {...register(`variants.${index}.size.additionalCost`)}
              />
              <input
                placeholder="Color"
                {...register(`variants.${index}.color.value`, { required: "Color is required" })}
              />
              <input
                placeholder="Color Additional Cost"
                type="number"
                step="0.01"
                {...register(`variants.${index}.color.additionalCost`)}
              />
              <input
                placeholder="Quantity"
                type="number"
                {...register(`variants.${index}.quantity`, { required: "Quantity is required" })}
              />
              <button type="button" className="removeButton" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-variant-button"
            onClick={() => append({ color: { value: "", additionalCost: 0 }, size: { value: "", additionalCost: 0 }, quantity: 0 })}
          >
            Add Variant
          </button>
        </section>

        {/* Submit Button */}
        <button type="submit" className="submit-button bg-slate-600 text-white dark:bg-slate-900">
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
