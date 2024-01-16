import { createBooking, updateHotelRoom } from "@/src/libs/apis";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const checkout_session_completed = 'checkout.session.completed';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,
    {
        apiVersion: "2023-10-16",
    });

export async function POST(req: Request, res: Response) {
    const reqBody = await req.text();
    const sig = req.headers.get("stripe-signature")
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret) return;
        event = stripe.webhooks.constructEvent(reqBody, sig, webhookSecret);
    } catch (error: any) {
        console.log(`ERRRRRRR: $(error)`);
        return new NextResponse(`Webhook error: ${error.message}`, { status: 500 });
    }

    // load event
    switch (event.type) {
        case checkout_session_completed:
            const session = event.data.object;

            const {
                //@ts-ignore
                metadata: {
                    adults,
                    checkinDate,
                    checkoutDate,
                    children,
                    hotelRoom,
                    noOfDays,
                    user,
                    discount,
                    totalPrice,
                },
            } = session;

            await createBooking({
                adults: Number(adults),
                checkinDate,
                checkoutDate,
                children: Number(children),
                hotelRoom,
                noOfDays: Number(noOfDays),
                discount: Number(discount),
                totalPrice: Number(totalPrice),
                user,
            });

            await updateHotelRoom(hotelRoom);

            return NextResponse.json('Booking successful', {
                status: 200,
                statusText: 'Booking Succeed',
            });

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json('Events received', {
        status: 200,
        statusText: 'Events received',
    });
}