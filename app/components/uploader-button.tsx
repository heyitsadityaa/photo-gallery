'use client'

import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";
import Image from "next/image";

const UploadButton = () => {
    const [open, setOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop: (acceptedFiles) => {
            console.log(acceptedFiles);
        },
        multiple: false,
        accept: { 'image/*': [] },
    });

    useEffect(() => {
        if (acceptedFiles.length > 0) {
            setSelectedImage(acceptedFiles[0]);
        }
    }, [acceptedFiles]);

    const generateUploadUrl = useMutation(api.images.generateUploadUrl);
    const addImage = useMutation(api.images.addImage);

    const handleAddImage = async () => {
        try {
            setIsUploading(true);
            const uploadUrl = await generateUploadUrl();

            const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": selectedImage!.type },
                body: selectedImage,
            });

            const json = await result.json();
            if (!result.ok) {
                throw new Error(`Upload failed: ${JSON.stringify(json)}`);
            }
            const { storageId } = json;

            // Validate storageId
            if (!storageId || storageId === "") {
                throw new Error("Upload failed: No storage ID returned");
            }

            await addImage({
                name: selectedImage!.name,
                storageId: storageId as Id<"_storage">
            });
            toast.success("Uploaded successfully");
            setSelectedImage(null);
            setOpen(false);
        } catch (error) {
            toast.error("Upload failed");
            console.log("error", error);

        } finally {
            setIsUploading(false);
        }


    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600 transition-colors"
                    type="button"
                >
                    Add Image
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Add Image</DialogTitle>
                <DialogDescription>Add the image you want to upload</DialogDescription>
                {acceptedFiles.length === 0 && (
                    <div
                        {...getRootProps()}
                        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 mt-4 mb-2 text-center cursor-pointer transition-colors bg-background hover:bg-lime-50 dark:hover:bg-lime-900/20 ${isDragActive ? 'border-lime-500 bg-lime-100 dark:bg-lime-950' : 'border-gray-300'}`}
                    >
                        <input {...getInputProps()} />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto mb-4 h-16 w-16 text-lime-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                        <p className="text-lg font-semibold mb-1">
                            {isDragActive ? 'Drop the image here ...' : 'Drag & drop an image here'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            or <span className="underline text-lime-600 cursor-pointer">click to select</span> from your device
                        </p>
                    </div>
                )}
                {acceptedFiles.length > 0 && (
                    <div className="mt-4">
                        <div
                            {...getRootProps()}
                            className={`flex flex-col items-center gap-2 border-2 border-dashed rounded-xl transition-colors w-full cursor-pointer ${isDragActive ? 'border-lime-500 bg-lime-100 dark:bg-lime-950' : 'border-transparent'}`}
                        >
                            <input {...getInputProps()} />
                            <Image
                                src={URL.createObjectURL(acceptedFiles[0])}
                                alt={acceptedFiles[0].name}
                                className="w-20 h-20 object-cover rounded border mb-2"
                            />
                            <div className="text-base text-green-600 font-medium mb-2">
                                {acceptedFiles[0].name}
                            </div>
                            {isDragActive && (
                                <div className="absolute inset-0 flex items-center justify-center bg-lime-100 bg-opacity-80 rounded-xl">
                                    <span className="text-lime-700 font-semibold">Drop to replace image</span>
                                </div>
                            )}
                        </div>

                        {/* Upload button outside the dropzone */}
                        <div className="flex justify-center mt-4">
                            <button
                                className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                onClick={handleAddImage}
                                disabled={isUploading}
                            >
                                {isUploading && (
                                    <FaSpinner className="animate-spin" />
                                )}
                                Upload
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default UploadButton
