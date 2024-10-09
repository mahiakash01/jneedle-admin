"use server";

import { cookies } from "next/headers";
import { createSessionClient } from "./session";
import { redirect } from "next/navigation";

export async function getUser() {
  const session = cookies().get("session");
  const sessionCookie = session ? session.value : null;
  try {
    if (sessionCookie) {
      const { account } = await createSessionClient(sessionCookie);
      const user = await account.get();
      return user;
    }
  } catch (error) {
    console.error(error);
    return null; // Return null if an error occurs
  }
}

export async function deleteSession() {
  const session = cookies().get("session");
  const sessionCookie = session ? session.value : null;
  console.log("logout tried");

  try {
    const { account } = await createSessionClient(sessionCookie);
    await account.deleteSession("current");
    cookies().delete("session");
    redirect("/login");
  } catch (error) {
    cookies().delete("session");
    redirect("/login");
  }
}
