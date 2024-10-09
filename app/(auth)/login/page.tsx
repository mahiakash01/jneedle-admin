import Link from "next/link";

import LoginForm from "./components/LoginForm";
import { getUser } from "@/appwrite/client-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const page = async () => {
  const user = await getUser();
  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-5 md:px-0 bg-muted">
      <Card className="w-full px-5 py-10 max-w-md shadow-xl">
        <div className="w-full flex flex-col items-center justify-center">
          <img src="/images/logo.png" alt="Logo" width={100} height={100} />
          <h1 className={"ml-2 font-bold text-3xl mt-3"}>
            JNeedle{" "}
            <span className="align-super text-sm font-normal">admin</span>
          </h1>
        </div>
        {user ? (
          <div className="w-full flex justify-center items-center mt-5">
            <Link href={'/'}>
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <LoginForm />
        )}
      </Card>
    </div>
  );
};

export default page;
