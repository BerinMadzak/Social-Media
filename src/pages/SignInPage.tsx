import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "../supabase-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const signInSchema = z.object({
    email: z
        .string()
        .refine(async (email) => {
            const { data } = await supabase.from("users").select("id").eq("email", email).single();
            if(data) return true;
            return false;
        }, { message: "Account with specified email does not exist" }),
    password: z
        .string()
});

type SignInType = z.infer<typeof signInSchema>;

const signupUser = async(data: SignInType) => {
    const { email, password } = data;

    const { data: user, error } = await supabase.auth.signInWithPassword({
        email, password
    });

    if(error) throw new Error(error.message);

    return user;
}

export default function SignInPage() {
    const { control, handleSubmit, formState: { errors }} = useForm<SignInType>({resolver: zodResolver(signInSchema)});

    const navigate = useNavigate();

    const { mutate, isError, isSuccess, error } = useMutation({
        mutationFn: signupUser,
        onSuccess: () => navigate("/")
    });
    
    const onSubmit = (data: SignInType) => {
        mutate(data);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-30">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

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

            <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg cursor-pointer"
            >
                {'Sign Up'}
            </button>
            {isError && (
                <p className="text-red-500 text-sm mt-4">{error.message}</p>
            )}
            {isSuccess && (
                <p className="text-green-500 text-sm mt-4">Signed in successfully! Welcome aboard.</p>
            )}
            </form>
        </div>
    );
}