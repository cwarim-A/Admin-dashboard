// import prismadb from "@/lib/prismadb";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export const POST = async (req: Request) => {
//   try {
//     const { userId } = await auth();

//     const body = await req.json();

//     const { name } = body;

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }
//     if (!name) {
//       return new NextResponse("Name is required", { status: 400 });
//     }
//     const store = await prismadb.store.create({
//       data: {
//          name,
//         userId,
//       },
//     });
//     return NextResponse.json(store);
//   } catch (error) {
//     console.log("[STORES_POST]", error.message);
//     return new NextResponse(JSON.stringify({ error: "Internal error" }), {
//       status: 500,
//     });
//   }
// };

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name: name.trim(),
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORES_POST]", error);

    return new NextResponse(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
