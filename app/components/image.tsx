'use client'

import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import React, { useState } from 'react'
import { IoImageOutline } from "react-icons/io5";

const ImageComponent = () => {
    const getImages = useQuery(api.images.getImages);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const imagesPerPage = 6;

    // Filter images by search
    const filteredImages = getImages ? getImages.filter(img => img.name.toLowerCase().includes(search.toLowerCase())) : [];
    // Calculate paginated images
    const paginatedImages = filteredImages ? filteredImages.slice(page * imagesPerPage, (page + 1) * imagesPerPage) : [];
    const totalPages = filteredImages ? Math.ceil(filteredImages.length / imagesPerPage) : 0;

    // Loading state
    if (getImages === undefined) {
        return (
            <div className="max-w-6xl border-x mx-auto border-accent min-h-screen">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 md:px-8 py-6 sm:py-8">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} className="w-full h-full aspect-square rounded-md" />
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (filteredImages.length === 0) {
        return (
            <div className="max-w-6xl border-x mx-auto border-accent min-h-screen">
                <div className="flex justify-center py-4 px-4 sm:px-6 md:px-8">
                    <input
                        type="text"
                        placeholder="Search images..."
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                        className="w-full max-w-lg px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 bg-background border-gray-600 text-foreground"
                    />
                </div>
                <div className="flex flex-col items-center justify-center h-64">
                    <IoImageOutline className="text-gray-500 text-lg size-42" />
                    <p className="text-gray-500 text-lg">No images found. Start by uploading some photos!</p>
                </div>
            </div>
        );
    }
    return (
        <div className="max-w-6xl border-x mx-auto border-accent min-h-screen">
            <div className="flex justify-center py-4 px-4 sm:px-6 md:px-8">
                <input
                    type="text"
                    placeholder="Search images..."
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value);
                        setPage(0);
                    }}
                    className="w-full max-w-lg px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 bg-background border-gray-600 text-foreground"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 md:px-8">
                {paginatedImages.map((image) => (
                    <div key={image._id} className="border border-border rounded-md p-2 flex flex-col items-center bg-background">
                        <Image
                            src={image.url!}
                            alt={image.name}
                            width={350}
                            height={350}
                            className="rounded-md border border-border"
                        />
                        <div className="mt-2 text-center text-sm text-foreground break-all w-full">
                            {image.name}
                        </div>
                    </div>
                ))}
            </div>
            {/* Pagination Controls */}
            {filteredImages.length > imagesPerPage && (
                <div className="flex justify-center items-center gap-4 py-4">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span>Page {page + 1} of {totalPages}</span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        disabled={page >= totalPages - 1}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default ImageComponent
