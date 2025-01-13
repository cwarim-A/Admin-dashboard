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
    const { name,value } = body;

    if (!name) {
      return addCorsHeaders(new NextResponse("name is required", { status: 400 }));
    }

    if (!value) {
      return addCorsHeaders(new NextResponse("Value is required", { status: 400 }));
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
      return addCorsHeaders(new NextResponse("Unauthorized", { status: 403 }));
    }

    const size = await prismadb.size.create({
      data: {
       name,
       value,
        storeId: storeId,
      },
    });

    return addCorsHeaders(NextResponse.json(size));
  } catch (error) {
    console.log("[SIZE_POST]", error);

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
    const {storeId} = await params;
  try {
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

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: storeId,
      },
    });

    return addCorsHeaders(NextResponse.json(sizes));
  } catch (error) {
    console.log("[SIZES_GET]", error);

    return addCorsHeaders(new NextResponse(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }));
  }
};
