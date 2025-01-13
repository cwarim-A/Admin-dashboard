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
  {params}:{params:Promise<{storeId:string; colorId:string}>}
) {
  const {colorId,storeId} = await params;
  try {
    if (!colorId) {
      return addCorsHeaders(new NextResponse("Color Id is required", { status: 400 }));
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      },
    });
    return addCorsHeaders(NextResponse.json(color));
  } catch (error) {
    console.log("[COLOR_GET]", error);
    return addCorsHeaders(new NextResponse("Internal error", { status: 500 }));
  }
}

export async function PATCH(
  req: Request,
  {params}:{params:Promise<{storeId:string; colorId:string}>}
) {
  try {
    const { userId } = await auth();
    const {colorId,storeId} = await params;
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
    if (!colorId) {
      return addCorsHeaders(new NextResponse("Color Id is required", { status: 400 }));
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

    const color = await prismadb.color.update({
      where: {
        id: colorId,
      },
      data: {
        name,
        value,
      },
    });
    return addCorsHeaders(NextResponse.json(color));
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return addCorsHeaders(new NextResponse("Internal error", { status: 500 }));
  }
}

export async function DELETE(
  req: Request,
  {params}:{params:Promise<{storeId:string; colorId:string}>}
) {
  try {
    const { userId } = await auth();
    const {colorId,storeId} = await params;

    // Check authentication
    if (!userId) {
      return addCorsHeaders(new NextResponse("Unauthenticated", { status: 401 }));
    }

    // Validate required parameters
    if (!colorId) {
      return addCorsHeaders(new NextResponse("Color ID is required", { status: 400 }));
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

    const color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      },
    });

    if (!color) {
      return addCorsHeaders(new NextResponse("Color not found", { status: 404 }));
    }

    // Attempt to delete the billboard
    try {
      const deletedColor = await prismadb.color.delete({
        where: {
          id: colorId,
        },
      });

      return addCorsHeaders(NextResponse.json(deletedColor));
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
    console.error("[BILLBOARD_DELETE]", error);
    return addCorsHeaders(new NextResponse("Internal server error", { status: 500 }));
  }
}

