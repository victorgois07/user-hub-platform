import { ListUsers } from "@/components/(auth)/dashboard/listUsers";
import { LogoutButton } from "@/components/(auth)/dashboard/LogoutButton";

export default function Dashboard() {
    return (
        <div className="h-screen flex flex-col items-center justify-center space-y-4 relative">
            <h1 className="font-semibold text-2xl mb-10">Dashboard</h1>
            <ListUsers />
            <div className="absolute top-4 right-4">
                <LogoutButton />
            </div>
        </div>
    )
}