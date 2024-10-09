"use client";

import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageFormData, pageSchema } from "@/types/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Heading from "@/components/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { FileUploader } from "@/components/FileUploader";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import DataTable from "./data-table";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

export default function BillboardsPage() {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [selectedHeaderOption, setSelectedHeaderOption] = useState<"heading" | "billboard">("heading")
  const [selectedNavlinkOption, setSelectedNavlinkOption] = useState<"text" | "image">("text");

  const form = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      href: "",
      navLink: "",
      billboard: "None",
      pageHeading: "",
      headerOption: "heading",
      navlinkOption: "text",
    },
  });
  const { uploadFiles, progresses, uploadedFiles, isUploading } =
    useUploadFile();

  const billboardItems = useQuery({
    queryKey: ["billboards"],
    queryFn: async () => {
      const res = await service.getAllBillboards();
      if (res) {
        const billboards = res.map((item) => ({
          ...item,
          billboard: 
            typeof item.billboard === "string" ? JSON.parse(item.billboard):{},
          image:
            typeof item.image === "string" ? JSON.parse(item.image) : {},
        }));
        return billboards;
      }
    },
  });

  const pageItems = useQuery({
    queryKey: ["pageItems"],
    queryFn: async () => {
      const res = await service.getAllPages();
      if (res) {
        const pageItems = res.map((item) => ({
          ...item,
          billboard: item.billboard && item.billboard.image && typeof item.billboard.image === "string"
          ? JSON.parse(item.billboard.image)
          : {},        
          navLink:
            typeof item.navLink === "string" && item.navLink.startsWith("[{")
              ? JSON.parse(item.navLink)
              : item.navLink,
        }));
        console.log("PageItems: ", pageItems)
        return pageItems;
      }
    },
  });

  const createPageMutation = useMutation({
    mutationFn: async (data: PageFormData) => {
      let billboardId = null;
      let image = null;
      try {
        console.log(data)
        if(data.navlinkOption === "image" && data.image){
        setIsFileUploading(true);
        const uploadedImage = await uploadFiles(data.image);
        image = uploadedImage;
        console.log(uploadedImage);
        }
        if (data.headerOption === "billboard" && data.billboard !== "None") {
          const billboard = await service.getBillboardId(data.billboard);
          console.log(billboard);
          billboardId = billboard;
        }
        const newPageData: NewPageProps = {
          href: data.href,
          navLink: data.navlinkOption === "text" ? (data.navLink ?? "") : JSON.stringify(image),
          pageHeading: data.headerOption === "heading" ? data.pageHeading : null,
          billboard: data.headerOption === "billboard" ? billboardId : null,
        };

        console.log(">>>", newPageData);

        await service.addNewPage(newPageData); // Add new navlink
        // await queryClient.refetchQueries({ queryKey: ["navlinks"] }); // Refetch the data after successful mutation
      } catch (error) {
        console.error("Error adding navlink:", error);
        toast.error("Error adding navlink!");
      }
    },
    onSuccess: () => {
      toast.success("Navlink added successfully!");
      form.reset(); // Reset the form on success
    },
    onError: () => {
      toast.error("Error adding navlink!");
    },
  });

  const onSubmit = (data: PageFormData) => {
    console.log(data);
    createPageMutation.mutate(data);
  };

  return (
    <ContentLayout title="Pages">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pages</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="py-5">
        <Card className="p-6">
          <div className="w-full flex items-center justify-between">
            <div>
              <Heading
                title="Pages"
                description="Manage your navbar and pages"
              />
            </div>
            <Dialog>
              <DialogTrigger className="bg-primary rounded-lg flex items-center justify-center text-white px-4 py-3">
                <Plus size={16} className="mr-2" />{" "}
                <p className="text-sm">Add New</p>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl">Add a new Page</DialogTitle>
                </DialogHeader>
                <div className="mt-2">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      <div>
                        <FormField
                        control={form.control}
                        name="href"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Href</FormLabel>
                            <FormControl>
                              <Input
                                disabled={createPageMutation.isPending}
                                type="text"
                                placeholder="/example"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      </div>
                      <div className="bg-gray-50 border rounded-xl px-4 py-2">
                        <p className="text-lg font-semibold mb-1">
                          Navbar Link
                        </p>
                        <Separator/>
                        <div className="my-3">
                          <FormField
                            control={form.control}
                            name="navlinkOption"
                            render={({ field }) => (
                              <FormItem className="flex gap-x-5 items-center space-y-0">
                                <div className="flex items-center">
                                  <Checkbox
                                    id="text"
                                    checked={selectedNavlinkOption === "text"}
                                    onCheckedChange={() => {
                                      setSelectedNavlinkOption("text");
                                      field.onChange("text");
                                    }}
                                  />
                                  <FormLabel htmlFor="text" className="ml-2">
                                    Text
                                  </FormLabel>
                                </div>
                                <div className="flex items-center">
                                  <Checkbox
                                    id="image"
                                    checked={selectedNavlinkOption === "image"}
                                    onCheckedChange={() => {
                                      setSelectedNavlinkOption("image");
                                      field.onChange("image");
                                    }}
                                  />
                                  <FormLabel
                                    htmlFor="image"
                                    className="ml-2"
                                  >
                                    Image
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Conditionally render fields based on selected option */}
                        {selectedNavlinkOption === "text" && (
                          <FormField
                            control={form.control}
                            name="navLink"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>NavLink</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Enter navbar link"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {selectedNavlinkOption === "image" && (
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
                                    disabled={createPageMutation.isPending}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            </div>
                          )}
                        />
                        )}
                      </div>

                      <div className="bg-gray-50 border rounded-xl px-4 py-2">
                        <p className="text-lg font-semibold mb-1">
                          Page Header
                        </p>
                        <Separator/>
                        <div className="my-3">
                          <FormField
                            control={form.control}
                            name="headerOption"
                            render={({ field }) => (
                              <FormItem className="flex gap-x-5 items-center space-y-0">
                                <div className="flex items-center">
                                  <Checkbox
                                    id="text"
                                    checked={selectedHeaderOption === "heading"}
                                    onCheckedChange={() => {
                                      setSelectedHeaderOption("heading");
                                      field.onChange("heading");
                                    }}
                                  />
                                  <FormLabel htmlFor="heading" className="ml-2">
                                    Text Heading
                                  </FormLabel>
                                </div>
                                <div className="flex items-center">
                                  <Checkbox
                                    id="image"
                                    checked={selectedHeaderOption === "billboard"}
                                    onCheckedChange={() => {
                                      setSelectedHeaderOption("billboard");
                                      field.onChange("billboard");
                                    }}
                                  />
                                  <FormLabel
                                    htmlFor="billboard"
                                    className="ml-2"
                                  >
                                    Billboard
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Conditionally render fields based on selected option */}
                        {selectedHeaderOption === "heading" && (
                          <FormField
                            control={form.control}
                            name="pageHeading"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Page Heading</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Enter page heading"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {selectedHeaderOption === "billboard" && (
                          <FormField
                            control={form.control}
                            name="billboard"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Billboard</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a billboard" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="None">None</SelectItem>
                                    {billboardItems.data &&
                                      billboardItems.data.map(
                                        (item: any, index: number) => (
                                          <SelectItem
                                            value={item.title}
                                            key={index}
                                          >
                                            {item.title}
                                          </SelectItem>
                                        )
                                      )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={createPageMutation.isPending}
                      >
                        Submit
                        {createPageMutation.isPending && (
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

          <div className="mt-5 flex flex-wrap items-center gap-5">
            <div className="w-full">
              {pageItems.isSuccess && pageItems.data && (
                <div className="w-full">
                  <DataTable columns={columns} data={pageItems.data} />
                </div>
              )}

              {pageItems.isLoading && (
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
