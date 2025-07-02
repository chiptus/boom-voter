import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  groupName: string;
  isDeleting: boolean;
}

export const DeleteGroupDialog = ({
  isOpen,
  onClose,
  onConfirm,
  groupName,
  isDeleting,
}: DeleteGroupDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-background border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">Delete Group</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to delete "{groupName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose}
            disabled={isDeleting}
            className="bg-background text-foreground border-border hover:bg-muted"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};