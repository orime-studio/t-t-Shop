import { useForm } from "react-hook-form";
import { IUser } from "../@Types/types";
import { BsEye, BsEyeSlashFill } from "react-icons/bs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import dialogs from "../ui/dialogs";
import patterns from "../validations/patterns";
import './Login.scss';

const Register = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IUser>();

    const { register: registerUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const onRegister = (data: IUser) => {
        console.log(data);
        registerUser(data).then(() => {
            dialogs.success("Welcome!", "Registration was successful").then(() => {
                navigate("/login");
            });
        })
            .catch((e) => {
                dialogs.error("Something went wrong", e.response.data.message);
            });
    };

    return (
        <div className="create-card-container">
            <h2 className="text-slate-600">Register</h2>
            <form noValidate onSubmit={handleSubmit(onRegister)}>
                {/* firstName */}
                <section>
                    <input
                        placeholder="First Name"
                        type="text"
                        className={errors.name?.first ? 'input-error' : ''}
                        {...register("name.first", {
                            required: "Please provide your first name",
                            minLength: { value: 2, message: "First name is too short" },
                            maxLength: { value: 255, message: "First name is too long" },
                        })}
                    />
                    {errors.name?.first && (
                        <p className="text-red-500">{errors.name?.first?.message}</p>
                    )}
                </section>

                {/* middle */}
                <section>
                    <input
                        placeholder="Middle Name"
                        type="text"
                        className={errors.name?.middle ? 'input-error' : ''}
                        {...register("name.middle", {
                            minLength: { value: 2, message: "Middle name is too short" },
                            maxLength: { value: 255, message: "Middle name is too long" },
                        })}
                    />
                    {errors.name?.middle && (
                        <p className="text-red-500">{errors.name?.middle?.message}</p>
                    )}
                </section>

                {/* last */}
                <section>
                    <input
                        placeholder="Last Name"
                        type="text"
                        className={errors.name?.last ? 'input-error' : ''}
                        {...register("name.last", {
                            required: "Please provide your last name",
                            minLength: { value: 2, message: "Last name is too short" },
                            maxLength: { value: 255, message: "Last name is too long" },
                        })}
                    />
                    {errors.name?.last && (
                        <p className="text-red-500">{errors.name?.last?.message}</p>
                    )}
                </section>

                {/* phone */}
                <section>
                    <input
                        placeholder="Phone Number"
                        type="tel"
                        className={errors.phone ? 'input-error' : ''}
                        {...register("phone", {
                            required: "Please provide your phone number",
                            minLength: { value: 9, message: "Phone number is too short" },
                            maxLength: { value: 14, message: "Phone number is too long" },
                        })}
                    />
                    {errors.phone && (
                        <p className="text-red-500">{errors.phone?.message}</p>
                    )}
                </section>

                {/* email */}
                <section>
                    <input
                        placeholder="Email"
                        type="email"
                        className={errors.email ? 'input-error' : ''}
                        {...register("email", {
                            required: "Please provide your email address",
                            pattern: {
                                value: patterns.email,
                                message: "Please enter a valid email address",
                            },
                        })}
                    />
                    {errors.email && (
                        <p className="text-red-500">{errors.email?.message}</p>
                    )}
                </section>

                {/* password */}
                <section>
                    <div className="password-container">
                        <input
                            placeholder="Password"
                            type={showPassword ? `text` : `password`}
                            className={errors.password ? 'input-error' : ''}
                            {...register("password", {
                                required: "Please provide a password",
                                pattern: {
                                    value: patterns.password,
                                    message:
                                        "Password must be at least 9 characters long and include an uppercase letter, lowercase letter, number, and one of the following special characters: !@#$%^&*-",
                                },
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                        >
                            {showPassword ? <BsEyeSlashFill /> : <BsEye />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500">{errors.password?.message}</p>
                    )}
                </section>

                {/* address.country */}
                <section>
                    <input
                        placeholder="Country"
                        type="text"
                        className={errors.address?.country ? 'input-error' : ''}
                        {...register("address.country", {
                            required: "Please provide your country",
                            minLength: { value: 2, message: "Country name is too short" },
                            maxLength: { value: 255, message: "Country name is too long" },
                        })}
                    />
                    {errors.address?.country && (
                        <p className="text-red-500">{errors.address?.country?.message}</p>
                    )}
                </section>

                {/* address.city */}
                <section>
                    <input
                        placeholder="City"
                        type="text"
                        className={errors.address?.city ? 'input-error' : ''}
                        {...register("address.city", {
                            required: "Please provide your city",
                            minLength: { value: 2, message: "City name is too short" },
                            maxLength: { value: 255, message: "City name is too long" },
                        })}
                    />
                    {errors.address?.city && (
                        <p className="text-red-500">{errors.address?.city?.message}</p>
                    )}
                </section>

                {/* address.street */}
                <section>
                    <input
                        placeholder="Street"
                        type="text"
                        className={errors.address?.street ? 'input-error' : ''}
                        {...register("address.street", {
                            required: "Please provide your street name",
                            minLength: { value: 2, message: "Street name is too short" },
                            maxLength: { value: 255, message: "Street name is too long" },
                        })}
                    />
                    {errors.address?.street && (
                        <p className="text-red-500">{errors.address?.street?.message}</p>
                    )}
                </section>

                {/* address.houseNumber */}
                <section>
                    <input
                        placeholder="House Number"
                        type="number"
                        className={errors.address?.houseNumber ? 'input-error' : ''}
                        {...register("address.houseNumber", {
                            required: "Please provide your house number",
                            min: { value: 1, message: "House number must be at least 1" },
                            max: { value: 9999, message: "House number is too large" },
                        })}
                    />
                    {errors.address?.houseNumber && (
                        <p className="text-red-500">{errors.address?.houseNumber?.message}</p>
                    )}
                </section>

                {/* address.zip */}
                <section>
                    <input
                        placeholder="Zip Code"
                        type="text"
                        className={errors.address?.zip ? 'input-error' : ''}
                        {...register("address.zip", {
                            required: "Please provide your zip code",
                            minLength: { value: 5, message: "Zip code is too short" },
                            maxLength: { value: 10, message: "Zip code is too long" },
                        })}
                    />
                    {errors.address?.zip && (
                        <p className="text-red-500">{errors.address?.zip?.message}</p>
                    )}
                </section>

                <button type="submit" className=" bg-slate-600 text-white dark:bg-slate-900">Sign Up</button>
            </form>
        </div>
    );
};

export default Register;
