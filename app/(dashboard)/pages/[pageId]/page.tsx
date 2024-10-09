"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import UpdatePageForm from "./components/UpdatePageForm";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface PageParamsProps {
  pageId: string;
}

const page = ({ params }: { params: PageParamsProps }) => {
  const router = useRouter();

  const pageItem = useQuery({
    queryKey: ["pageItem", params.pageId],
    queryFn: async () => {
      try {
        const res = await fetch("/api/pages/fetch-pageItem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });
        const data = await res.json();
        return data;
      } catch (error) {
        return error;
      }
    },
  });

  console.log(pageItem.data);

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
            <BreadcrumbLink asChild>
              <Link href="/pages">Pages</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="py-5">
        <Card className="p-6">
          <div className="flex items-center justify-start gap-3">
            <Button
              variant={"ghost"}
              className="h-full rounded-xl p-3"
              onClick={() => router.replace("/pages")}
            >
              <ArrowLeft />
            </Button>
            <div className="flex flex-col items-start justify-center">
              <p className="text-sm text-black/50">Back to pages list</p>
              <h3 className="text-3xl font-semibold">Edit Page</h3>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="mt-5">
            {pageItem.isSuccess && pageItem.data && (
              <UpdatePageForm formData={pageItem.data} pageId={params.pageId} />
            )}
            {pageItem.isLoading && (
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
};

export default page;
