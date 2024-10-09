import React from "react";
import { getUser } from "@/appwrite/client-auth";

import { Label } from "@/components/ui/label";

const AccountInfo = async () => {
  const user = await getUser();

  return (
    <div className="space-y-5">
      <div className="flex gap-x-2 items-center">
        <Label>ID: </Label>
        <p className="text-sm bg-gray-100 p-2 rounded-lg">{user?.$id}</p>
      </div>
      <div className="flex gap-x-2 items-center">
        <Label>Name: </Label>
        <p className="text-sm p-2">{user?.name}</p>
      </div>
      <div className="flex gap-x-2 items-center">
        <Label>Email: </Label>
        <p className="text-sm p-2">{user?.email}</p>
      </div>
      
      <div className="flex gap-x-2 items-center">
        <Label>Role: </Label>
        <p className="text-sm bg-yellow-400 py-2 px-5 rounded-full font-bold">{user?.prefs.role}</p>
      </div>
    </div>
  );
};

export default AccountInfo;
