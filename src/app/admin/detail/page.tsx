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
            {/* /adminへのハイパーリンクボタンを置く */}
            <button className="mt-6 ml-70p focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={() => { router.push('/admin') }}>戻る</button>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".csv" onChange={handleFileChange} />
                <button type="submit">アップロード</button>
            </form>
        </>
    );
};

export default Page;