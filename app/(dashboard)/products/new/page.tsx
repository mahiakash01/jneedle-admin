"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { NewProductForm } from "./components/NewProductForm";

export default function NewPostPage() {
  const router = useRouter()
  return (
    <ContentLayout title="New Post">
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
              <Link href="/products">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
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
              <h3 className="text-3xl font-semibold">New Product</h3>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="mt-5">
            <NewProductForm/>
          </div>
        </Card>
      </div>
    </ContentLayout>
  );
}
