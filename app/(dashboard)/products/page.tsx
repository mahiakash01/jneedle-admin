"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { columns, Product } from "./columns";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/Heading";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "./data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`/api/products/fetch-all-products`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export default function ProductsPage() {
  const { data, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  return (
    <ContentLayout title="All Products">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="py-5">
        <Card className="p-6">
          <div className="w-full flex items-center justify-between">
            <div>
              <Heading title="Products" description="Manage your products." />
            </div>
            <Link href={"/products/new"}>
              <Button>
                <Plus size={16} className="mr-2" />{" "}
                <p className="text-sm">Add New</p>
              </Button>
            </Link>
          </div>

          <Separator className="my-4" />

          <div className="">
            {isLoading ? (
              <div className="space-y-5 min-h-screen">
                <Skeleton className="lg:w-[100%] h-10" />
                <Skeleton className="lg:w-[100%] h-10" />
                <Skeleton className="lg:w-[100%] h-10" />
                <Skeleton className="lg:w-[100%] h-10" />
              </div>
            ) : isError ? (
              <p>Error: {error.message}</p>
            ) : (
              data && <DataTable columns={columns} data={data} />
            )}
          </div>
        </Card>
      </div>
    </ContentLayout>
  );
}
