import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import dialogs from "../../ui/dialogs";
import { Parasha } from "../../@Types/chabadType";
import { createNewParasha } from "../../services/parasha-service";
import './createNewParasha.scss';

const CreateNewParasha = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, control } = useForm<Parasha>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "parashPage"
    });
    const [image, setImage] = useState<File | null>(null);
    const [imageName, setImageName] = useState<string>("");

    const onSubmit = async (data: Parasha) => {
        if (!image) {
            dialogs.error("שגיאה", "אנא בחר תמונה.");
            return;
        }

        if (!data.longText.length) {
            dialogs.error("שגיאה", "אנא הוסף לפחות קטע פרשה אחד.");
            return;
        }

        const formData = new FormData();
        formData.append("source", data.source);
        formData.append("title", data.title);
        formData.append("miniText", data.miniText);
        formData.append("alt", data.alt);

        data.longText.forEach((page, index) => {
            formData.append(`parashPage[${index}][title]`, page.title);
            formData.append(`parashPage[${index}][text]`, page.text);
        });

        if (image) {
            formData.append("image", image);
        }

        try {
            console.log("נתוני הטופס:", Object.fromEntries(formData.entries())); // לוג לפני שליחה
            await createNewParasha(formData);
            dialogs.success("הצלחה", "הפרשה נוצרה בהצלחה")
                .then(() => {
                    navigate("/beitChabad/admin");
                });
        } catch (error: any) {
            console.error("שגיאה בנתוני הטופס:", error);
            dialogs.error("שגיאה", error.response?.data?.message || "לא הצלחנו ליצור את הפרשה");
        }
    };

    return (
        <div className="create-card-container">
            <h2 className="dark:text-white">יצירת פרשה חדשה</h2>
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="form-container">
                <section className="section">
                    <input 
                        className="input" 
                        placeholder="מקור" 
                        {...register("source", { required: "המקור הוא שדה חובה" })} 
                    />
                    {errors.source && <p className="text-red-500">{errors.source.message}</p>}
                </section>
                <section className="section">
                    <input 
                        className="input" 
                        placeholder="כותרת" 
                        {...register("title", { required: "הכותרת היא שדה חובה" })} 
                    />
                    {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                </section>
                <section className="section">
                    <textarea 
                        className="textarea" 
                        placeholder="תיאור קצר" 
                        {...register("miniText", { required: "תיאור קצר הוא שדה חובה" })} 
                    />
                    {errors.miniText && <p className="text-red-500">{errors.miniText.message}</p>}
                </section>

                <section className="section">
                    <label htmlFor="file-input" className="file-label">בחר תמונה</label>
                    <input
                        className="input-file"
                        type="file"
                        accept="image/*"
                        id="file-input"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setImage(file);
                            setImageName(file ? file.name : "");
                        }}
                    />
                    {imageName && <p className="file-name">{imageName}</p>}
                </section>

                <section className="section">
                    <input 
                        className="input" 
                        placeholder="תיאור התמונה" 
                        {...register("alt", { required: "תיאור התמונה הוא שדה חובה" })} 
                    />
                    {errors.alt && <p className="text-red-500">{errors.alt.message}</p>}
                </section>

                <section className="section">
                    <h3 className="mb-2">קטעי פרשה:</h3>
                    {fields.map((page, index) => (
                        <div key={page.id} className="variant">
                            <input
                                className="input" 
                                placeholder="כותרת הקטע" 
                                {...register(`longText.${index}.title` as const)} // הסר את 'required'
                            />
                            <textarea
                                className="textarea" 
                                placeholder="תוכן הקטע" 
                                {...register(`longText.${index}.text` as const, { required: "תוכן הקטע הוא שדה חובה" })}
                            />
                            <button 
                                type="button" 
                                className="remove-button" 
                                onClick={() => remove(index)}
                            >
                                הסרת קטע
                            </button>
                        </div>
                    ))}
                    <button 
                        type="button" 
                        className="add-variant-button" 
                        onClick={() => append({ title: "", text: "" })}
                    >
                        הוסף קטע
                    </button>
                </section>

                <button type="submit" className="button">צור פרשה</button>
            </form>
        </div>
    );
};

export default CreateNewParasha;
