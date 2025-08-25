'use client'

import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import React, { useState } from 'react'
import { IoImageOutline } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";
import { useMutation } from 'convex/react';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';

const ImageComponent = () => {
    const getImages = useQuery(api.images.getImages);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const imagesPerPage = 6;
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const deleteImage = useMutation(api.images.deleteImage);

    // Filter images by search
    const filteredImages = getImages ? getImages.filter(img => img.name.toLowerCase().includes(search.toLowerCase())) : [];
    // Calculate paginated images
    const paginatedImages = filteredImages ? filteredImages.slice(page * imagesPerPage, (page + 1) * imagesPerPage) : [];
    const totalPages = filteredImages ? Math.ceil(filteredImages.length / imagesPerPage) : 0;

    const handleDelete = async (id: string, storageId: string) => {
        setDeletingId(id);
        try {
            await deleteImage({ id: id as Id<'images'>, storageId: storageId as Id<'_storage'> });
            toast.success("Image deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete image. Please try again.");
            console.log("error", error);
        } finally {
            setDeletingId(null);
        }
    };

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
                        placeholder="Search images"
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
                    placeholder="Search images"
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
                    <div key={image._id} className="border border-border rounded-md p-2 flex flex-col items-center bg-background relative group">
                        <Image
                            priority
                            src={image.url!}
                            alt={image.name}
                            width={350}
                            height={350}
                            className="rounded-md border border-border"
                        />
                        <button
                            className="absolute top-2 right-2 p-2 m-2 rounded-full bg-background border border-border text-red-500 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                            onClick={() => handleDelete(image._id, image.body)}
                            disabled={deletingId === image._id}
                            title="Delete image"
                        >
                            {deletingId === image._id ? (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                            ) : (
                                <FiTrash2 className="h-5 w-5" />
                            )}
                        </button>
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
