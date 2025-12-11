"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Upload, X, Crop as CropIcon } from "lucide-react";

interface ImageUploadProps {
    value?: string | null;
    onChange: (base64: string | null) => void;
    aspectRatio?: number;
    minWidth?: number;
    maxWidth?: number;
    className?: string;
    placeholder?: React.ReactNode;
    label?: string;
    variant?: "avatar" | "cover";
}

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: "%",
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

export function ImageUpload({
    value,
    onChange,
    aspectRatio = 1,
    minWidth = 150,
    maxWidth = 500,
    className = "",
    placeholder,
    label = "Changer l'image",
    variant = "avatar",
}: ImageUploadProps) {
    const [imgSrc, setImgSrc] = useState<string>("");
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [isOpen, setIsOpen] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                alert("L'image ne doit pas dépasser 5MB");
                return;
            }
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImgSrc(reader.result?.toString() || "");
                setIsOpen(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const onImageLoad = useCallback(
        (e: React.SyntheticEvent<HTMLImageElement>) => {
            const { width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspectRatio));
        },
        [aspectRatio]
    );

    const getCroppedImg = useCallback(() => {
        if (!imgRef.current || !completedCrop) return;

        const image = imgRef.current;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // Calculate output dimensions respecting max width
        let outputWidth = completedCrop.width * scaleX;
        let outputHeight = completedCrop.height * scaleY;

        if (outputWidth > maxWidth) {
            const ratio = maxWidth / outputWidth;
            outputWidth = maxWidth;
            outputHeight = outputHeight * ratio;
        }

        if (outputWidth < minWidth) {
            const ratio = minWidth / outputWidth;
            outputWidth = minWidth;
            outputHeight = outputHeight * ratio;
        }

        canvas.width = outputWidth;
        canvas.height = outputHeight;

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            outputWidth,
            outputHeight
        );

        const base64 = canvas.toDataURL("image/jpeg", 0.9);
        onChange(base64);
        setIsOpen(false);
        setImgSrc("");
        setCrop(undefined);
        setCompletedCrop(undefined);
    }, [completedCrop, maxWidth, minWidth, onChange]);

    const handleRemove = () => {
        onChange(null);
    };

    const containerClass = variant === "avatar"
        ? "relative h-24 w-24 rounded-full overflow-hidden bg-muted cursor-pointer group"
        : "relative h-32 w-full rounded-xl overflow-hidden bg-muted cursor-pointer group";

    return (
        <>
            <div className={className}>
                <div
                    className={containerClass}
                    onClick={() => inputRef.current?.click()}
                >
                    {value ? (
                        <>
                            <img
                                src={value}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        inputRef.current?.click();
                                    }}
                                >
                                    <CropIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove();
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                            {placeholder || (
                                <>
                                    <Upload className="h-6 w-6 mb-1" />
                                    <span className="text-xs">{label}</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                    className="hidden"
                />
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Recadrer l&apos;image</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center">
                        {imgSrc && (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspectRatio}
                                circularCrop={variant === "avatar"}
                                className="max-h-[400px]"
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop"
                                    src={imgSrc}
                                    onLoad={onImageLoad}
                                    className="max-h-[400px]"
                                />
                            </ReactCrop>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Annuler
                        </Button>
                        <Button onClick={getCroppedImg} disabled={!completedCrop}>
                            Appliquer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
