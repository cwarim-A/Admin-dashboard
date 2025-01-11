"use client"


import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import {ApiList} from "@/components/ui/api-list"

import { CategoryColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

interface CategoryClientProps{
    data:CategoryColumn[]
}



export const CategoryClient:React.FC<CategoryClientProps> = ({data})=>{
    const router = useRouter()
    const params = useParams()
    return (
        <>
        <div className="flex items-center justify-between">
            <Heading
            title={`Category (${data.length})`}
            description="Manage categories for your store"
            />
            <Button onClick={()=>router.push(`/${params.storeId}/categories/new`)}>
                <Plus className="mr-2 w-4 h-4"/>
                Add New
            </Button>
        </div>
        <Separator/>
        <DataTable searchKey="name" columns={columns} data={data}/>
        <Heading title="API" description="API calls for Categoriess"/>
        <Separator/>
        <ApiList entityName="categories" entityIdName="categoryId"/>
     </>       
    )
}