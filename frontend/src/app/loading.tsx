import { LoaderCircle } from "lucide-react";

export default function Loading() {
    return (
        <div className="h-screen flex flex-col items-center justify-center space-y-4">
            <LoaderCircle className="animate-spin size-8" />
            <h1 className="font-semibold text-lg">Loading...</h1>
        </div>
    )
}