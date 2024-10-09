"use client";

import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsPencilSquare } from "react-icons/bs";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
  $id: string;
  imgurl: {
    id: string;
    name: string;
    previewUrl: string;
  }[];
  name: string;
  productCategory: {
    $id: string;
    name: string;
  };
  price: number;
  sku: string;
  archived: boolean;
  featured: boolean;
};

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "imgurl",
    header: ({ column }) => {
      return <div>Image</div>;
    },
    cell: ({ row }) => {
      const images = row.getValue("imgurl") as {
        id: string;
        name: string;
        previewUrl: string;
      }[];
      const previewUrl = images[0]?.previewUrl;
      return (
        <img
          src={previewUrl}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          className="rounded-lg object-cover"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <p className="capitalize">{row.getValue("name")}</p>,
  },
  {
    accessorKey: "archived",
    header: "Archived",
    cell: ({ row }) => {
      const isFeatured = row.getValue("archived");
      return (
        <>
          {isFeatured ? (
            <Badge variant={"destructive"} className="rounded-full">
              {JSON.stringify(row.getValue("archived"))}
            </Badge>
          ) : (
            <Badge variant={"outline"} className="rounded-full">
              {JSON.stringify(row.getValue("archived"))}
            </Badge>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "productCategory",
    id: "productCategory",
    header: "Category",
    cell: ({ row }) => {
      const productCategory = row.getValue("productCategory") as
        | {
            $id: string;
            name: string;
          }
        | undefined;
      const category = productCategory?.name ?? ""; // Optional chaining and nullish coalescing
      return <p className="">{category}</p>;
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      const isFeatured = row.getValue("featured");
      return (
        <>
          {isFeatured ? (
            <Badge variant={"outline"} className="border-green-700 rounded-full text-green-700">
              {JSON.stringify(row.getValue("featured"))}
            </Badge>
          ) : (
            <Badge variant={"outline"} className="rounded-full">
              {JSON.stringify(row.getValue("featured"))}
            </Badge>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => {
      return <p>{row.getValue("sku")}</p>;
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));

      // Format the amount as a Rupees amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <p className="text-right font-medium">{formatted}</p>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="flex justify-start items-center gap-2"
                onClick={() => router.push(`/products/${product.$id}`)}
              >
                <BsPencilSquare />
                <span>Edit</span>
              </Button>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <Button
                variant="ghost"
                className="flex justify-start items-center gap-2"
                onClick={() => handleProductDeletion(row.id)}
              >
                <FaTrashAlt className="text-red-800" />
                <span className="text-red-800">Delete</span>
              </Button>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
