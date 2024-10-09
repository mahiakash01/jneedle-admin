import React, { useState } from "react";
import service from "@/appwrite/config";
import { useQueryClient } from "@tanstack/react-query";

import { Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const BillboardCard = (billboardItem: any, key: number) => {
  const queryClient = useQueryClient();
  const [deleteBillboard, setDeleteBillboard] = useState(false);

  const onDelete = async (item: string) => {
    setDeleteBillboard(true);
    await service.deleteBillboard(item);
    await queryClient.refetchQueries({ queryKey: ["billboards"] });
    setDeleteBillboard(false);
  };

  console.log("item: ", billboardItem.billboardItem.image);
  return (
    <Card className="w-[200px]" key={key}>
      <div className="w-full h-[150px] flex justify-center items-center">
        <img
          src={billboardItem.billboardItem.image.previewUrl}
          alt=""
          width={50}
          height={50}
          className="w-full h-full object-cover object-center mx-auto rounded-t-xl"
        />
      </div>
      <div className="flex justify-between items-center p-4">
        <p className="capitalize">{billboardItem.billboardItem.title}</p>
        <Button
          variant={"ghost"}
          className="p-2"
          disabled={deleteBillboard}
          onClick={() => onDelete(billboardItem.billboardItem)}
        >
          {
            deleteBillboard ? (<LoadingSpinner size={18} className="text-red-700"/>):(<Trash2 size={18} className="text-red-700" />)
          }
        </Button>
      </div>
    </Card>
  );
};

export default BillboardCard;
