import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface RouteContext{
  params:Promise<{sizeId:string,storeId:string}>
}


export async function GET(
  req: Request,
  context:RouteContext
) {
  const {sizeId} = await context.params;
  try {
    if (!sizeId) {
      return new NextResponse("Size Id is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context:RouteContext
) {
  const {sizeId,storeId} = await context.params;
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name,value } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("Size Id is required", { status: 400 });
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

    const size = await prismadb.size.update({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: RouteContext
) {
  const {sizeId,storeId} = await context.params;
  try {
    const { userId } = await auth();

    // Check authentication
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Validate required parameters
    if (!sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
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

    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    if (!size) {
      return new NextResponse("Size not found", { status: 404 });
    }

    // Attempt to delete the billboard
    try {
      const deletedSize = await prismadb.size.delete({
        where: {
          id: sizeId,
        },
      });

      return NextResponse.json(deletedSize);
    } catch (error: any) {
      // Check for foreign key constraint error
      if (error.code === "P2003") {
        return new NextResponse(
          "Cannot delete the billboard. Make sure all related categories are removed first.",
          { status: 400 }
        );
      }

      // Log and return a generic error response
      console.error("[BILLBOARD_DELETE_PRISMA_ERROR]", error);
      return new NextResponse("Error deleting the billboard", { status: 500 });
    }
  } catch (error) {
    console.error("[SIZE_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

