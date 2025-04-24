import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RegisterForm } from "../form";

export function DialogCreateUser() {
    return (
        <DialogContent className="flex flex-col justify-center items-center">
            <DialogHeader className="mb-2">
                <DialogTitle>Create user</DialogTitle>
            </DialogHeader>
            <RegisterForm />
        </DialogContent>
    )
}   