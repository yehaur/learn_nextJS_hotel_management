import hotelRoom from "@/schemas/hotelRoom";
import { getRoom } from "@/src/libs/apis";
import { authOptions } from "@/src/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,
    {
        apiVersion: "2023-10-16",
    });

type RequestData = {
    checkinDate: string,
    checkoutDate: string,
    adults: number,
    children: number,
    noOfDays: number,
    hotelRoomSlug: string
};

export async function POST(req: Request, res: Response) {
    const {
        checkinDate,
        checkoutDate,
        adults,
        children,
        noOfDays,
        hotelRoomSlug }: RequestData = await req.json();

    if (!checkinDate || !checkoutDate || !adults || !hotelRoom || !hotelRoomSlug) {
        return new NextResponse("All fields are required", { status: 400 });
    }

    const origin = req.headers.get('origin');

    const session = await getServerSession(authOptions)
    if (!session) {
        return new NextResponse("Authentication required", { status: 400 });
    }

    const userId = session.user.id;
    const formattedCheckoutDate = checkoutDate.split('T')[0];
    const formattedCheckinDate = checkinDate.split('T')[0];

    try {
        const room = await getRoom(hotelRoomSlug);
        const discountPrice = room.price * (1.0 - room.discount / 100);
        const totalPrice = discountPrice * noOfDays;

        // Create payment session
        const stripeSession = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: room.name,
                            images: room.images.map(image => image.url),
                        },
                        unit_amount: parseInt((totalPrice * 100).toString()),
                    },
                },
            ],
            payment_method_types: ['card'],
            success_url: `${origin}/users/${userId}`,
            metadata: {
                adults,
                checkinDate: formattedCheckinDate,
                checkoutDate: formattedCheckoutDate,
                children,
                hotelRoom: room._id,
                noOfDays,
                user: userId,
                discount: room.discount,
                totalPrice
            }
        });

        return NextResponse.json(stripeSession, {
            status: 200,
            statusText: "Payment session created",
        });
    } catch (error: any) {
        console.log('Payment failed', error);
        return new NextResponse(error, { status: 500 });
    }
}