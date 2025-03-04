import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Trash2Icon } from "lucide-react";

interface DeleteDialogProps {
    isDeleting: boolean;
    onDelete: () => Promise<void>;
    title?: string,
    description?: string,
}

export function DeleteDialog({ isDeleting, onDelete, title = "Delete Saved Trip", description = "This action cannot be undone." }: DeleteDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-transparent hover:text-red-500 mt-2 mr-2">
                    {isDeleting ? (
                        <Loader2Icon className="size-4 animate-spin" />
                    ) : (
                        <Trash2Icon className="size-4" />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground font-semibold">{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-2xl font-bold">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-red-500 hover:bg-red-600 rounded-2xl font-bold" disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};