import { z } from "zod";

export const billboardSchema = z.object({
  title: z.string().min(1, "Billboard name is required"),
  image: z.array(z.instanceof(File)).min(1, "At least one image is required"),
});
export type BillboardFormData = z.infer<typeof billboardSchema>;

export const pageSchema = z.object({
  href: z.string().min(1, "href is required"),
  navLink: z.string().optional(),
  pageHeading: z.string().optional(),
  billboard: z.string().optional(),
  headerOption: z.enum(["heading", "billboard"]),
  navlinkOption: z.enum(["text", "image"]),
  image: z.array(z.instanceof(File)).optional(),
});

export type PageFormData = z.infer<typeof pageSchema>;

export const updatePageSchema = z.object({
  href: z.string().min(1, "href is required"),
  pageHeading: z.string().nullable().optional(),
  archive: z.boolean(),
});

export type UpdatePageFormData = z.infer<typeof updatePageSchema>;

export const productCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});
export type CategoryFormData = z.infer<typeof productCategorySchema>;

export const updateProductSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  product_desc: z.string().min(1, "Product description is required"),
  product_color: z.string().min(1, "Product color is required"),
  product_length: z.preprocess(
    (val) => Number(val),
    z.number().positive("Product length must be positive")
  ),
  product_breadth: z.preprocess(
    (val) => Number(val),
    z.number().positive("Product breadth must be positive")
  ),
  product_height: z.preprocess(
    (val) => Number(val),
    z.number().positive("Product height must be positive")
  ),
  sku: z.string().min(1, "Product SKU is required"),
  product_price: z.preprocess(
    (val) => Number(val),
    z.number().positive("Product price must be positive")
  ),
  archived: z.boolean().default(false),
  featured: z.boolean().default(false)
});

export type UpdateProductFormData = z.infer<typeof updateProductSchema>;

export const productSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  product_desc: z.string().min(1, "Product description is required"),
  product_category: z.string().min(1, "Product category is required"),
  product_color: z.string().min(1, "Product color is required"),
  product_length: z.preprocess(
    (val) => Number(val),
    z.number().positive("Product length must be positive")
  ),
  product_breadth: z.preprocess(
    (val) => Number(val),
    z.number().positive("Product breadth must be positive")
  ),
  product_height: z.preprocess(
    (val) => Number(val),
    z.number().positive("Product height must be positive")
  ),
  sku: z.string().min(1, "Product SKU is required"),
  archived: z.boolean().default(false),
  featured: z.boolean().default(false),
  product_price: z.preprocess(
    (val) => Number(val),
    z.number().positive("Product price must be positive")
  ),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const loginFormSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
 });
