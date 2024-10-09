import service from "@/appwrite/config";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const res = await service.getAllBillboards();

    if (res) {
      const billboards = res.map((product) => ({
        ...product,
        image:
          typeof product.image === "string" ? JSON.parse(product.image) : {},
      }));
      return NextResponse.json(billboards, {
        headers: {
          "Cache-Control": "no-store, must-revalidate", // No caching
        },
      });
    }
  } catch (error) {}
}
