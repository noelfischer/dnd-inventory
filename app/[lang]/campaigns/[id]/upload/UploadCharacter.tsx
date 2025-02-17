'use client'
import { Dictionary } from "@/app/[lang]/dictionaries";
import { Button } from "@/components/ui/button";
import { ExportCharacter, ExportCharacterSchema } from "@/lib/definitions";
import { cn, handleFileUpload } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

function UploadCharacter({ postCharacter, dict }: { postCharacter: (character: ExportCharacter) => void, dict: Dictionary }) {
    const [exportCharacter, setExportCharacter] = useState<ExportCharacter | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: File = e.target.files![0];
        processFile(file);
    }

    const processFile = async (file: File) => {
        if (file.type !== 'application/json') {
            setError(dict.uploadCharacter.invalidFileType);
            return;
        }
        const object = await handleFileUpload(file);
        try {
            const formattedObject = ExportCharacterSchema.parse(object)
            setError(null);
            setExportCharacter(formattedObject);
            setFileName(file.name);
            console.log("Input: ", formattedObject);
        } catch (error) {
            setError(dict.uploadCharacter.invalidFormat);
        }
    }

    const uploadCharacter = async () => {
        setLoading(true);
        postCharacter(exportCharacter!);
    }


    return (
        <main>
            <div>
                <p className="mb-1 text-gray-900 dark:text-gray-400 text-xl">{dict.uploadCharacter.description}</p>
                <p className="mb-8 text-gray-700 dark:text-gray-400 text-sm">{dict.uploadCharacter.description2}</p>
                <div className="flex items-center"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => e.preventDefault()}
                    onDragLeave={handleDragLeave} >
                    <label htmlFor="dropzone-file" className={cn("flex flex-col items-center justify-center px-16 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600",
                        isDragging && "dark:bg-gray-800 dark:bg-gray-700 bg-gray-100 dark:border-gray-600 dark:border-gray-500 dark:bg-gray-600"
                    )}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">{dict.uploadCharacter.input}</span> {dict.uploadCharacter.drag}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">JSON</p>
                        </div>
                        <input id="dropzone-file" type="file" accept=".json" onChange={handleFileSelection} className="hidden" />
                    </label>
                </div>
                {error &&
                    <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
                }
                {exportCharacter && !error &&
                    <>
                        <p className="mt-8 font-bold text-gray-700 dark:text-gray-400">{fileName}</p>
                        <Button onClick={uploadCharacter} className="mt-4" disabled={loading}>
                            {loading && <LoaderCircle className='animate-spin mr-3' />}
                            {dict.uploadCharacter.title}</Button>
                    </>
                }
            </div>
        </main>
    );
}

export default UploadCharacter;