'use client'

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
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 rounded-md aspect-square w-full"></div>
            </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        {getImages?.map((image) => (
          <div key={image._id} className="">
            <Image
              src={image.url || ''}
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
