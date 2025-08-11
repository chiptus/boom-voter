import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users } from "lucide-react";

interface CreateGroupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGroup: (name: string, description?: string) => Promise<boolean>;
  isCreating?: boolean;
}

interface FormData {
  name: string;
  description: string;
}

export function CreateGroupDialog({
  isOpen,
  onOpenChange,
  onCreateGroup,
  isCreating = false,
}: CreateGroupDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    const success = await onCreateGroup(
      data.name.trim(),
      data.description.trim() || undefined,
    );

    if (success) {
      reset(); // Clear the form
      onOpenChange(false); // Close the dialog
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      reset(); // Clear form when closing
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Create New Group</span>
          </DialogTitle>
          <DialogDescription>
            Create a group to share and compare votes with friends
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              placeholder="e.g., Festival Squad, Close Friends, Work Colleagues"
              {...register("name", {
                required: "Group name is required",
                minLength: {
                  value: 1,
                  message: "Group name cannot be empty",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What's this group for?"
              rows={3}
              {...register("description")}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting || isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isCreating}>
              {isSubmitting || isCreating ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
