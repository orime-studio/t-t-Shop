import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IMessage } from "../@Types/types";
import { useAlert } from "../contexts/AlertContext";
import { sendMessage } from "../services/message-service";
import patterns from "../validations/patterns";
import "./CreateProduct.scss";

const Contact = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<IMessage>({
        defaultValues: { fullName: "", email: "", message: "" },
        mode: "onChange",
    });


    const onSend = (data: IMessage) => {
        console.log("Send data:", data);
        sendMessage(data)
            .then(() => {
                showAlert("success", "Your message has been sent successfully");
                navigate("/");
            })
            .catch((error) => {
                showAlert("error", error.response.data);
            });
    }


    return (
        <div className="create-card-container dark:bg-slate-600">
            <form noValidate onSubmit={handleSubmit(onSend)}>
                {/* Full Name */}
                <section>
                    <input
                        placeholder="Full Name"
                        type="text"
                        {...register("fullName", {
                            required: "This field is mandatory",
                            minLength: { value: 2, message: "Too short" },
                            maxLength: { value: 255, message: "Too long" },
                        })}
                    />
                    {errors.fullName && (
                        <p className="text-red-500">{errors.fullName?.message}</p>
                    )}
                </section>

                {/* Email */}
                <section>
                    <input
                        placeholder="Email"
                        type="email"
                        {...register("email", {
                            required: "This field is mandatory",
                            pattern: {
                                value: patterns.email,
                                message: "Invalid email",
                            },
                        })}
                    />
                    {errors.email && (
                        <p className="text-red-500">{errors.email?.message}</p>
                    )}
                </section>

                {/* Phone */}
                <section>
                    <input
                        placeholder="Phone"
                        type="tel"
                        {...register("phone", {
                            required: "This field is mandatory",
                            pattern: {
                                value: patterns.phone,
                                message: "Invalid phone number",
                            },
                        })}
                    />
                    {errors.phone && (
                        <p className="text-red-500">{errors.phone?.message}</p>
                    )}
                </section>

                {/* Message */}
                <section>
                    <textarea
                        placeholder="Message"
                        {...register("message", {
                            required: "This field is mandatory",
                            minLength: { value: 5, message: "Too short" },
                            maxLength: { value: 500, message: "Too long" },
                        })}
                    />
                    {errors.message && (
                        <p className="text-red-500">{errors.message?.message}</p>
                    )}
                </section>


                <button type="submit" className="bg-slate-600 text-white dark:bg-slate-900">Send</button>

            </form>
        </div>
    );
};


export default Contact;