import { auth } from "@/lib/auth";
import { prisma } from "@repo/database";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })

    const userId = session?.user.id

    if (!userId) {
        return new Response("User ID is required", { status: 400 });
    }
    try {
        
        const websites = await prisma.website.findMany({
            where: {
                userId: userId
            }
        })
        return NextResponse.json(websites)
    } catch (error) {
        console.error(error)
        return new Response("Internal Server Error", { status: 500 });
    }
}