import { prisma } from "@repo/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get("domainId");
    console.log("from serverdomainId:", domainId);
    
    if (!domainId) {
        return new Response("Domain ID is required", { status: 400 });
    }
    try {
        const website = await prisma.website.findUnique({
            where: {
                domainId: domainId
            }
        })
        return NextResponse.json(website);
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}