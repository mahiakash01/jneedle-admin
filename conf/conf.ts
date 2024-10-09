const conf = {
  appwriteUrl: String(process.env.NEXT_PUBLIC_APPWRITE_URL),
  appwriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
  appwriteUserCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID
  ),
  appwriteBillboardCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_BILLBOARD_COLLECTION_ID
  ),
  appwritePagesCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_PAGES_COLLECTION_ID
  ),
  appwriteBucketId: String(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID),
  appwriteProductCategoryCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_PRODUCT_CATEGORY_ID
  ),
  appwriteProductInventoryCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_PRODUCT_INVENTORY_ID
  ),
  appwriteProductCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_PRODUCT_ID
  ),
  appwriteUserCartCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_USER_CART_ID
  ),
  appwriteUserAddressCollectionId: String(
    process.env.NEXT_PUBLIC_APPWRITE_USER_ADDRESS_ID
  ),
  baseURL: String(process.env.NEXT_PUBLIC_BASE_URL),
  appwriteAdminKey: String(process.env.NEXT_PUBLIC_APPWRITE_API_KEY),
};

export default conf;
