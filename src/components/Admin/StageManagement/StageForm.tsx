import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface StageFormData {
  name: string;
  stage_order: number;
  color: string;
}

interface StageFormProps {
  initialData?: Partial<StageFormData>;
  onSubmit: (data: StageFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export function StageForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
}: StageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StageFormData>({
    defaultValues: {
      name: initialData?.name || "",
      stage_order: initialData?.stage_order || 0,
      color: initialData?.color || "#6b7280",
    },
  });

  const colorValue = watch("color");

  async function handleFormSubmit(data: StageFormData) {
    if (!data.name.trim()) {
      toast({
        title: "Error",
        description: "Stage name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Stage Name</Label>
        <Input
          id="name"
          {...register("name", { required: "Stage name is required" })}
          placeholder="e.g., Dance Temple, Sacred Ground"
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="stage_order">Order</Label>
        <Input
          id="stage_order"
          type="number"
          min="0"
          {...register("stage_order", {
            valueAsNumber: true,
            min: { value: 0, message: "Order must be 0 or greater" },
          })}
          placeholder="0"
        />
        {errors.stage_order && (
          <p className="text-sm text-destructive mt-1">
            {errors.stage_order.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="color">Stage Color</Label>
        <div className="flex items-center gap-2">
          <input
            id="color"
            type="color"
            value={colorValue}
            onChange={(e) => setValue("color", e.target.value)}
            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
          />
          <Input
            {...register("color", {
              pattern: {
                value: /^#[0-9A-Fa-f]{6}$/,
                message: "Color must be a valid hex code (e.g., #6b7280)",
              },
            })}
            placeholder="#6b7280"
            className="flex-1"
          />
        </div>
        {errors.color && (
          <p className="text-sm text-destructive mt-1">
            {errors.color.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
