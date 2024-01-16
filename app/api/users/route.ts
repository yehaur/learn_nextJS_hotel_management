import { checkReviewExists, createReview, getUserData, updateReview } from "@/src/libs/apis";
import { authOptions } from "@/src/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse('Authentication Required', { status: 500 });
    }

    const userId = session.user.id;

    try {
        const data = await getUserData(userId);
        return NextResponse.json(data, { status: 200, statusText: 'Succcessful' });
    } catch (error) {
        return new NextResponse("Unable to fetch", { status: 400 })
    }
}

export async function POST(req: Request, res: Response) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse('Authentication Required', { status: 500 });
    }

    const { roomId, reviewText, ratingValue } = await req.json();

    if (!roomId || !reviewText || !ratingValue) {
        return new NextResponse('RoomId, ReviewText, RatingValue fields all required', { status: 400 });
    }
    const userId = session.user.id;

    try {
        // check if exists
        const alreadyExists = await checkReviewExists(userId, roomId);

        let data;

        if (alreadyExists) {
            data = await updateReview({
                reviewId: alreadyExists._id,
                reviewText,
                userRating: ratingValue
            });
        } else {
            data = await createReview({
                hotelRoomId: roomId,
                reviewText,
                userId,
                userRating: ratingValue,
            });
        }

        return NextResponse.json(data, { status: 200, statusText: 'Successful editing review' });
    } catch (error: any) {
        console.log('Error updating!', error);
        return new NextResponse('Unable to create review', { status: 400 });
    }
}