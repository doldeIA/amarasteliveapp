import React, { useState, useRef } from 'react';
import UploadIcon from './icons/UploadIcon';

interface UploadBoxProps {
    onUpload: (file: File) => void;
}

const UploadBox: React.FC<UploadBoxProps> = ({ onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (file && file.type === 'audio/wav') {
            onUpload(file);
        } else {
            alert("Por favor, envie apenas arquivos .wav");
        }
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
         // Reset file input to allow uploading the same file again
        if(e.target){
            e.target.value = '';
        }
    };

    const onBoxClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div 
            onClick={onBoxClick}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative flex flex-col items-center justify-center h-48 p-6 rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer w-full max-w-lg
            ${isDragging ? 'border-accent bg-accent/20 scale-105' : 'border-accent/40 hover:border-accent hover:bg-accent/10'}`}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept=".wav"
                className="hidden"
            />
            <div className="text-center text-accent/70">
                <UploadIcon className="w-10 h-10 mx-auto mb-2" />
                <p className="font-semibold">Clique ou arraste um arquivo .WAV</p>
            </div>
        </div>
    );
};

export default UploadBox;