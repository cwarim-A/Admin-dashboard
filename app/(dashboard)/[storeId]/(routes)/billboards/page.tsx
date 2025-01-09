import { BillboardClient } from "./components/client"
import {BillboardColumn} from "./components/columns"

import prismadb from "@/lib/prismadb"
import { format } from "date-fns";


const BillboardsPage = async({params}:{params:{storeId:string}}) => {

    const {storeId} = await params;

  const billboards = await prismadb.billboard.findMany({
        where:{
          storeId:storeId
        },
        orderBy:{
            createdAt:"desc"
        }


  })
  const formattedBillboards:BillboardColumn[] = billboards.map((item)=>({
    id:item.id,
    label:item.label,
    createdAt:format(item.createdAt,"MMMM dd, yyyy")
  }))
  return (
    <div className="flex-col">
       <div className="flex-1 space-y-4 p-8 pt-6 ">
                <BillboardClient data={formattedBillboards}/>
        </div>
    </div>
  )
}

export default BillboardsPage
