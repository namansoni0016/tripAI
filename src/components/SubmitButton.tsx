import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface SubmitButtonProps {
    text: string;
    isLoading?: boolean;
}

export function SubmitButton({ text, isLoading }: SubmitButtonProps) {
    return (
        <>
            <Button type="submit" className="w-full font-bold text-md bg-slate-700 text-white" size="lg" disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                ) : (
                    text
                )}
            </Button>
        </>
    )
}