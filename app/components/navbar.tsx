"use client"

import React from "react";
import UploadButton from "./uploader-button";
import { redirect } from "next/navigation";


export default function Navbar() {

    return (
        <nav className="w-full flex items-center max-w-6xl mx-auto justify-between px-6 py-4 border-b border-x border-accent">
            <button onClick={() => redirect('/')} className="text-xl font-bold">Photo Gallery</button>
            <UploadButton />
        </nav>
    );
}
