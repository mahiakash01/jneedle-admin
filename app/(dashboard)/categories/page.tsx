"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { CategoryFormData, productCategorySchema } from "@/types/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import service from "@/appwrite/config";
import toast from "react-hot-toast";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import Heading from "@/components/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Separator } from "@/components/ui/separator";
import { Category, columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "./data-table";

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(productCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const { data, isLoading, isError, error } = useQuery<Category[]>({
    queryKey: ["productCategories"],
    queryFn: async (): Promise<Category[]> => {
      const res = await service.getAllProductCategories();
      console.log(res);
      const categories = res.map((item: any) => ({
        $id: item.$id,
        name: item.name,
        created_at: new Date(item.created_at).toISOString().split("T")[0],
      }));

      return categories;
    },
  });

  const createNewProductCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      try {
        await service.addNewProductCategory(data.name);
        await queryClient.refetchQueries({ queryKey: ["productCategories"] });
      } catch (error) {
        toast.error("Error adding category!");
      }
    },
    onSuccess: () => {
      toast.success("Category added successfully!");
      form.reset();
    },
    onError: () => {
      toast.error("Error adding category!");
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    console.log(data);
    createNewProductCategoryMutation.mutate(data);
  };
  return (
    <ContentLayout title="Categories">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Categories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="py-5">
        <Card className="p-6">
          <div className="w-full flex items-center justify-between">
            <div className="w-[60%]">
              <Heading
                title="Categories"
                description="Manage your product categories"
              />
            </div>
            <Dialog>
              <DialogTrigger className="bg-primary rounded-lg flex items-center justify-center text-white px-4 py-3">
                <Plus size={16} className="mr-2" />{" "}
                <p className="text-sm">Add New</p>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Upload a new product category
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-2">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                disabled={
                                  createNewProductCategoryMutation.isPending
                                }
                                type="text"
                                placeholder="Enter category name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={createNewProductCategoryMutation.isPending}
                      >
                        Submit
                        {createNewProductCategoryMutation.isPending && (
                          <LoadingSpinner
                            size={18}
                            className="text-white ml-1"
                          />
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="my-4" />

          <div className="mt-6 w-full flex flex-wrap items-center gap-5">
            <div className="w-full">
              {data && data.length == 0 && <p className="text-center">No results</p>}
              {data && (
                <div className="w-full md:max-w-[50%]">
                  <DataTable columns={columns} data={data} />
                </div>
              )}

              {isLoading && (
                <div className="space-y-2">
                  <Skeleton className="lg:w-[100%] h-10" />
                  <Skeleton className="lg:w-[100%] h-10" />
                  <Skeleton className="lg:w-[100%] h-10" />
                  <Skeleton className="lg:w-[100%] h-10" />
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </ContentLayout>
  );
}
