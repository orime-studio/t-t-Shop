import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import dialogs from "../../ui/dialogs";
import { Parasha } from "../../@Types/chabadType";
import { createNewParasha } from "../../services/parasha-service";

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
            dialogs.error("שגיאה", "אנא הוסף לפחות דף פרשה אחד.");
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
        <div className="create-card-container bg-[#ffffff] text-gray-800 dark:bg-slate-600">
            <h2 className="dark:text-white">יצירת פרשה חדשה</h2>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <section>
                    <input placeholder="מקור" {...register("source", { required: "המקור הוא שדה חובה" })} />
                    {errors.source && <p className="text-red-500">{errors.source.message}</p>}
                </section>
                <section>
                    <input placeholder="כותרת" {...register("title", { required: "הכותרת היא שדה חובה" })} />
                    {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                </section>
                <section>
                    <textarea placeholder="תיאור קצר" {...register("miniText", { required: "תיאור קצר הוא שדה חובה" })} />
                    {errors.miniText && <p className="text-red-500">{errors.miniText.message}</p>}
                </section>

                <section>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setImage(file);
                            setImageName(file ? file.name : "");
                        }}
                    />
                    {imageName && <p className="file-name">{imageName}</p>}
                </section>
                <section>
                    <input placeholder="תיאור התמונה" {...register("alt", { required: "תיאור התמונה הוא שדה חובה" })} />
                    {errors.alt && <p className="text-red-500">{errors.alt.message}</p>}
                </section>

                <section>
                    <h3 className="mb-2">דפי פרשה:</h3>
                    {fields.map((page, index) => (
                        <div key={page.id} className="variant">
                            <input
                                placeholder="כותרת הדף"
                                {...register(`longText.${index}.title` as const)} // הסר את 'required'
                            />
                            <textarea
                                placeholder="תוכן הדף"
                                {...register(`longText.${index}.text` as const, { required: "תוכן הדף הוא שדה חובה" })}
                            />
                            <button type="button" className="removeButton" onClick={() => remove(index)}>הסרת דף</button>
                        </div>
                    ))}
                    <button type="button" className="add-variant-button" onClick={() => append({ title: "", text: "" })}>הוסף דף</button>
                </section>

                <button type="submit" className="submit-button bg-slate-600 text-white dark:bg-slate-900">צור פרשה</button>
            </form>
        </div>
    );
};

export default CreateNewParasha;
