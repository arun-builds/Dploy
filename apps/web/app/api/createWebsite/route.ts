import { prisma } from "@repo/database";
import axios from "axios";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";



export async function POST(request: Request) {

    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })

    const userId = session?.user.id

    const body = await request.json()

    const repoUrl = body.repoUrl

    

    if (!userId || !repoUrl) {
        return new Response("User ID and Repository URL are required", { status: 400 });
    }
    try {
        const response = await axios.post(`${BACKEND_URL}/deploy`, { userId: userId, repoUrl: repoUrl })
        
            return NextResponse.json({ domainId: response.data })
        
    }catch (error) {
        console.error(error)
        return new Response("Internal Server Error", { status: 500 });
    }
}