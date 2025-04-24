'use client';
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation"

export function LogoutButton() {
    const router = useRouter()

    const handleLogout = () => {
        Cookies.remove('token')
        router.push('/login')
    }

    return (
        <Button variant="outline" className="text-sm flex gap-1 justify-center items-center" onClick={handleLogout}>
            <LogOut />Logout
        </Button>
    )
}