'use client'
import React, {useRef, useState} from "react";
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
    const [previews, setPreviews] = useState<string[]>([]);//previews for images
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
    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (!files.length) return;
    //     // Gửi từng file lên server, hoặc gửi tất cả 1 lần nếu backend hỗ trợ
    //     const uploaded: string[] = [];
    //     for (const file of files) {
    //         const formData = new FormData();
    //         formData.append("file", file);
    //         const res = await fetch("/api/upload", {
    //             method: "POST",
    //             body: formData,
    //         });
    //         const data = await res.json();
    //         uploaded.push(data.imageUrl); // imageUrl là đường dẫn trả về từ API
    //     }
    //     setUploadedUrls(uploaded);
    // };

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