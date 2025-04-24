import { LoginForm } from "@/components/login/form";

export default function Login() {
    return (
        <div className="h-screen flex flex-col items-center justify-center space-y-4">
            <h1 className="font-semibold text-2xl mb-10">Login</h1>
            <LoginForm />
        </div>
    )
}