import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "../supabase-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const signupSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "username must be less than 20 characters" })
        .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores "})
        .refine(async (username) => {
            const { data } = await supabase.from("users").select("id").eq("username", username).single();
            if(data) return false;
            return true;
        }, { message: "Username is taken" }),
    email: z
        .string()
        .email(({ message: "Email is not valid" }))
        .refine(async (email) => {
            const { data } = await supabase.from("users").select("id").eq("email", email).single();
            if(data) return false;
            return true;
        }, { message: "Email is taken" }),
    dob: z
        .string()
        .refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        }, { message: "Date of birth is invalid" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(20, { message: "Password must be less than 20 characters" }),
    confirmPassword: z
        .string()
}).refine((data) => data.password === data.confirmPassword, { message: "Passwords do not match", path: ['confirmPassword'] });

type SignupType = z.infer<typeof signupSchema>;

const signupUser = async(data: SignupType) => {
    const { username, email, password, dob } = data;

    const { data: user, error } = await supabase.auth.signUp({
        email, password
    });

    if(error) throw new Error(error.message);

    const {data: userData, error: insertError} = await supabase.from("users")
        .insert({id: user.user?.id, username, email, date_of_birth: dob});

    if(insertError) throw new Error(insertError.message);

    return userData;
}

export default function SignUpPage() {
    const { control, handleSubmit, formState: { errors }} = useForm<SignupType>({resolver: zodResolver(signupSchema)});

    const navigate = useNavigate();

    const { mutate, isError, isSuccess } = useMutation({
        mutationFn: signupUser,
        onSuccess: () => navigate("/")
    });

    const onSubmit = (data: SignupType) => {
        mutate(data);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username Field */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <Controller
            name="username"
            control={control}
            render={({ field }) => (
                <input
                {...field}
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
                />
            )}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        {/* Email Field */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Controller
            name="email"
            control={control}
            render={({ field }) => (
                <input
                {...field}
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                />
            )}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Date of Birth Field */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <Controller
            name="dob"
            control={control}
            render={({ field }) => (
                <input
                {...field}
                type="date"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}
            />
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
        </div>

        {/* Password Field */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Controller
            name="password"
            control={control}
            render={({ field }) => (
                <input
                {...field}
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                />
            )}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {/* Confirm Password Field */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
                <input
                {...field}
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                />
            )}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>

        {/* Submit Button */}
        <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg"
        >
            {'Sign Up'}
        </button>
        {isError && (
            <p className="text-red-500 text-sm mt-4">An error occurred during signup. Please try again.</p>
        )}
        {isSuccess && (
            <p className="text-green-500 text-sm mt-4">Signup successful! Welcome aboard.</p>
        )}
        </form>
    </div>
    );
}