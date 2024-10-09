import service from "@/appwrite/config";
import { updatePageSchema, UpdatePageFormData } from "@/types/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const UpdatePageForm = ({
  formData,
  pageId,
}: {
  formData: any;
  pageId: string;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<UpdatePageFormData>({
    resolver: zodResolver(updatePageSchema),
    defaultValues: {
      href: formData[0].href,
      pageHeading: formData[0].pageHeading,
      archive: formData[0].archive,
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: async () => {
      try {
        const res = await service.deletePageItem(pageId);
        if (res) {
          router.replace("/pages");
        }
      } catch (error) {
        console.error("Error deleting page:", error);
        toast.error("Error deleting page!");
      }
    },
    onSuccess: () => {
      toast.success("Page deleted successfully!");
      form.reset(); // Reset the form on success
    },
    onError: () => {
      toast.error("Error deleting page!");
    },
  });

  const createPageUpdateMutation = useMutation({
    mutationFn: async (data: UpdatePageFormData) => {
      try {
        const res = await fetch("/api/pages/update-pageItem", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, pageId: pageId }),
        });
        await queryClient.refetchQueries({ queryKey: ["pageItem", pageId] }); // Refetch the data after successful mutation
      } catch (error) {
        console.error("Error updating page:", error);
        toast.error("Error updating page!");
      }
    },
    onSuccess: () => {
      toast.success("Page updated successfully!");
      form.reset(); // Reset the form on success
    },
    onError: () => {
      toast.error("Error updating page!");
    },
  });
  const onSubmit = async (data: UpdatePageFormData) => {
    try {
      createPageUpdateMutation.mutate(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mt-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex gap-x-5">
            <FormField
              control={form.control}
              name="href"
              render={({ field }) => (
                <FormItem className="w-full space-y-1">
                  <FormLabel>Href</FormLabel>
                  <FormControl>
                    <Input
                      disabled={createPageUpdateMutation.isPending}
                      type="text"
                      placeholder="-"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pageHeading"
              render={({ field }) => (
                <FormItem className="w-full space-y-1">
                  <FormLabel>Page Heading</FormLabel>
                  <FormControl>
                    <Input
                      disabled={createPageUpdateMutation.isPending}
                      type="text"
                      placeholder="-"
                      {...field}
                      value={field.value ?? ""} // Ensure null is replaced with an empty string
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="archive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 w-full md:max-w-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Archive</FormLabel>
                  <FormDescription>Archive this page.</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="mt-5 space-y-5">
            <div className="bg-gray-50 border rounded-xl p-4 flex items-center gap-x-2">
              <Label>NavLink: </Label>
              {typeof formData[0].navLink === "string" ? (
                <p className="text-sm bg-white font-sans p-2">
                  {formData[0].navLink}
                </p>
              ) : (
                <img
                  src={formData[0].navLink[0].previewUrl}
                  alt="NavLink Image"
                  width={100}
                  height={100}
                />
              )}
            </div>

            <div className="bg-gray-50 border rounded-xl p-4 flex items-center gap-x-2">
              <Label>Billboard: </Label>
              {typeof formData[0].billboard === "object" &&
              formData[0].billboard.previewUrl ? (
                <div>
                  <img
                    src={formData[0].billboard.previewUrl}
                    alt="Billboard Image"
                    width={100}
                    height={100}
                    className="w-full object-contain"
                  />
                </div>
              ) : (
                <p className="text-sm bg-white font-sans p-2">None</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-2">
            <Button
              type="button"
              variant={"destructive"}
              className="bg-red-800"
              disabled={deletePageMutation.isPending}
              onClick={() => deletePageMutation.mutate()}
            >
              Delete
              {deletePageMutation.isPending && (
                <LoadingSpinner size={18} className="text-white ml-1" />
              )}
            </Button>
            <Button type="submit" disabled={createPageUpdateMutation.isPending}>
              Update
              {createPageUpdateMutation.isPending && (
                <LoadingSpinner size={18} className="text-white ml-1" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdatePageForm;
