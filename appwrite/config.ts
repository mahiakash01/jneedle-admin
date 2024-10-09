import { Category } from "@/app/(dashboard)/categories/columns";
import { Product } from "@/app/(dashboard)/products/columns";
import conf from "@/conf/conf";
import { ID, Query, Permission, Role, ImageFormat } from "appwrite";
import { Account, Client, Databases, Storage } from "node-appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId)
      .setKey(conf.appwriteAdminKey);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  /* -----------------------------------------------------------------------
----------------------------- ADMIN ----------------------------------------
--------------------------------------------------------------------------*/
  async createAdminClient(): Promise<{
    account: Account;
    databases: Databases;
    storage: Storage;
  }> {
    return {
      account: new Account(this.client),
      databases: new Databases(this.client),
      storage: new Storage(this.client),
    };
  }

  /* -----------------------------------------------------------------------
----------------------------- USER ----------------------------------------
--------------------------------------------------------------------------*/
  async createUser({ email, password }: { email: string; password: string }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUserCollectionId,
        ID.unique(),
        {
          email,
          password,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: createUser :: error: ", error);
    }
  }

  async updateUser(
    id: string,
    { name, password, mobile_number }: UpdateUserParams
  ) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteUserCollectionId,
        id,
        {
          name,
          password,
          mobile_number,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: updateUser :: error: ", error);
    }
  }

  /* -----------------------------------------------------------------------
----------------------------- FILE STORAGE  ----------------------------------------
--------------------------------------------------------------------------*/
  async uploadFile(file: File): Promise<{ id: string; name: string }> {
    try {
      const response = await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );

      return {
        id: response.$id,
        name: file.name,
      };
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error: ", error);
      throw error;
    }
  }

  async getPreviewUrlFromProductId(productId: string) {
    try {
      const productDetails = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteProductCollectionId,
        [Query.equal("$id", productId)]
      );
      const response = productDetails.documents;
      if (response) {
        const products = response.map((product) => ({
          ...product,
          imgurl:
            typeof product.imgurl === "string"
              ? JSON.parse(product.imgurl)
              : [],
        }));
        console.log(products);
        return products[0].imgurl[0].previewUrl;
      }
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error: ", error);
      throw error;
    }
  }

  async deleteFile(fileId: string) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error: ", error);
      throw error;
    }
  }

  /* -----------------------------------------------------------------------
----------------------------- PRODUCT COLLECTION  --------------------------
--------------------------------------------------------------------------*/
  async getAllProductCategories() {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteProductCategoryCollectionId,
        []
      );

      return response.documents;
    } catch (error) {
      console.log("Appwrite service :: getProductCategories :: error: ", error);
      throw error;
    }
  }

  async getProductCategoryId(category_name: string) {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteProductCategoryCollectionId,
        [Query.equal("name", [category_name])]
      );

      if (response.documents.length > 0) {
        return response.documents[0]["$id"];
      } else {
        throw new Error(`Category '${category_name}' not found`);
      }
    } catch (error) {
      console.log("Appwrite service :: getProductCategories :: error: ", error);
      throw error;
    }
  }

  async uploadProductInventory({
    quantity,
    inventory_sku,
  }: {
    quantity: number;
    inventory_sku: string;
  }) {
    try {
      const response = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteProductInventoryCollectionId,
        ID.unique(),
        {
          quantity,
          sku: inventory_sku,
        }
      );

      return response.$id;
    } catch (error) {
      console.log(
        "Appwrite service :: uploadProductInventory :: error: ",
        error
      );
      throw error;
    }
  }

  async addNewProduct({
    name,
    desc,
    category,
    price,
    width,
    height,
    length,
    color,
    sku,
    images,
    archived,
    featured,
  }: NewProductProps) {
    try {
      await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteProductCollectionId,
        ID.unique(),
        {
          name,
          desc,
          price,
          width,
          height,
          length,
          color,
          sku,
          archived,
          featured,
          imgurl: images,
          productCategory: category,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: addNewProduct :: error: ", error);
    }
  }

  async getAllProducts() {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteProductCollectionId,
        [Query.limit(200)]
      );

      // console.log(response.documents);

      return response.documents;
    } catch (error) {
      console.log("Appwrite service :: getAllProducts :: error: ", error);
    }
  }

  async getProduct(productId: string) {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteProductCollectionId,
        [Query.equal("$id", productId)]
      );

      return response.documents;
    } catch (error) {
      console.log("Appwrite service :: getProduct :: error: ", error);
    }
  }

  async updateProduct({
    productId,
    updatedData,
  }: {
    productId: string;
    updatedData: UpdateProductProps;
  }) {
    try {
      const response = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteProductCollectionId,
        productId,
        {
          name: updatedData.product_name,
          desc: updatedData.product_desc,
          price: updatedData.product_price,
          width: updatedData.product_breadth,
          height: updatedData.product_height,
          length: updatedData.product_length,
          color: updatedData.product_color,
          sku: updatedData.sku,
          archived: updatedData.archived,
          featured: updatedData.featured,
        }
      );

      return response.documents;
    } catch (error) {
      console.log("Appwrite service :: updateProduct :: error: ", error);
    }
  }

  async deleteProduct(productArr: Product[]) {
    try {
      for (const product of productArr) {
        await this.databases.deleteDocument(
          conf.appwriteDatabaseId,
          conf.appwriteProductCollectionId,
          product.$id // Accessing $id property directly
        );
      }
      return "Product(s) deleted successfully!";
    } catch (error) {
      console.error("Appwrite service :: deleteProduct :: error: ", error);
      return "Error deleting products";
    }
  }

  async deleteProductCategory(categoryArr: Category[]) {
    try {
      for (const category of categoryArr) {
        console.log(category);
        await this.databases.deleteDocument(
          conf.appwriteDatabaseId,
          conf.appwriteProductCategoryCollectionId,
          category.$id
        );
      }
      return "Category(s) deleted successfully!";
    } catch (error) {
      console.error("Appwrite service :: deleteCategory :: error: ", error);
      return "Error deleting categories";
    }
  }

  async addNewProductCategory(name: string) {
    try {
      const response = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteProductCategoryCollectionId,
        ID.unique(),
        {
          name,
          created_at: new Date(),
        }
      );
      return response;
    } catch (error) {
      console.error(
        "Appwrite service :: addNewProductCategory :: error: ",
        error
      );
    }
  }

  /* -----------------------------------------------------------------------
----------------------------- BILLBOARD ------------------------------------
--------------------------------------------------------------------------*/
  async getBillboardId(billboard_name: any) {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteBillboardCollectionId,
        [Query.equal("title", [billboard_name])]
      );

      if (response.documents.length > 0) {
        return response.documents[0]["$id"];
      } else {
        throw new Error(`Billboard '${billboard_name}' not found`);
      }
    } catch (error) {
      console.log("Appwrite service :: getBillboardId :: error: ", error);
      throw error;
    }
  }

  async getAllBillboards() {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteBillboardCollectionId
      );

      console.log("Billboard Items: ", response.documents.length);

      return response.documents;
    } catch (error) {
      console.log("Appwrite service :: getAllBillboards :: error: ", error);
    }
  }

  async deleteBillboard(billboardItem: any) {
    try {
      await this.deleteFile(billboardItem.image.id);
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteBillboardCollectionId,
        billboardItem.$id
      );
      return "Billboard deleted successfully!";
    } catch (error) {
      console.error("Appwrite service :: billboardProduct :: error: ", error);
      return "Error deleting billboard";
    }
  }

  async addNewBillboard({ title, image }: NewBillboardProps) {
    try {
      await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteBillboardCollectionId,
        ID.unique(),
        {
          title,
          image,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: addNewBillboard :: error: ", error);
    }
  }

  /* -----------------------------------------------------------------------
----------------------------- PAGES ----------------------------------------
--------------------------------------------------------------------------*/
  async getAllPages() {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwritePagesCollectionId
      );

      return response.documents;
    } catch (error) {
      console.log("Appwrite service :: getAllPages:: error: ", error);
    }
  }

  async getPage(pageId: string) {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwritePagesCollectionId,
        [Query.equal("$id", [pageId])]
      );

      return response.documents;
    } catch (error) {
      console.log("Appwrite service :: getPage :: error: ", error);
    }
  }

  async updatePageItem({
    pageId,
    updatedData,
  }: {
    pageId: string;
    updatedData: {
      href: string;
      pageHeading: string;
      archive: boolean;
    };
  }) {
    try {
      const response = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwritePagesCollectionId,
        pageId,
        {
          href: updatedData.href,
          pageHeading: updatedData.pageHeading,
          archive: updatedData.archive,
        }
      );

      return response.documents;
    } catch (error) {
      console.log("Appwrite service :: updatePage :: error: ", error);
    }
  }

  async deletePageItems(pageItemsArr: any) {
    try {
      for (const pageItem of pageItemsArr) {
        await this.databases.deleteDocument(
          conf.appwriteDatabaseId,
          conf.appwritePagesCollectionId,
          pageItem.$id
        );
      }
      return "Page(s) deleted successfully!";
    } catch (error) {
      console.error("Appwrite service :: deletePageItems :: error: ", error);
      return "Error deleting pages";
    }
  }

  async deletePageItem(pageId: any) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwritePagesCollectionId,
        pageId
      );
      return "Page deleted successfully!";
    } catch (error) {
      console.error("Appwrite service :: deletePageItem :: error: ", error);
      return "Error deleting page";
    }
  }

  async addNewPage(pageItem: any) {
    try {
      const response = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwritePagesCollectionId,
        ID.unique(),
        pageItem
      );
      return response;
    } catch (error) {
      console.error("Appwrite service :: addNewPage :: error: ", error);
    }
  }
}

const service = new Service();
export default service;
