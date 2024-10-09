"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil } from "lucide-react";


export type PageItem = {
  $id: string;
  href: string;
  navLink: string | any;
  pageHeading: string;
  billboard: object;
  archive: boolean;
};

export const columns: ColumnDef<PageItem>[] = [
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
    accessorKey: "href",
    header: "Href",
    cell: ({ row }) => <p className="w-full">{row.getValue("href")}</p>,
  },
  {
    accessorKey: "navLink",
    header: "NavLink",
    cell: ({ row }) => {
      const navLink = row.getValue<string | { previewUrl?: string }[]>(
        "navLink"
      );

      if (typeof navLink === "string") {
        return <p className="capitalize">{navLink || "-"}</p>;
      }
      if (Array.isArray(navLink) && navLink[0]?.previewUrl) {
        return (
          <img
            src={navLink[0].previewUrl}
            alt="NavLink Image"
            width={40}
            height={40}
          />
        );
      }

      return <p>-</p>;
    },
  },
  {
    accessorKey: "pageHeading",
    header: "Page Heading",
    cell: ({ row }) => <p className="w-full">{row.getValue("pageHeading")}</p>,
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => {
      const billboard = row.getValue<any | {}>("billboard");

      if (billboard && Object.keys(billboard).length > 0) {
        return (
          <img
            src={billboard.previewUrl}
            alt="Billboard Image"
            width={40}
            height={40}
          />
        );
      } else {
        return <p>-</p>;
      }
    },
  },
  {
    accessorKey: "archive",
    header: "Archive",
    cell: ({ row }) => (
      <p className="w-full">{JSON.stringify(row.getValue("archive"))}</p>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const page = row.original;
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
                onClick={() =>
                  router.push(`/pages/${page.$id}`)
                }
              >
                <Pencil size={12} />
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
