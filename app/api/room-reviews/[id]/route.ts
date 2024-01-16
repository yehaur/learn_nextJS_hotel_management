import { getRoomReviews } from "@/src/libs/apis";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const roomId = params.id;

    try {
        const roomReviews = await getRoomReviews(roomId);

        return NextResponse.json(roomReviews, { status: 200, statusText: 'Success in fetching reviews' });
    } catch (error) {
        console.log('Get reviews failed! ', error);
        return new NextResponse('Unable to fetch reviews', { status: 400 });
    }
}