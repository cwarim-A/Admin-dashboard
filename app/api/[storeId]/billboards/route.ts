// import prismadb from "@/lib/prismadb";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";


// const addCorsHeaders = (res) => {
//   res.headers.set("Access-Control-Allow-Origin", "*");
//   res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   return res;
// };


// export const POST = async (
//   req: Request,
//   {params}:{ params:  { billboardId: string,storeId:string } }
// ) => {
//   try {
//     const { userId } = await auth();
//     const {storeId,billboardId} =  params;

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 401 });
//     }

//     const body = await req.json();
//     const { label, imageUrl } = body;

//     if (!label) {
//       return new NextResponse("label is required", { status: 400 });
//     }

//     if (!imageUrl) {
//       return new NextResponse("Image URL is required", { status: 400 });
//     }
//     if (!storeId) {
//       return new NextResponse("Store ID is required", { status: 400 });
//     }

//     const storeByUser = await prismadb.store.findFirst({
//       where: {
//         id: storeId,
//         userId,
//       },
//     });
//     if (!storeByUser) {
//       return new NextResponse("Unauthorized", { status: 403 });
//     }

//     const billboard = await prismadb.billboard.create({
//       data: {
//         label: label.trim(),
//         imageUrl,
//         storeId: storeId,
//       },
//     });

//     return NextResponse.json(billboard);
//   } catch (error) {
//     console.log("[BILLBOARD_POST]", error);

//     return new NextResponse(JSON.stringify({ error: "Internal error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// };

// export const GET = async (
//   req: Request,
//   {params}:{ params: Promise< { storeId:string }> }
// ) => {
//   const {storeId} = await params
//   try {
//     if (!storeId) {
//       return new NextResponse("Store ID is required", { status: 400 });
//     }

//     const storeByUser = await prismadb.store.findFirst({
//       where: {
//         id: storeId,
//       },
//     });
//     if (!storeByUser) {
//       return new NextResponse("Unauthorized", { status: 403 });
//     }

//     const billboards = await prismadb.billboard.findMany({
//       where: {
//         storeId: storeId,
//       },
//     });

//     return NextResponse.json(billboards);
//   } catch (error) {
//     console.log("[BILLBOARD_POST]", error);

//     return new NextResponse(JSON.stringify({ error: "Internal error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// };

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Utility to add CORS headers
const addCorsHeaders = (res:Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
};

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ billboardId: string; storeId: string }> }
) => {
  try {
    const { userId } = await auth();
    const { storeId, billboardId } = await params;

    if (!userId) {
      return addCorsHeaders(new NextResponse("Unauthenticated", { status: 401 }));
    }

    const body = await req.json();
    const { label, imageUrl } = body;

    if (!label) {
      return addCorsHeaders(new NextResponse("label is required", { status: 400 }));
    }

    if (!imageUrl) {
      return addCorsHeaders(new NextResponse("Image URL is required", { status: 400 }));
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

    const billboard = await prismadb.billboard.create({
      data: {
        label: label.trim(),
        imageUrl,
        storeId: storeId,
      },
    });

    return addCorsHeaders(NextResponse.json(billboard));
  } catch (error) {
    console.log("[BILLBOARD_POST]", error);

    return addCorsHeaders(
      new NextResponse(JSON.stringify({ error: "Internal error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    );
  }
};

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) => {
  try {
    const { storeId } = await params;

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

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: storeId,
      },
    });

    return addCorsHeaders(NextResponse.json(billboards));
  } catch (error) {
    console.log("[BILLBOARD_POST]", error);

    return addCorsHeaders(
      new NextResponse(JSON.stringify({ error: "Internal error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    );
  }
};

