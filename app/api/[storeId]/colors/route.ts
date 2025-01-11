import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


interface RouteContext{
  params:Promise<{storeId:string,}>
}

export const POST = async (
  req: Request,
  context:RouteContext
) => {
  try {
    const { userId } = await auth();
    const {storeId} = await context.params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await req.json();
    const { name,value } = body;

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
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

    const color = await prismadb.color.create({
      data: {
       name,
       value,
        storeId: storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_POST]", error);

    return new NextResponse(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const GET = async (
  req: Request,
  context:RouteContext
) => {
  const {storeId} = await context.params;
  try {
    if (storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: storeId,
      },
    });
    if (!storeByUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLOR_GET]", error);

    return new NextResponse(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
