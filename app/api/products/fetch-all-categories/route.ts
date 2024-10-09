import service from "@/appwrite/config"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const categoriesData = await service.getAllProductCategories()
    const formattedCategories: ProductCategory[] = categoriesData.map((category) => ({
      $id: category.$id,
      name: category.name,
    }));

    return Response.json(formattedCategories)
    
  } catch (error: any) {
    return Response.json({"API ERROR :: get-all-categories": error})
  }
}