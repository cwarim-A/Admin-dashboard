// import prismadb from "@/lib/prismadb";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// // Utility to add CORS headers
// const addCorsHeaders = (res:Response) => {
//   res.headers.set("Access-Control-Allow-Origin", "*");
//   res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   return res;
// };


// export async function GET(
//   req: Request,
//   { params }: { params: Promise< { billboardId: string }>}
//   // context: { params: { billboardId: string } } 
// ) {
  
//   // const {billboardId} =   context.params as { billboardId: string };;
//   const {billboardId} = await params;

//   try {
//     if (!billboardId) {
//       return addCorsHeaders(new NextResponse("Billboard Id is required", { status: 400 }));
//     }

//     const billboard = await prismadb.billboard.findUnique({
//       where: {
//         id: billboardId,
//       },
//     });
//     return addCorsHeaders(NextResponse.json(billboard));
//   } catch (error) {
//     console.log("[BILLBOARD_GET]", error);
//     return addCorsHeaders(new NextResponse("Internal error", { status: 500 }));
//   }
// }

// export async function PATCH(
//   req: Request,
//   {params}:{ params: Promise< { billboardId: string,storeId:string }> } 
// ) {
//   try {
//     const { userId } = await auth();
//     const {storeId,billboardId} =  await params 
//     const body = await req.json();
//     const { label, imageUrl } = body;
//     if (!userId) {
//       return addCorsHeaders(new NextResponse("Unauthenticated", { status: 401 }));
//     }
//     if (!label) {
//       return addCorsHeaders(new NextResponse("Label is required", { status: 400 }));
//     }
//     if (!imageUrl) {
//       return addCorsHeaders(new NextResponse("Image URl is required", { status: 400 }));
//     }
//     if (billboardId) {
//       return addCorsHeaders(new NextResponse("Billbiard Id is required", { status: 400 }));
//     }

//     const storeByUser = await prismadb.store.findFirst({
//       where: {
//         id: storeId,
//         userId,
//       },
//     });
//     if (!storeByUser) {
//       return addCorsHeaders(new NextResponse("Unauthorized", { status: 403 }));
//     }

//     const billboard = await prismadb.billboard.update({
//       where: {
//         id: billboardId,
//       },
//       data: {
//         label,
//         imageUrl,
//       },
//     });
//     return addCorsHeaders(NextResponse.json(billboard));
//   } catch (error) {
//     console.log("[BILLBOARD_PATCH]", error);
//     return addCorsHeaders(new NextResponse("Internal error", { status: 500 }));
//   }
// }

// export async function DELETE(
//   req: Request,
//  {params}:{params:Promise<{billboardId:string,storeId:string}>}
// ) {
//   try {
//     const { userId } = await auth();
//     const {billboardId,storeId} = await params 

//     // Check authentication
//     if (!userId) {
//       return addCorsHeaders(new NextResponse("Unauthenticated", { status: 401 }));
//     }

//     // Validate required parameters
//     if (!billboardId) {
//       return addCorsHeaders(new NextResponse("Billboard ID is required", { status: 400 }));
//     }

//     // Check if the store belongs to the user
//     const storeByUser = await prismadb.store.findFirst({
//       where: {
//         id: storeId,
//         userId,
//       },
//     });

//     if (!storeByUser) {
//       return addCorsHeaders(new NextResponse("Unauthorized", { status: 403 }));
//     }

//     const billboard = await prismadb.billboard.findUnique({
//       where: {
//         id: billboardId,
//       },
//     });

//     if (!billboard) {
//       return addCorsHeaders(new NextResponse("Billboard not found", { status: 404 }));
//     }

//     // Attempt to delete the billboard
//     try {
//       const deletedBillboard = await prismadb.billboard.delete({
//         where: {
//           id:billboardId,
//         },
//       });

//       return addCorsHeaders(NextResponse.json(deletedBillboard));
//     } catch (error: any) {
//       // Check for foreign key constraint error
//       if (error.code === "P2003") {
//         return addCorsHeaders(new NextResponse(
//           "Cannot delete the billboard. Make sure all related categories are removed first.",
//           { status: 400 }
//         ));
//       }

//       // Log and return a generic error response
//       console.error("[BILLBOARD_DELETE_PRISMA_ERROR]", error);
//       return addCorsHeaders(new NextResponse("Error deleting the billboard", { status: 500 }));
//     }
//   } catch (error) {
//     console.error("[BILLBOARD_DELETE]", error);
//     return addCorsHeaders(new NextResponse("Internal server error", { status: 500 }));
//   }
// }

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Utility to add CORS headers
const addCorsHeaders = (res: Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
};



export async function GET(
  req: Request,
  { params }: { params: Promise<{ billboardId: string }> }
) {
  const { billboardId } = await params;

  try {
    if (!billboardId) {
      return addCorsHeaders(new NextResponse("Billboard Id is required", { status: 400 }));
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });
    return addCorsHeaders(NextResponse.json(billboard));
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return addCorsHeaders(new NextResponse("Internal error", { status: 500 }));
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ billboardId: string; storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, billboardId } = await params;
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) {
      return addCorsHeaders(new NextResponse("Unauthenticated", { status: 401 }));
    }
    if (!label) {
      return addCorsHeaders(new NextResponse("Label is required", { status: 400 }));
    }
    if (!imageUrl) {
      return addCorsHeaders(new NextResponse("Image URL is required", { status: 400 }));
    }
    if (!billboardId) {
      return addCorsHeaders(new NextResponse("Billboard Id is required", { status: 400 }));
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

    const billboard = await prismadb.billboard.update({
      where: {
        id: billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });
    return addCorsHeaders(NextResponse.json(billboard));
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return addCorsHeaders(new NextResponse("Internal error", { status: 500 }));
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ billboardId: string; storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { billboardId, storeId } = await params;

    if (!userId) {
      return addCorsHeaders(new NextResponse("Unauthenticated", { status: 401 }));
    }

    if (!billboardId) {
      return addCorsHeaders(new NextResponse("Billboard ID is required", { status: 400 }));
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

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    if (!billboard) {
      return addCorsHeaders(new NextResponse("Billboard not found", { status: 404 }));
    }

    try {
      const deletedBillboard = await prismadb.billboard.delete({
        where: {
          id: billboardId,
        },
      });

      return addCorsHeaders(NextResponse.json(deletedBillboard));
    } catch (error: any) {
      if (error.code === "P2003") {
        return addCorsHeaders(
          new NextResponse(
            "Cannot delete the billboard. Make sure all related categories are removed first.",
            { status: 400 }
          )
        );
      }

      console.error("[BILLBOARD_DELETE_PRISMA_ERROR]", error);
      return addCorsHeaders(new NextResponse("Error deleting the billboard", { status: 500 }));
    }
  } catch (error) {
    console.error("[BILLBOARD_DELETE]", error);
    return addCorsHeaders(new NextResponse("Internal server error", { status: 500 }));
  }
}
