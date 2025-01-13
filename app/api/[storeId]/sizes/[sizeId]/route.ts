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
  {params}:{params:Promise<{sizeId:string}>}
) {
  const {sizeId} = await params;
  try {
    if (!sizeId) {
      return addCorsHeaders(new NextResponse("Size Id is required", { status: 400 }));
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    });
    return addCorsHeaders(NextResponse.json(size));
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return addCorsHeaders(new NextResponse("Internal error", { status: 500 }));
  }
}

export async function PATCH(
  req: Request,
  {params}:{params:Promise<{storeId:string; sizeId:string}>}
) {
  const {sizeId,storeId} = await params;
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name,value } = body;
    if (!userId) {
      return addCorsHeaders(new NextResponse("Unauthenticated", { status: 401 }));
    }
    if (!name) {
      return addCorsHeaders(new NextResponse("Name is required", { status: 400 }));
    }
    if (!value) {
      return addCorsHeaders(new NextResponse("Value is required", { status: 400 }));
    }
    if (!sizeId) {
      return addCorsHeaders(new NextResponse("Size Id is required", { status: 400 }));
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

    const size = await prismadb.size.update({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value,
      },
    });
    return addCorsHeaders(NextResponse.json(size));
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return addCorsHeaders(new NextResponse("Internal error", { status: 500 }));
  }
}

export async function DELETE(
  req: Request,
  {params}:{params:Promise<{storeId:string; sizeId:string}>}
) {
  const {sizeId,storeId} = await params;
  try {
    const { userId } = await auth();

    // Check authentication
    if (!userId) {
      return addCorsHeaders(new NextResponse("Unauthenticated", { status: 401 }));
    }

    // Validate required parameters
    if (!sizeId) {
      return addCorsHeaders(new NextResponse("Size ID is required", { status: 400 }));
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

    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    if (!size) {
      return addCorsHeaders(new NextResponse("Size not found", { status: 404 }));
    }

    // Attempt to delete the billboard
    try {
      const deletedSize = await prismadb.size.delete({
        where: {
          id: sizeId,
        },
      });

      return addCorsHeaders(NextResponse.json(deletedSize));
    } catch (error: any) {
      // Check for foreign key constraint error
      if (error.code === "P2003") {
        return addCorsHeaders(new NextResponse(
          "Cannot delete the billboard. Make sure all related categories are removed first.",
          { status: 400 }
        ));
      }

      // Log and return a generic error response
      console.error("[BILLBOARD_DELETE_PRISMA_ERROR]", error);
      return addCorsHeaders(new NextResponse("Error deleting the billboard", { status: 500 }));
    }
  } catch (error) {
    console.error("[SIZE_DELETE]", error);
    return addCorsHeaders(new NextResponse("Internal server error", { status: 500 }));
  }
}

