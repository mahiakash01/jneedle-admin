import service from "@/appwrite/config";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  console.log(data);

  const res = await service.updatePageItem({
    pageId: data.pageId,
    updatedData: {
      href: data.href,
      pageHeading: data.pageHeading,
      archive: data.archive,
    },
  });
  if (res) {
    return NextResponse.json(
      { message: "Page updated successfully!" },
      { status: 200 }
    );
  }
  return;
}
