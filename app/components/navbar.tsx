import React from "react";
import UploadButton from "./uploader-button";


export default function Navbar() {

    return (
        <nav className="w-full flex items-center max-w-6xl mx-auto justify-between px-6 py-4 border-b border-x border-accent">
            <div className="text-xl font-bold">Photo Gallery</div>
            <UploadButton />
        </nav>
    );
}
