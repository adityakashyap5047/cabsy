import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    
    try {
        const {firstName, lastName, email, password, phoneNumber} = await request.json();

        if(!firstName || !lastName || !email || !password || !phoneNumber){
            return NextResponse.json(
                {error: "All fields are required"},
                {status: 400}
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if(existingUser){
            return NextResponse.json(
                {error: "Email is already registered"},
                {status: 400}
            )
        }

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password,
                phoneNumber,
                isGuest: false
            }
        });

        return NextResponse.json(
            {message: "User registered successfully", user},
            {status: 201}
        );
    } catch {
        return NextResponse.json(
            {error: "Failed to register User"},
            {status: 500}
        );
    }
}