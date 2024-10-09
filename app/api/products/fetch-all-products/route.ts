import service from "@/appwrite/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await service.getAllProducts();

    if (response) {
      const products = response.map((product) => ({
        ...product,
        imgurl:
          typeof product.imgurl === "string" ? JSON.parse(product.imgurl) : [],
      }));
      return NextResponse.json(products);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { category } = await req.json();

    const response = await service.getAllProducts();

    const res = response;

    if (res) {
      const vintageProducts = res.filter(
        (product: any) => product.productCategory.name === category
      );
      if (vintageProducts) {
        const products = vintageProducts.map((product) => ({
          ...product,
          imgurl:
            typeof product.imgurl === "string"
              ? JSON.parse(product.imgurl)
              : [],
        }));
        return NextResponse.json(products);
      }
    } else {
      return NextResponse.json(
        { error: "Failed to fetch filtered products" },
        { status: 500 }
      );
    }
  } catch (error) {
    NextResponse.json(
      { error: "Failed to fetch filtered products" },
      { status: 500 }
    );
  }
}
