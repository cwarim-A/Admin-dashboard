import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const addCorsHeaders = (res:Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
};



export async function GET(
  req: Request,
  {params}:{params:Promise<{storeId:string; categoryId:string}>}
) {
  const {storeId,categoryId} = await params;
  try {
    if (!categoryId) {
      return addCorsHeaders(new NextResponse("Billboard Id is required", { status: 400 }));
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: categoryId,
      },
      include:{
        billboard:true,
      }
    });
    return addCorsHeaders(NextResponse.json(category));
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return addCorsHeaders(new NextResponse("Internal error", { status: 500 }));
  }
}

export async function PATCH(
  req: Request,
  {params}:{params:Promise<{storeId:string; categoryId:string}>}
) {
  try {
    const { userId } = await auth();
    const {storeId,categoryId} = await params;
    const body = await req.json();
    const { name, billboardId } = body;
    if (!userId) {
      return addCorsHeaders(new NextResponse("Unauthenticated", { status: 401 }));
    }
    if (!name) {
      return addCorsHeaders(new NextResponse("name is required", { status: 400 }));
    }
    if (!billboardId) {
      return addCorsHeaders(new NextResponse("Billboard Id is required", { status: 400 }));
    }
    if (!categoryId) {
      return addCorsHeaders(new NextResponse("Category Id is required", { status: 400 }));
    }

    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });
    if (!storeByUser) {
      return addCorsHeaders(new NextResponse("Unauthorized", { status: 403 }));
    }

    const Category = await prismadb.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });
    return addCorsHeaders(NextResponse.json(Category));
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return addCorsHeaders(new NextResponse("Internal error", { status: 500 }));
  }
}

export async function DELETE(
  req: Request,
  {params}:{params:Promise<{categoryId:string; storeId:string}>}
) {
  try {
    const { userId } = await auth();
    const {categoryId,storeId} = await params;

    // Check authentication
    if (!userId) {
      return addCorsHeaders(new NextResponse("Unauthenticated", { status: 401 }));
    }

    // Validate required parameters
    if (!categoryId) {
      return addCorsHeaders(new NextResponse("Category ID is required", { status: 400 }));
    }

    // Check if the store belongs to the user
    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUser) {
      return addCorsHeaders(new NextResponse("Unauthorized", { status: 403 }));
    }

    
    // Attempt to delete the billboard
    
      const deletedCategory = await prismadb.category.delete({
        where: {
          id: categoryId,
        },
      });

      return addCorsHeaders(NextResponse.json(deletedCategory));
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return addCorsHeaders(new NextResponse("Internal server error", { status: 500 }));
  }
}

