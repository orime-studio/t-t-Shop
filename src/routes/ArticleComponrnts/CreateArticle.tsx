import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import dialogs from "../../ui/dialogs";
import { Article } from "../../@Types/productType";
import { createNewArticle } from "../../services/article-service";
import './CreateArticle.scss';

const CreateArticle = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Article>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "longText",
  });
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);

  const onSubmit = async (data: Article) => {
    if (!mainImage) {
      dialogs.error("Error", "Please select a main image.");
      return;
    }

    if (!data.longText.length) {
      dialogs.error("Error", "Please add at least one text section.");
      return;
    }

    const formData = new FormData();
    formData.append("source", data.source);
    formData.append("title", data.title);
    formData.append("miniText", data.miniText);
    formData.append("alt", data.alt);

    // Adding long text sections
    data.longText.forEach((page, index) => {
      formData.append(`longText[${index}][title]`, page.title || "");
      formData.append(`longText[${index}][text]`, page.text);
    });

    // Adding main image
    formData.append("mainImage", mainImage);

    // Adding additional images
    additionalImages.forEach((image) => {
      formData.append("additionalImages", image);
    });

    try {
      await createNewArticle(formData);
      dialogs.success("Success", "Article created successfully").then(() => {
        navigate("/articles");
      });
    } catch (error: any) {
      console.error("Error submitting form data:", error);
      dialogs.error("Error", error.response?.data?.message || "Failed to create the article");
    }
  };

  return (
    <div className="create-article-container">
      <h2 className="create-article-title">Create New Article</h2>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="form-container">
        
        {/* Author */}
        <section className="article-section">
          <input
            className="article-input"
            placeholder="Author"
            {...register("source", { required: "Author is required" })}
          />
          {errors.source && <p className="errorMessage">{errors.source.message}</p>}
        </section>

        {/* Title */}
        <section className="article-section">
          <input
            className="article-input"
            placeholder="Title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <p className="errorMessage">{errors.title.message}</p>}
        </section>

        {/* Short Description */}
        <section className="article-section">
          <textarea
            className="article-textarea"
            placeholder="Short Description"
            {...register("miniText", { required: "Short description is required" })}
          />
          {errors.miniText && <p className="errorMessage">{errors.miniText.message}</p>}
        </section>

        {/* Main Image */}
        <section className="article-section">
          <input
            className="article-input-file"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setMainImage(file);
            }}
          />
          {mainImage && <img src={URL.createObjectURL(mainImage)} alt="Main Image" className="main-image-preview" />}
        </section>

        {/* Additional Images */}
        <section className="article-section">
          <input
            className="article-input-file"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setAdditionalImages(files);
            }}
          />
          <div className="additional-images-preview">
            {additionalImages.map((image, index) => (
              <div key={index} className="additional-image">
                <img src={URL.createObjectURL(image)} alt={`Additional ${index}`} className="additional-image-preview" />
                <button
                  type="button"
                  className="remove-article-button"
                  onClick={() => {
                    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Image Alt Text */}
        <section className="article-section">
          <input
            className="article-input"
            placeholder="Image Description (alt)"
            {...register("alt", { required: "Image description is required" })}
          />
          {errors.alt && <p className="errorMessage">{errors.alt.message}</p>}
        </section>

        {/* Article Pages */}
        <section className="article-section">
          <h3 className="article-section-title">Article Pages:</h3>
          {fields.map((page, index) => (
            <div key={page.id} className="variant">
              <input
                className="article-input"
                placeholder="Page Title"
                {...register(`longText.${index}.title` as const)}
              />
              <textarea
                className="article-textarea"
                placeholder="Page Content"
                {...register(`longText.${index}.text` as const, { required: "Page content is required" })}
              />
              <button
                type="button"
                className="remove-article-button"
                onClick={() => remove(index)}
              >
                Remove Section
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-article-button"
            onClick={() => append({ title: "", text: "" })}
          >
            Add Section
          </button>
        </section>

        {/* Submit Button */}
        <button type="submit" className="create-article-button">Create Article</button>
      </form>
    </div>
  );
};

export default CreateArticle;
