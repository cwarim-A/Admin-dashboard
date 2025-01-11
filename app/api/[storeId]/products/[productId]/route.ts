import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


interface RouteContext {
  params:Promise<{productId:string,storeId:string}>
}

export async function GET(
  req: Request,
  context: RouteContext
) {
  try {
    const {productId} = await context.params;
    if (!productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        color: true,
        size: true,
        images: true,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context:RouteContext
) {
  try {
    const { userId } = await auth();
    const {productId,storeId} = await context.params;
    const body = await req.json();
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse(" price is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("categoryId is required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("colorId is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("sizeId is required", { status: 400 });
    }
    if (!images) {
       return new NextResponse("images is required", { status: 400 });
    }
    if (!productId) {
      return new NextResponse("Product Id is required", { status: 400 });
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

     await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images:{
          deleteMany:{}
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
      where:{
        id:productId
      },
      data:{
        images:{
          createMany:{
            data:[
              ...images.map((image:{url:string})=>image)
            ]
          }
        }
      }
    })

    
    


    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context:RouteContext
) {
  try {
    const { userId } = await auth();
    const {productId,storeId} = await context.params;
    // Check authentication
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Validate required parameters
    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
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

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return new NextResponse("product not found", { status: 404 });
    }

    // Attempt to delete the billboard
   
      const deletedProduct = await prismadb.product.delete({
        where: {
          id: productId,
        },
      });

      return NextResponse.json(deletedProduct);
    
      

     
    
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
