import service from "@/appwrite/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const res = await service.getPage(data.pageId);
  if (res) {
    const pageItem = res.map((item) => ({
      ...item,
      billboard:
        item.billboard &&
        item.billboard.image &&
        typeof item.billboard.image === "string"
          ? JSON.parse(item.billboard.image)
          : {},
      navLink:
        typeof item.navLink === "string" && item.navLink.startsWith("[{")
          ? JSON.parse(item.navLink)
          : item.navLink,
    }));
    return NextResponse.json(pageItem);
  }
}
