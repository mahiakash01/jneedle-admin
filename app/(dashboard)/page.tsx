import Link from "next/link";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DashboardComp } from "@/components/DashboardComp";

export default function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <DashboardComp/>
    </ContentLayout>
  );
}
