"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BillboardFormData, billboardSchema } from "@/types/zod";
import { useUploadFile } from "@/hooks/useUploadFile";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { FileUploader } from "@/components/FileUploader";
import BillboardCard from "./components/billboard-card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function BillboardsPage() {
  const queryClient = useQueryClient()

  const form = useForm<BillboardFormData>({
    resolver: zodResolver(billboardSchema),
    defaultValues: {
      title: "",
      image: [],
    },
  });
  const { uploadFiles, progresses } =
    useUploadFile();

  const billboardItems = useQuery({
    queryKey: ["billboards"],
    queryFn: async () => {
      const res = await service.getAllBillboards()
      if (res) {
        const billboards = res.map((product) => ({
          ...product,
          image:
            typeof product.image === "string" ? JSON.parse(product.image) : {},
        }));
        return billboards;
      }
    },
  });

  const createBillboardMutation = useMutation({
    mutationFn: async (data: BillboardFormData) => {
      try {
        const uploadedImage = await uploadFiles(data.image);
        console.log(uploadedImage);

        if (uploadedImage) {
          const newBillboardData: NewBillboardProps = {
            title: data.title,
            image: JSON.stringify(uploadedImage[0]),
          };
          await service.addNewBillboard(newBillboardData);
          await queryClient.refetchQueries({ queryKey: ['billboards']})
        }
      } catch (error) {
        console.log(error)
        toast.error("Error adding billboard!");
      }
    },
    onSuccess: () => {
      toast.success("Billboard added successfully!");
      form.reset();
    },
    onError: () => {
      toast.error("Error adding billboard!");
    },
  });

  const onSubmit = (data: BillboardFormData) => {
    console.log(data);
    createBillboardMutation.mutate(data);
  };

  return (
    <ContentLayout title="Billboards">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Billboards</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="py-5">
        <Card className="p-6">
          <div className="w-full flex items-center justify-between">
            <div>
              <Heading
                title="Billboards"
                description="Manage your billboard images here."
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
                    Upload a new billboard
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
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                disabled={createBillboardMutation.isPending}
                                type="text"
                                placeholder="Enter billboard title"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <div className="space-y-6">
                            <FormItem className="w-full h-full">
                              <FormControl>
                                <FileUploader
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  maxFiles={1}
                                  maxSize={4 * 1024 * 1024}
                                  progresses={progresses}
                                  disabled={createBillboardMutation.isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          </div>
                        )}
                      />

                      <Button type="submit" disabled={createBillboardMutation.isPending}>Submit
                        {
                          createBillboardMutation.isPending && <LoadingSpinner size={18} className="text-white ml-1"/>
                        }
                      </Button>
                      
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="my-4" />

          <div className="mt-10 flex flex-wrap items-center gap-5">
            {billboardItems.data &&
              billboardItems.data.map((item: any, index: number) => {
                return <BillboardCard billboardItem={item.billboardItem} />;
              })}
              {
                billboardItems.isLoading && (
                  <div className="flex gap-2">
                    <Skeleton className="size-[200px]" />
                    <Skeleton className="size-[200px]" />
                  </div>
                )
              }
          </div>
        </Card>
      </div>
    </ContentLayout>
  );
}
