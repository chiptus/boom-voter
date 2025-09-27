import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useUploadArtistImageMutation } from "@/pages/admin/ArtistsManagement/BulkEditor/useUploadArtistImage";
import { Image, Link } from "lucide-react";

// Form validation schema
const imageFormSchema = z.object({
  imageUrl: z.string().url().optional().or(z.literal("")),
});

type ImageFormData = z.infer<typeof imageFormSchema>;

interface ImageEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImageUrl: string | null;
  artistSlug: string;
  artistName: string;
  onSave: (value: string | null) => void;
}

export function ImageEditDialog({
  open,
  onOpenChange,
  currentImageUrl,
  artistSlug,
  artistName,
  onSave,
}: ImageEditDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadImageMutation = useUploadArtistImageMutation();

  // Form setup
  const form = useForm<ImageFormData>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      imageUrl: currentImageUrl || "",
    },
  });

  function onSubmit(data: ImageFormData) {
    const finalValue = data.imageUrl?.trim() || null;

    // If a file is selected, upload it first
    if (selectedFile) {
      uploadImageMutation.mutate(
        { file: selectedFile, artistId: artistSlug },
        {
          onSuccess: (uploadedUrl) => {
            onSave(uploadedUrl);
            handleClose();
          },
        },
      );
      return;
    }

    // Only save if value actually changed
    if (finalValue !== currentImageUrl) {
      onSave(finalValue);
    }

    handleClose();
  }

  function handleClose() {
    onOpenChange(false);
    form.reset({ imageUrl: currentImageUrl || "" });
    setSelectedFile(null);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Edit Artist Image
          </DialogTitle>
          <DialogDescription>
            Upload an image or provide a URL for {artistName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">
                  <Link className="h-4 w-4 mr-2" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Image className="h-4 w-4 mr-2" />
                  Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-2">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="upload" className="space-y-2">
                <FileUpload
                  onFileSelect={setSelectedFile}
                  currentImageUrl={currentImageUrl}
                  accept="image/*"
                  maxSize={5}
                  disabled={uploadImageMutation.isPending}
                />
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={uploadImageMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploadImageMutation.isPending}>
                {uploadImageMutation.isPending ? "Uploading..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
