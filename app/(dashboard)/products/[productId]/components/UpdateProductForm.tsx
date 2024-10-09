"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import service from "@/appwrite/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProductFormData, updateProductSchema } from "@/types/zod";
import toast from "react-hot-toast";

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
import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const UpdateProductForm = ({ productDetails }: { productDetails: any }) => {
  const queryClient = useQueryClient()
  const images = productDetails.imgurl;

  const form = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      product_name: productDetails?.name || "",
      product_desc: productDetails?.desc || "",
      product_color: productDetails?.color || "",
      product_length: productDetails?.length || 0,
      product_breadth: productDetails?.width || 0,
      product_height: productDetails?.height || 0,
      product_price: productDetails?.price || 0,
      sku: productDetails.sku || "",
      archived: productDetails.archived,
      featured: productDetails.featured,
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: UpdateProductFormData) => {
      const res = await service.updateProduct({
        productId: productDetails.$id,
        updatedData: data,
      });
      if(res){
        await queryClient.refetchQueries({ queryKey: ["productDetails", productDetails.$id]})
      }
    },
    onSuccess: () => {
      toast.success("Product updated successfully!");
    },
    onError: () => {
      toast.error("Error updating product");
    },
  });

  const onSubmit = (data: UpdateProductFormData) => {
    updateProductMutation.mutate(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:flex-row justify-between items-start my-10 gap-5">
            <div className="w-full h-full flex flex-col justify-between items-center gap-5">
              <div className="w-full h-full">
                <h4 className="text-xl">Description</h4>
                <div className="border-2 rounded-lg mt-2 p-5 space-y-2">
                  <FormField
                    control={form.control}
                    name="product_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled={updateProductMutation.isPending}
                            type="text"
                            placeholder="Enter product name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="product_desc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            disabled={updateProductMutation.isPending}
                            type="text"
                            placeholder="Enter product description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-3">
                    <FormField
                      control={form.control}
                      name="product_color"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <Input
                              disabled={updateProductMutation.isPending}
                              type="text"
                              placeholder="Enter the HEX code"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-between gap-3 items-center pt-2">
                    <div className="flex justify-center items-center border border-input p-[2px] rounded-xl shadow-sm">
                      <FormField
                        control={form.control}
                        name="product_length"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                disabled={updateProductMutation.isPending}
                                type="number"
                                placeholder="Length"
                                className="border-none rounded-lg shadow-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <p className="p-2 text-xs text-black/40">in</p>
                    </div>
                    <div className="flex justify-center items-center border border-input p-[2px] rounded-xl shadow-sm">
                      <FormField
                        control={form.control}
                        name="product_breadth"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                disabled={updateProductMutation.isPending}
                                type="number"
                                placeholder="Breadth"
                                className="border-none rounded-lg shadow-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <p className="p-2 text-xs text-black/40">in</p>
                    </div>
                    <div className="flex justify-center items-center border border-input p-[2px] rounded-xl shadow-sm">
                      <FormField
                        control={form.control}
                        name="product_height"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                disabled={updateProductMutation.isPending}
                                type="number"
                                placeholder="Height"
                                className="border-none rounded-lg shadow-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <p className="p-2 text-xs text-black/40">in</p>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input
                            disabled={updateProductMutation.isPending}
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="w-full h-full">
                <h4 className="text-xl">Pricing</h4>
                <div className="border-2 rounded-lg mt-2 p-5">
                  <FormField
                    control={form.control}
                    name="product_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className="flex justify-center items-center border border-input p-[2px] rounded-xl shadow-sm">
                            <div className="p-3 bg-gray-100 rounded-l-lg">
                              <IndianRupee size={15} />
                            </div>
                            <Input
                              disabled={updateProductMutation.isPending}
                              type="number"
                              id="product_price"
                              placeholder="10000"
                              className="border-none shadow-none"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between border-2 rounded-lg p-5 w-full ">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-bold">Featured</FormLabel>
                      <FormDescription>Feature this product on the landing page.</FormDescription>
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
              <FormField
                control={form.control}
                name="archived"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between border-2 border-red-800/50 rounded-lg p-5 w-full text-red-800">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-red-800 font-bold">Archive</FormLabel>
                      <FormDescription className="text-red-800">Archive this product.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-red-800"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full h-full flex flex-col">
              <div className="w-full h-full">
                <h4 className="text-xl">Product Images</h4>
                <div className="border-2 rounded-lg mt-2 p-2 space-y-2">
                  {images &&
                    Object.keys(images).map((key) => {
                      const image = images[key];
                      return (
                        <img
                          key={key}
                          src={image.previewUrl}
                          alt={productDetails.name}
                          className="rounded-md"
                        />
                      );
                    })}
                </div>
              </div>
              <Button
                disabled={updateProductMutation.isPending}
                type="submit"
                className="mt-10 px-10 py-8 bg-stone-800"
              >
                Update
                {updateProductMutation.isPending && (
                  <LoadingSpinner size={18} className="text-white ml-1" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default UpdateProductForm;
