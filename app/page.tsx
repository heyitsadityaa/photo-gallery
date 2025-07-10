'use client'

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const getImages = useQuery(api.images.getImages);

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
  if (getImages.length === 0) {
    return (
      <div className="max-w-6xl border-x mx-auto border-accent min-h-screen">
        <div className="flex items-center justify-center h-64">
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
          className="w-full max-w-xs px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 bg-background border-gray-600 text-foreground"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        {getImages?.map((image) => (
          <div key={image._id} className="">
            <Image
              src={image.url!}
              alt={image.name}
              width={350}
              height={350}
              className="rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
