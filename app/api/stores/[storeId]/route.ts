import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface RouteContext{
    params:Promise<{storeId:string}>
}

export async function PATCH (req:Request, 
    context:RouteContext
){
    try {
        const {storeId} = await context.params;
        const {userId} = await auth();
        const body = await req.json();
        const { name } = body;
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401} )
        }
        if(!name){
            return new NextResponse("Name is required", {status:400})
        }
        if(!storeId){
            return new NextResponse("storeId is required", {status:400})
        }

        const store = await prismadb.store.updateMany({
            where:{
                id:storeId,
                userId
            },
            data:{
                name
            }
        }) 
        return NextResponse.json(store);

    } catch (error) {
        console.log("[STORE_PATCH]", error); 
        return new NextResponse("Internal error", {status: 500});
    }
}




export async function DELETE (req:Request, 
    context:RouteContext
){
    try {
        const {storeId} = await context.params;
        const {userId} = await auth();
        
        if(!userId){
            return new NextResponse("Unauthenticated",{status:401} )
        }
        
        if(!storeId){
            return new NextResponse("storeId is required", {status:400})
        }

        const store = await prismadb.store.deleteMany({
            where:{
                id:storeId,
                userId
            }
        }) 
        return NextResponse.json(store);

    } catch (error) {
        console.log("[STORE_DELETE]", error); 
        return new NextResponse("Internal error", {status: 500});
    }
}