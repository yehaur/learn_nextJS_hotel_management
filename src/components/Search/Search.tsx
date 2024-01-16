'use client';

import { useRouter } from "next/router";
import { ChangeEvent, FC } from "react";
import { useEffect, useState } from "react";

type Props = {
    roomTypeFilter: string;
    searchQuery: string;
    setRoomTypeFilter: (value: string) => void;
    setSearchQuery: (value: string) => void;
};

const Search: FC<Props> = ({
    roomTypeFilter,
    searchQuery,
    setRoomTypeFilter,
    setSearchQuery,
}) => {
    // const router = useRouter();
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const handleRoomTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setRoomTypeFilter(event.target.value);
    };

    const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        if (shouldRedirect) {
            // Automatically redirect when the component mounts
            window.location.href = `/rooms?roomType=${roomTypeFilter}&searchQuery=${searchQuery}`;
        }
        setShouldRedirect(false);
    }, [shouldRedirect, roomTypeFilter, searchQuery]);
    const handleFilterClick = () => {
        // router.push(`/rooms?roomType=${roomTypeFilter}&searchQuery=${searchQuery}`);
        setShouldRedirect(true);
    };

    return (
        <section className="bg-tertiary-light px-4 py-6 rounded-lg">
            <div className="container mx-auto flex gap-4 flex-wrap justify-between items-center">
                <div className="w-full md:1/3 lg:w-auto mb-4 md:mb-0">
                    <label className="block text-sm font-medium mb-2 text-black">
                        Room Types
                    </label>
                    <div className="relative">
                        <select
                            value={roomTypeFilter}
                            onChange={handleRoomTypeChange}
                            className="w-full px-4 py-2 capitalize rounded leading-tight dark:bg-black focus:outline-none">
                            <option value='All'>All</option>
                            <option value='Basic'>Basic</option>
                            <option value='Luxury'>Luxury</option>
                            <option value='Suite'>Suite</option>
                        </select>
                    </div>
                </div>

                <div className="w-full md:1/3 lg:w-auto mb-4 md:mb-0">
                    <label className="block text-sm font-medium mb-2 text-black">
                        Search
                    </label>
                    <input
                        type='search'
                        id='search'
                        placeholder='Search...'
                        className="w-full px-4 py-3 rounded leading-tight dark:bg-black focus:outline-none placeholder:text-black dark:placeholder:text-white"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                    />
                </div>

                <button
                    className="btn-primary"
                    type='button'
                    onClick={handleFilterClick}
                >
                    Search
                </button>
            </div>
        </section>
    );
}

export default Search;