'use client';

import { getRoom } from "@/src/libs/apis";
import useSWR from "swr";
import LoadingSpinner from "../../loading";
import HotelPhotoGallery from "@/src/components/HotelPhotoGallery/HotelPhotoGallery";
import axios from "axios";
import { MdOutlineCleaningServices } from "react-icons/md";
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import { MdMedicalInformation } from "react-icons/md";
import { MdOutlineSmokeFree } from "react-icons/md";
import BookRoomCta from "@/src/components/BookRoomCta/BookRoomCta";
import { useState } from "react";
import toast from "react-hot-toast";
import { getStripe } from "@/src/libs/stripe";
import RoomReview from "@/src/components/RoomReview/RoomReview";

const RoomDetails = (props: { params: { slug: string } }) => {
    const {
        params: { slug },
    } = props;

    const [checkinDate, setCheckinDate] = useState<Date | null>(null);
    const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);

    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    const fetchRoom = async () => getRoom(slug)
    const { data: room, error, isLoading } = useSWR("/api/room", fetchRoom)

    if (error) throw new Error('Cannot fetch room data!');
    if (typeof room === "undefined" && !isLoading)
        throw new Error('Cannot fetch room data!');

    if (!room) return <LoadingSpinner />;

    const calcMinCheckoutDate = () => {
        if (checkinDate) {
            const nextDay = new Date(checkinDate);
            nextDay.setDate(nextDay.getDate() + 1);
            return nextDay;
        }
        return null;
    }

    const calcNumDays = () => {
        if (!checkinDate || !checkoutDate) return 0;
        const diff = checkoutDate.getTime() - checkinDate.getTime();
        const noOfDays = Math.ceil(diff / (24 * 3600 * 1000));
        return noOfDays;
    };

    const handleBookNowClick = async () => {
        if (!checkinDate || !checkoutDate)
            return toast.error("Please specify check-in & check-out date.");

        if (checkinDate > checkoutDate)
            return toast.error("Please choose a valid staying period");

        const noOfDays = calcNumDays();
        const hotelRoomSlug = room.slug.current;

        const stripe = await getStripe();
        // Integrate Stripe
        try {
            const { data: stripeSession } = await axios.post('/api/stripe', {
                checkinDate,
                checkoutDate,
                adults,
                children,
                noOfDays,
                hotelRoomSlug,
            });

            if (stripe) {
                const result = await stripe.redirectToCheckout({
                    sessionId: stripeSession.id,
                });

                if (result.error) {
                    toast.error("Payment failed!")
                }
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error("An error occured in payment process")
        }
    };

    return (
        <div>
            <HotelPhotoGallery photos={room.images} />

            <div className="container mx-auto mt-20">
                <div className="md:grid md:grid-cols-12 gap-10 px-3">
                    <div className="md:col-span-8 md:w-full">
                        <div>
                            <h2 className="font-bold text-left text-lg md:text-2xl">
                                {room.name} ({room.dimension})
                            </h2>
                            <div className="flex my-11">
                                {room.offerdAmenities?.map(amenity => (
                                    <div
                                        key={amenity._key}
                                        className="md:w-44 w-fit text-center px-2 md:px-0 h-20 md:h-40 mr-3 bg-[#eff0f2] dark:bg-gray-800 rounded-lg grid place-content-center">
                                        <i className="{`fa-solid ${amenity.icon} md:text-2xl`}"></i>
                                        <p className="text-xs md:text-base pt-3">
                                            {amenity.amenity}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mb-11">
                                <h2 className="font-bold text-3xl mb-2">Description</h2>
                                <p>{room.description}</p>
                            </div>
                            <div className="mb-11">
                                <h2 className="font-bold text-3xl mb-2">Safty and Hygiene</h2>
                                <div className="grid grid-cols-2">
                                    <div className="flex items-center my-1 md:my-0">
                                        <MdOutlineCleaningServices />
                                        <p className="ml-2 md:text-base text-xs">Daily Cleaning</p>
                                    </div>
                                    <div className="flex items-center my-1 md:my-0">
                                        <MdOutlineLocalFireDepartment />
                                        <p className="ml-2 md:text-base text-xs">Fire Extinguisher</p>
                                    </div>
                                    <div className="flex items-center my-1 md:my-0">
                                        <MdMedicalInformation />
                                        <p className="ml-2 md:text-base text-xs">Medical Care</p>
                                    </div>
                                    <div className="flex items-center my-1 md:my-0">
                                        <MdOutlineSmokeFree />
                                        <p className="ml-2 md:text-base text-xs">No Smoking</p>
                                    </div>
                                </div>
                            </div>
                            <div className="shadow dark:shadow-white rounded-lg p-6">
                                <div className="items-center mb-4">
                                    <p className="md:text-lg font-semibold">Customer Reviews</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <RoomReview roomId={room._id} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-4 rounded-xl shadow-lg dark:shadow dark:shadow-white sticky top-10 h-fit overflow-auto">
                        <BookRoomCta
                            discount={room.discount}
                            price={room.price}
                            specialNote={room.specialNote}
                            checkinDate={checkinDate}
                            setCheckinDate={setCheckinDate}
                            checkoutDate={checkoutDate}
                            setCheckoutDate={setCheckoutDate}
                            calcMinCheckoutDate={calcMinCheckoutDate}
                            adults={adults}
                            children={children}
                            setAdults={setAdults}
                            setChildren={setChildren}
                            isBooked={room.isBooked}
                            handleBookNowClick={handleBookNowClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;