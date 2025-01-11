import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


interface RouteContext{
  params:Promise<{storeId:string,categoryId:string}>
}


export async function GET(
  req: Request,
  context:RouteContext
) {
  const {storeId,categoryId} = await context.params;
  try {
    if (!categoryId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: categoryId,
      },
      include:{
        billboard:true,
      }
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context:RouteContext
) {
  try {
    const { userId } = await auth();
    const {storeId,categoryId} = await context.params;
    const body = await req.json();
    const { name, billboardId } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
    }
    if (categoryId) {
      return new NextResponse("Category Id is required", { status: 400 });
    }

    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });
    if (!storeByUser) {
      return new NextResponse("Unauthorized", { status: 403 });
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
    return NextResponse.json(Category);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context:RouteContext
) {
  try {
    const { userId } = await auth();
    const {categoryId,storeId} = await context.params

    // Check authentication
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Validate required parameters
    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    // Check if the store belongs to the user
    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    
    // Attempt to delete the billboard
    
      const deletedCategory = await prismadb.category.delete({
        where: {
          id: categoryId,
        },
      });

      return NextResponse.json(deletedCategory);
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

