import { useState } from 'react'
import Papa from 'papaparse'

interface CsvUploaderProps {
    onFileData: (data: any[]) => void // Adjust the type as needed based on your CSV structure
}

const CsvUploader = ({ onFileData }: CsvUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event?.target?.files[0])
    }

    const handleFileUpload = () => {
        if (selectedFile) {
            Papa.parse(selectedFile, {
                header: true, // If your CSV has a header row
                dynamicTyping: true, // Attempts to convert values to their appropriate types
                skipEmptyLines: true,
                complete: (results) => {
                    onFileData(results.data) // Pass the parsed data back to the parent component
                },
                error: (error) => {
                    console.error('Error parsing CSV:', error)
                    // You can add more robust error handling here if needed
                },
            })
        }
    }

    return (
        <div>
            <input type='file' accept='.csv' onChange={handleFileChange} />
            <button onClick={handleFileUpload} disabled={!selectedFile}>
                Upload CSV
            </button>
        </div>
    )
}

export default CsvUploader
