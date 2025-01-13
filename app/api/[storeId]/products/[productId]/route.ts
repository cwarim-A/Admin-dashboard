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
  {params}:{params:Promise<{productId:string}>}
) {
  try {
    const {productId} = await params;
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
    return addCorsHeaders(NextResponse.json(product));
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return addCorsHeaders(new NextResponse("Internal error", { status: 500 }));
  }
}

export async function PATCH(
  req: Request,
  {params}:{params:Promise<{storeId:string; productId:string}>}
) {
  try {
    const { userId } = await auth();
    const {productId,storeId} = await params;
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
      return addCorsHeaders(new NextResponse("Unauthenticated", { status: 401 }));
    }
    if (!name) {
      return addCorsHeaders(new NextResponse("Name is required", { status: 400 }));
    }
    if (!price) {
      return addCorsHeaders(new NextResponse(" price is required", { status: 400 }));
    }
    if (!categoryId) {
      return addCorsHeaders(new NextResponse("categoryId is required", { status: 400 }));
    }
    if (!colorId) {
      return addCorsHeaders(new NextResponse("colorId is required", { status: 400 }));
    }
    if (!sizeId) {
      return addCorsHeaders(new NextResponse("sizeId is required", { status: 400 }));
    }
    if (!images) {
       return addCorsHeaders(new NextResponse("images is required", { status: 400 }));
    }
    if (!productId) {
      return addCorsHeaders(new NextResponse("Product Id is required", { status: 400 }));
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

    
    


    return addCorsHeaders(NextResponse.json(product));
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return addCorsHeaders(new NextResponse("Internal error", { status: 500 }));
  }
}

export async function DELETE(
  req: Request,
  {params}:{params:Promise<{storeId:string; productId:string}>}
) {
  try {
    const { userId } = await auth();
    const {productId,storeId} = await params;
    // Check authentication
    if (!userId) {
      return addCorsHeaders(new NextResponse("Unauthenticated", { status: 401 }));
    }

    // Validate required parameters
    if (!productId) {
      return addCorsHeaders(new NextResponse("Product ID is required", { status: 400 }));
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

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return addCorsHeaders(new NextResponse("product not found", { status: 404 }));
    }

    // Attempt to delete the billboard
   
      const deletedProduct = await prismadb.product.delete({
        where: {
          id: productId,
        },
      });

      return addCorsHeaders(NextResponse.json(deletedProduct));
    
      

     
    
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return addCorsHeaders(new NextResponse("Internal server error", { status: 500 }));
  }
}
