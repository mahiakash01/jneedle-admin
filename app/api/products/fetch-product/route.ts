import service from "@/appwrite/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get("productId"); // Get the productId from search params

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    // console.log("productId", productId);

    const data = await service.getProduct(productId);

    if (Array.isArray(data) && data.length > 0) {
      if (data) {
        const products = data.map((product) => ({
          ...product,
          imgurl:
            typeof product.imgurl === "string"
              ? JSON.parse(product.imgurl)
              : [],
        }));
        // console.log(products);
        return NextResponse.json(products[0]);
      } else {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
