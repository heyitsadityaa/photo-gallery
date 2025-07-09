import React from "react";
import UploadButton from "./uploader-button";


export default function Navbar() {

    return (
        <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="text-xl font-bold">Photo Gallery</div>
            <UploadButton />
        </nav>
    );
}
