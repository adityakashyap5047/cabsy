import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    
    try {
        const {firstName, lastName, email, password, phoneNumber} = await request.json();

        if(!firstName || !lastName || !email || !password || !phoneNumber){
            return NextResponse.json(
                {message: "All fields are required"},
                {status: 400}
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if(existingUser){
            return NextResponse.json(
                {message: "Email is already registered"},
                {status: 400}
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phoneNumber,
                isGuest: false
            }
        });

        return NextResponse.json(
            {message: "User registered successfully", user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }},
            {status: 201}
        );
    } catch {
        return NextResponse.json(
            {message: "Failed to register User"},
            {status: 500}
        );
    }
}