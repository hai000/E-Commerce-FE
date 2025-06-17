'use client'
import React, {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {XCircleIcon} from "lucide-react";

export default function MultiImageUpload({
                                             files,
                                             setFiles,
                                         }: {
    files: File[];
    setFiles: (files: File[]) => void;
}) {
    const t = useTranslations()
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [previews, setPreviews] = useState<string[]>([]);
    useEffect(() => {
        if (!files || files.length === 0) {
            setPreviews([]);
        } else {
            setPreviews(files.map(file => URL.createObjectURL(file)));
        }
    }, [files]);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileList = Array.from(e.target.files);
            setFiles(fileList);
            setPreviews(fileList.map(file => URL.createObjectURL(file)));

        }
    };
    const handleDelete = (idx: number) => {
        const fileToDelete = files.filter((f, i) => i !== idx);
        setFiles(fileToDelete);
        setPreviews(previews => previews.filter((_, i) => i !== idx));
        if (fileToDelete.length === 0 && inputRef.current) {
            inputRef.current.value = "";
        }
    };
    const handleButtonClick = () => {
        inputRef.current?.click();
    };

    return (
        <>
            <Button variant={"outline"} onClick={handleButtonClick}>
                {t('Manage.Select Images')}
            </Button>
            <Input  style={{ display: "none" }} type="file" accept="image/*" multiple ref={inputRef} onChange={handleFileChange}  />
            <div style={{ display: "flex", gap: 8, margin: "16px 0" }}>
                {previews.map((src, idx) => (
                    <div key={src} style={{ position: "relative" }}>
                        <img src={src} alt={`Preview ${idx}`}/>
                        <Button onClick={() => handleDelete(idx)} className="w-0.5 h-6 absolute top-1 right-1 bg-transparent hover:bg-destructive">
                            <XCircleIcon/>
                        </Button>
                    </div>
                ))}
            </div>
        </>
    );
}