'use client'

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const getImages = useQuery(api.images.getImages) || [];

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
