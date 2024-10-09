"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import UpdateProductForm from "./components/UpdateProductForm";

export default function ProductPage({params}:{params: any}) {
  const router = useRouter()

  const productDetails = useQuery({
    queryKey: ["productDetails", params.productId],
    queryFn: async () => {
      const res = await fetch(
        `/api/products/fetch-product?productId=${params.productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      return data;
    },
  });
  return (
    <ContentLayout title="Product">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/products">Product</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{params.productId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="py-5">
        <Card className="p-6">
          <div className="flex items-center justify-start gap-3">
            <Button
              variant={"ghost"}
              className="h-full rounded-xl p-3"
              onClick={() => router.replace("/products")}
            >
              <ArrowLeft />
            </Button>
            <div className="flex flex-col items-start justify-center">
              <p className="text-sm text-black/50">Back to products list</p>
              <h3 className="text-3xl font-semibold">Update Product</h3>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="mt-5">
            {productDetails.isSuccess && productDetails.data && (
              <UpdateProductForm productDetails={productDetails.data} />
            )}
            {productDetails.isLoading && (
              <div className="space-y-5 min-h-screen">
                <Skeleton className="lg:w-[100%] h-10" />
                <Skeleton className="lg:w-[100%] h-10" />
                <Skeleton className="lg:w-[100%] h-10" />
                <Skeleton className="lg:w-[100%] h-10" />
              </div>
            )}
          </div>
        </Card>
      </div>

    </ContentLayout>
  );
}
