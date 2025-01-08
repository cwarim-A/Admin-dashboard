"use client"


import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import {ApiList} from "@/components/ui/api-list"

import { ColorColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

interface ColorsClientProps{
    data:ColorColumn[]
}



export const ColorsClient:React.FC<ColorsClientProps> = ({data})=>{
    const router = useRouter()
    const params = useParams()
    return (
        <>
        <div className="flex items-center justify-between">
            <Heading
            title={`Colors (${data.length})`}
            description="Manage colors for your store"
            />
            <Button onClick={()=>router.push(`/${params.storeId}/colors/new`)}>
                <Plus className="mr-2 w-4 h-4"/>
                Add New
            </Button>
        </div>
        <Separator/>
        <DataTable searchKey="name" columns={columns} data={data}/>
        <Heading title="API" description="API calls for colors"/>
        <Separator/>
        <ApiList entityName="colors" entityIdName="colorId"/>
     </>       
    )
}