import service from "@/appwrite/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = await service.getAllPages();
  if (res) {
    const pageItems = res.map((item) => ({
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

    return NextResponse.json(pageItems);
  }
}
