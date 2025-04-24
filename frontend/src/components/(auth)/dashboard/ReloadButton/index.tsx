'use client'
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function ReloadButton() {
    return (
        <div className="absolute top-4 right-4">
            <Button
                className="font-bold rounded-full"
                title="Reload"
                size={"icon"}
                variant="ghost"
                onClick={() => window.location.reload()}
            >
                <RotateCcw />
            </Button>
        </div>
    );
}