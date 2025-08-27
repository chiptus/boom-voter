import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  useFestivalInfoQuery,
  festivalInfoKeys,
  CustomLink,
} from "@/hooks/queries/festival-info/useFestivalInfo";
import { useFestivalQuery } from "@/hooks/queries/festivals/useFestival";
import { Tables } from "@/integrations/supabase/types";

type FestivalInfoForm = {
  mapImageUrl: string;
  infoText: string;
  facebookUrl: string;
  instagramUrl: string;
  customLinks: CustomLink[];
};

export default function FestivalInfo() {
  const { festivalId } = useParams<{ festivalId: string }>();
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const festivalQuery = useFestivalQuery(festivalId);
  const festivalInfoQuery = useFestivalInfoQuery(festivalId);

  const form = useForm<FestivalInfoForm>({
    defaultValues: {
      mapImageUrl: festivalInfoQuery.data?.map_image_url || "",
      infoText: festivalInfoQuery.data?.info_text || "",
      facebookUrl: festivalInfoQuery.data?.facebook_url || "",
      instagramUrl: festivalInfoQuery.data?.instagram_url || "",
      customLinks: (festivalInfoQuery.data?.custom_links as CustomLink[]) || [],
    },
  });

  // Update form when data loads
  useEffect(() => {
    if (festivalInfoQuery.data && !form.formState.isDirty) {
      form.reset({
        mapImageUrl: festivalInfoQuery.data.map_image_url || "",
        infoText: festivalInfoQuery.data.info_text || "",
        facebookUrl: festivalInfoQuery.data.facebook_url || "",
        instagramUrl: festivalInfoQuery.data.instagram_url || "",
        customLinks:
          (festivalInfoQuery.data.custom_links as CustomLink[]) || [],
      });
    }
  }, [festivalInfoQuery.data, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: FestivalInfoForm) => {
      if (!festivalId) throw new Error("Festival ID is required");

      const updateData: Partial<Tables<"festival_info">> = {
        map_image_url: data.mapImageUrl || null,
        info_text: data.infoText || null,
        facebook_url: data.facebookUrl || null,
        instagram_url: data.instagramUrl || null,
        custom_links: data.customLinks,
      };

      if (festivalInfoQuery.data) {
        // Update existing record
        const { error } = await supabase
          .from("festival_info")
          .update(updateData)
          .eq("festival_id", festivalId);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase.from("festival_info").insert({
          festival_id: festivalId,
          ...updateData,
        });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: festivalInfoKeys.byFestival(festivalId || ""),
      });
    },
  });

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !festivalId) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${festivalId}-map.${fileExt}`;

      const { error } = await supabase.storage
        .from("festival-assets")
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("festival-assets")
        .getPublicUrl(fileName);

      form.setValue("mapImageUrl", urlData.publicUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  }

  function addCustomLink() {
    const currentLinks = form.getValues("customLinks");
    form.setValue("customLinks", [...currentLinks, { title: "", url: "" }]);
  }

  function removeCustomLink(index: number) {
    const currentLinks = form.getValues("customLinks");
    form.setValue(
      "customLinks",
      currentLinks.filter((_, i) => i !== index),
    );
  }

  function onSubmit(data: FestivalInfoForm) {
    updateMutation.mutate(data);
  }

  if (festivalQuery.isLoading || festivalInfoQuery.isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading festival info...</span>
        </CardContent>
      </Card>
    );
  }

  if (!festivalQuery.data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <span>Festival not found</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Festival Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Map Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="map-upload">Festival Map</Label>
            <div className="flex items-center gap-4">
              <Input
                id="map-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Upload className="h-4 w-4 text-gray-500" />
            </div>
            {form.watch("mapImageUrl") && (
              <div className="mt-2">
                <img
                  src={form.watch("mapImageUrl")}
                  alt="Festival map preview"
                  className="max-w-xs rounded-lg border"
                />
              </div>
            )}
            <Input
              {...form.register("mapImageUrl")}
              placeholder="Or enter image URL directly"
            />
          </div>

          {/* Info Text */}
          <div className="space-y-2">
            <Label htmlFor="info-text">Festival Information Text</Label>
            <Textarea
              id="info-text"
              {...form.register("infoText")}
              placeholder="Enter festival information (HTML supported)"
              rows={8}
            />
          </div>

          {/* Social Media URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook-url">Facebook Page URL</Label>
              <Input
                id="facebook-url"
                {...form.register("facebookUrl")}
                placeholder="https://facebook.com/yourfestival"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram-url">Instagram Profile URL</Label>
              <Input
                id="instagram-url"
                {...form.register("instagramUrl")}
                placeholder="https://instagram.com/yourfestival"
              />
            </div>
          </div>

          {/* Custom Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Custom Links</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomLink}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>

            {form.watch("customLinks").map((_link, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-4 border rounded-lg"
              >
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <Input
                    {...form.register(`customLinks.${index}.title`)}
                    placeholder="Link title (e.g., Tickets)"
                  />
                  <Input
                    {...form.register(`customLinks.${index}.url`)}
                    placeholder="URL (e.g., https://...)"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeCustomLink(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
