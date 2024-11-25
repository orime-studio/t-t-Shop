import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import './EditParasha.scss';    

import { getParashaById, updateParasha } from "../../services/parasha-service";
import dialogs from "../../ui/dialogs";
import { ParashaInput, Parasha } from "../../@Types/chabadType";

const EditParasha = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    register, 
    handleSubmit, 
    setValue, 
    control, 
    formState: { errors } 
  } = useForm<ParashaInput>();
  
  const { fields: pages, append: appendPage, remove: removePage } = useFieldArray({
    control,
    name: "parashPage"
  });

  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getParashaById(id)
        .then(res => {
          const parasha: Parasha = res.data;
          setValue("author", parasha.author);
          setValue("title", parasha.title);
          setValue("miniText", parasha.miniText);
          setValue("alt", parasha.alt);
          setValue("image", parasha.image);
          setValue("parashPage", parasha.parashPage || []);
        })
        .catch(err => setError(err));
    }
  }, [id, setValue]);

  const onSubmit = async (data: ParashaInput) => {
    try {
      if (id) {
        await updateParasha(id, data);
        dialogs.success("Success", "Parasha updated successfully").then(() => {
          navigate("/parasha");
        });
      }
    } catch (error: any) {
      dialogs.error("Error", error.response?.data?.message || "Failed to update Parasha");
    }
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="edit-parasha-container">
      <h2>Edit Parasha</h2>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* Author */}
        <section className="form-section">
          <input 
            placeholder="Author" 
            {...register("author", { required: "Author is required" })} 
          />
          {errors.author && <p className="error-text">{errors.author.message}</p>}
        </section>

        {/* Title */}
        <section className="form-section">
          <input 
            placeholder="Title" 
            {...register("title", { required: "Title is required" })} 
          />
          {errors.title && <p className="error-text">{errors.title.message}</p>}
        </section>

        {/* Mini Text */}
        <section className="form-section">
          <textarea 
            placeholder="Mini Text" 
            {...register("miniText", { required: "Mini Text is required" })} 
          />
          {errors.miniText && <p className="error-text">{errors.miniText.message}</p>}
        </section>

        {/* Image */}
        <section className="form-section">
          <input 
            placeholder="Image URL" 
            {...register("image.url", { required: "Image URL is required" })} 
          />
          {errors.image?.url && <p className="error-text">{errors.image?.url?.message}</p>}

          <input 
            placeholder="Image Alt" 
            {...register("alt", { required: "Image Alt is required" })} 
          />
          {errors.alt && <p className="error-text">{errors.alt.message}</p>}
        </section>

        {/* Parasha Pages */}
        <section className="form-section">
          <h3 className="mb-2">Parasha Pages:</h3>
          {pages.map((page, index) => (
            <div key={page.id} className="page">
              <input
                placeholder="Page Title"
                {...register(`parashPage.${index}.title` as const, { required: "Page title is required" })}
              />
              {errors.parashPage?.[index]?.title && (
                <p className="error-text">{errors.parashPage[index].title?.message}</p>
              )}
              <textarea
                placeholder="Page Text"
                {...register(`parashPage.${index}.text` as const, { required: "Page text is required" })}
              />
              {errors.parashPage?.[index]?.text && (
                <p className="error-text">{errors.parashPage[index].text?.message}</p>
              )}
              <button 
                type="button" 
                className="remove-button" 
                onClick={() => removePage(index)}
              >
                Remove Page
              </button>
            </div>
          ))}
          <button 
            type="button" 
            className="add-page-button" 
            onClick={() => appendPage({ title: "", text: "" })}
          >
            Add Page
          </button>
        </section>

        <button type="submit" className="submit-button">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditParasha;
