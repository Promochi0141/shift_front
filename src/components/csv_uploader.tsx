'use client';
import React, { useState, useEffect } from 'react';
import ParseCsv from "./parse_csv";
import { useRouter } from 'next/navigation';
import { CsvRes } from '../types/csvRes';
import Modal from 'react-modal';
const modalStyle: ReactModal.Styles = {
    overlay: {
        position: "fixed",
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


const CsvUploader: React.FC = () => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/shift_csv';
    const [file, setFile] = useState<File | null>(null);
    const [date, setDate] = useState<string>('');
    const [isDisabled, setIsDisabled] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (file && date) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [file, date]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDate(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsDisabled(true);
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const csv = e.target?.result;
                if (typeof csv === 'string') {
                    const rescsv: CsvRes[] = ParseCsv(csv, date);
                    console.log(rescsv);

                    if (rescsv.length > 0) {
                        try {
                            const response = await fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                },
                                body: JSON.stringify(rescsv),
                            });

                            const responseData = await response.json();
                            setMessage(responseData.message || '再ログインしてください');
                        } catch (error) {
                            console.error(error);
                            setMessage('エラー: ' + error);
                        } finally {
                            setIsDisabled(true);
                            setIsOpen(true);
                            setFile(null);
                            setDate('');
                        }
                    }
                }
            };
            reader.readAsText(file);
        }
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
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-auto space-y-6 bg-gray-800 p-8 rounded-lg shadow-lg">
                <label htmlFor="date" className="block mb-4 text-2xl font-bold text-cyan-300 text-left">
                    30分単位のシフト表提出フォーム
                </label>
                <div className="flex space-x-4 w-auto">
                    <select
                        onChange={handleDateChange}
                        id="date"
                        className="bg-gray-900 border border-cyan-500 text-cyan-300 text-lg rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-auto p-3 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <option defaultValue=''>日付を選んでください</option>
                        <option value={today}>テスト用({today})</option>
                        <option value="2024-11-22">11月22日</option>
                        <option value="2024-11-23">11月23日</option>
                        <option value="2024-11-24">11月24日</option>
                        <option value="2024-11-25">11月25日</option>
                    </select>
                    <input
                        required
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="text-cyan-300 bg-gray-900 border border-cyan-500 rounded-lg p-3 w-auto transition duration-300 ease-in-out transform hover:scale-105 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
                <input
                    type="submit"
                    value="送信"
                    className={`font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 ${isDisabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                        }`}
                    disabled={isDisabled}
                />
            </form>
        </>
    );
}

export default CsvUploader;