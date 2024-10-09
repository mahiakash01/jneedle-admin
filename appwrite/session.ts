"use server";

import conf from "@/conf/conf";
import { Client, Account, Databases } from "node-appwrite";
import service from "./config";
import { cookies } from "next/headers";

export async function createSession(formData: {
  email: string;
  password: string;
}) {
  const { email, password } = formData;

  try {
    const adminClient = await service.createAdminClient();
    const account = adminClient.account;

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("session", session.secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(session.expire),
      path: "/",
    });

    return { redirect: true}
  } catch (error) {
    console.log(error)
    return { error: "Invalid Credentials!" };
  }
}

export const createSessionClient = async (session: any) => {
  const client = new Client()
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);

  if (session) {
    client.setSession(session);
  }

  return {
    get account() {
      return new Account(client);
    },

    get databases() {
      return new Databases(client);
    },
  };
};
