"use server";

import { cookies } from "next/headers";
import { createSessionClient } from "./session";
import { redirect } from "next/navigation";

const auth = {
  user: null as any | null,
  sessionCookie: null as any | null,

  getUser: async () => {
    const session = cookies().get("session");
    auth.sessionCookie = session ? session.value : null;
    try {
      if (auth.sessionCookie) {
        const { account } = await createSessionClient(auth.sessionCookie);
        auth.user = await account.get();

        if (
          auth.user &&
          auth.user.prefs.role === "admin" &&
          (auth.user.labels || auth.user.labels.includes("admin"))
        ) {
          return auth.user;
        }
      }
    } catch (error) {
      console.error(error);
      auth.user = null;
      auth.sessionCookie = null;
    }
  },

  deleteSession: async () => {
    auth.sessionCookie = cookies().get("session");
    console.log("logout tried")

    try {
      const { account } = await createSessionClient(auth.sessionCookie);
      await account.deleteSession("current");
    } catch (error) {
      cookies().delete("session");
      auth.user = null;
      auth.sessionCookie = null;
      redirect("/login");
    }
  },
};

export default auth;
