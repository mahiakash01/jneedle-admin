import {
  GalleryVertical,
  ShoppingBag,
  Settings,
  Bookmark,
  Box,
  LayoutGrid,
  LucideIcon,
  AppWindow
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Dashboard",
          active: pathname.endsWith("/"),
          icon: LayoutGrid,
          submenus: []
        },
        {
          href: "/",
          label: "Orders",
          active: pathname.endsWith("/orders"),
          icon: ShoppingBag,
          submenus: []
        },
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "",
          label: "Products",
          active: pathname.includes("/products"),
          icon: Box,
          submenus: [
            {
              href: "/products",
              label: "All Products"
            },
            {
              href: "/products/new",
              label: "New Product"
            }
          ]
        },
        {
          href: "/categories",
          label: "Categories",
          active: pathname.includes("/categories"),
          icon: Bookmark
        },
        {
          href: "/billboards",
          label: "Billboards",
          active: pathname.includes("/billboard"),
          icon: GalleryVertical
        },
        {
          href: "/pages",
          label: "Pages",
          active: pathname.includes("/pages"),
          icon: AppWindow
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: Settings
        }
      ]
    }
  ];
}
