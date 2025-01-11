import prismadb from "@/lib/prismadb"
import { CategoryForm } from "./components/category-form"


interface CategoryPageProps{
  params:Promise<{ storeId: string,categoryId:string }>;
}


const CategoryPage = async ({params}:CategoryPageProps) => {

    const {categoryId,storeId} = await params;

    const Category = await prismadb.category.findUnique({
        where:{
            id:categoryId
        }
    })

    const billboards = await prismadb.billboard.findMany({
      where:{
          storeId:storeId
      }
    })

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm billboards={billboards} initialData={Category}/>
        </div>
    </div>
  )
}

export default CategoryPage
