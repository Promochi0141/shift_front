'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from 'react-modal';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/details_csv';
const modalStyle: ReactModal.Styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.85)"
    },
    content: {
        position: "relative",
        textAlign: "center",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
        maxWidth: "30rem",
        backgroundColor: "white",
        borderRadius: "1rem",
        padding: "1.5rem"
    }
};

const Page: React.FC = () => {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\r\n');
            const data = lines.slice(1).filter(line => {
                const [id, name, url, place] = line.split(',');
                return id && name && url && place;
            })
                .map(line => {
                    const [id, name, url, place] = line.split(',');
                    return { id: Number(id), name, url, place };
                });
            console.log(data);

            try {
                const response = await fetch(backendUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(data)
                });

                const responseData = await response.json();
                setMessage(responseData.message);
                setIsOpen(true);
            } catch (error) {
                console.error('データ送信エラー:', error);
                setMessage('エラー:' + error);
                setIsOpen(true);
            }
        };
        reader.readAsText(file, 'UTF-8');
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                contentLabel="CsvUploader Modal"
                style={modalStyle}
            >
                <h1>{message}</h1>
                <button className="mt-6 ml-70p focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={() => { setIsOpen(false); router.push('/login'); localStorage.removeItem('token') }}>OK</button>
            </Modal>
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-800 p-4">
                <div className="bg-gray-700 flex flex-col items-center rounded-lg shadow-lg w-full max-w-md p-6 border border-cyan-500">
                    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full space-y-4">
                        <input
                            required
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="text-cyan-300 bg-gray-800 border border-cyan-500 rounded-lg p-3 w-full transition duration-300 ease-in-out transform hover:scale-105 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <button
                            type="submit"
                            className="font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 bg-cyan-500 hover:bg-cyan-600 text-white"
                        >
                            アップロード
                        </button>
                    </form>
                </div>
            </div>

        </>
    );
};

export default Page;