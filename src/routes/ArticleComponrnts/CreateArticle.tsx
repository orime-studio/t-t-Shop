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
  const [mainImageAlt, setMainImageAlt] = useState<string>(""); // alt for main image
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalImagesAlts, setAdditionalImagesAlts] = useState<string[]>([]); // alt for additional images

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

    // Adding long text sections
    data.longText.forEach((page, index) => {
      formData.append(`longText[${index}][title]`, page.title || "");
      formData.append(`longText[${index}][text]`, page.text);
    });

    // Adding main image with alt text
    formData.append("image", mainImage);  // Single main image
    formData.append("mainImageAlt", mainImageAlt);  // Alt text for main image

    // Adding additional images with their alt texts
    additionalImages.forEach((image, index) => {
      formData.append("images", image);  // Multiple additional images
    });

    // Log the formData before sending
    console.log("Form Data being sent:", formData);

    try {
      await createNewArticle(formData);
      dialogs.success("Success", "Article created successfully").then(() => {
        navigate("/articles");
      });
    } catch (error: any) {
      console.error("Error submitting form data:", error);
      console.log("Error details:", error.response?.data);  // Log the error response for debugging
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
          <input
            className="article-input"
            placeholder="Main Image Alt Text"
            value={mainImageAlt}
            onChange={(e) => setMainImageAlt(e.target.value)}
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
              setAdditionalImagesAlts(new Array(files.length).fill("")); // reset alts for new files
            }}
          />
          <div className="additional-images-preview">
            {additionalImages.map((image, index) => (
              <div key={index} className="additional-image">
                <img src={URL.createObjectURL(image)} alt={`Additional ${index}`} className="additional-image-preview" />
                <input
                  className="article-input"
                  placeholder={`Alt Text for Image ${index + 1}`}
                  value={additionalImagesAlts[index]}
                  onChange={(e) => {
                    const newAlts = [...additionalImagesAlts];
                    newAlts[index] = e.target.value;
                    setAdditionalImagesAlts(newAlts);
                  }}
                />
                <button
                  type="button"
                  className="remove-article-button"
                  onClick={() => {
                    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
                    setAdditionalImagesAlts(additionalImagesAlts.filter((_, i) => i !== index));
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
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
