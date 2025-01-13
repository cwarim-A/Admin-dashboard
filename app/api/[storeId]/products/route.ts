import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const addCorsHeaders = (res:Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
};


export const POST = async (
  req: Request,
  {params}:{params:Promise<{storeId:string}>}
) => {
  try {
    const { userId } = await auth();
    const {storeId} = await params;

    if (!userId) {
      return addCorsHeaders(new NextResponse("Unauthenticated", { status: 401 }));
    }

    const body = await req.json();
    const { name,price,categoryId,colorId,sizeId,images,isFeatured,isArchived } = body;

    if (!name) {
      return addCorsHeaders(new NextResponse("name is required", { status: 400 }));
    }

    if (!price) {
      return addCorsHeaders(new NextResponse("price is required", { status: 400 }));
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
    if (!images || !images.length ) {
      return addCorsHeaders(new NextResponse("images is required", { status: 400 }));
    }
    if (!isFeatured) {
      return addCorsHeaders(new NextResponse("isFeatured is required", { status: 400 }));
    }
    




    if (!storeId) {
      return addCorsHeaders(new NextResponse("Store ID is required", { status: 400 }));
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

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        images:{
          createMany:{
            // data:images.map((image:{url:string})=>image)
            data: images.map((image: { url: string }) => ({ url: image.url })),
          }
        },
        storeId: storeId,
      },
    });

    return addCorsHeaders(NextResponse.json(product));
  } catch (error) {
    console.log("[PRODUCT_POST]", error);

    return addCorsHeaders(new NextResponse(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }));
  }
};

export const GET = async (
  req: Request,
  {params}:{params:Promise<{storeId:string}>}
) => {
  try {

    const {storeId} = await params;
    const {searchParams}=new URL(req.url)
    const categoryId=searchParams.get('categoryId') || undefined
    const colorId=searchParams.get('colorId') || undefined
    const sizeId=searchParams.get('sizeId') || undefined
    const isFeatured=searchParams.get('isFeatured') 
    



    if (!storeId) {
      return addCorsHeaders(new NextResponse("Store ID is required", { status: 400 }));
    }

    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: storeId,
      },
    });
    if (!storeByUser) {
      return addCorsHeaders(new NextResponse("Unauthorized", { status: 403 }));
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured:isFeatured ? true : undefined,
        isArchived:false
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
    },
    orderBy:{
      createdAt:'desc'
    }
   } );

    return addCorsHeaders(NextResponse.json(products));
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);

    return addCorsHeaders(new NextResponse(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }));
  }
};
