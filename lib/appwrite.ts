import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: "com.sandeep.foodordering",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: "687b3cfc00123624c422",
  bucketId: "687deb2a0034adb5d856",
  userCollectionId: "687b3d3400316492bab7",
  categoriesCollectionId: "687de615000f8c3868a2",
  menuCollectionId: "687de6c500018beb697f",
  customizationCollectionId: "687de8d700292c386c7d",
  menuCustomizationCollectionId: "687de9d50038669ab8a6",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);

// create new user
export const createUser = async ({
  name,
  email,
  password,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw Error;

    // call sign in
    await signIn({ email, password });

    // generate avatar url
    const avatarUrl = avatars.getInitialsURL(name);

    // store user in DB
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        name,
        email,
        accountId: newAccount.$id,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (err) {
    throw new Error(err as string);
  }
};

// sign in
export const signIn = async ({ email, password }: SignInParams) => {
  try {
    // sign in user with email and password
    const session = await account.createEmailPasswordSession(email, password);
  } catch (err) {
    throw new Error(err as string);
  }
};

// get current user
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (err) {
    console.log(err);
    throw new Error(err as string);
  }
};

// get menu
export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [];

    if (category) queries.push(Query.equal("categories", category));
    if (query) queries.push(Query.search("name", query));

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      queries
    );

    return menus.documents;
  } catch (e) {
    throw new Error(e as string);
  }
};

//get categories
export const getCategories = async () => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId
    );

    return categories.documents;
  } catch (e) {
    throw new Error(e as string);
  }
};
