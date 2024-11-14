'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsModalOpen(true);
            localStorage.removeItem('token');
        }
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        router.push('/login');
    };

    return (
        <>
            <header className="bg-gray-100 text-gray-600 body-font">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                    <nav className="flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto font-bold">
                        <a href="/admin" className="mr-5 hover:text-gray-900">時間割</a>
                        <a href="/admin/detail" className="mr-5 hover:text-gray-900">仕事情報</a>
                    </nav>
                </div>
            </header>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Timeout Modal"
                style={modalStyle}
            >
                <h2>ログインしてください</h2>
                <button className="mt-6 ml-70p focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={handleCloseModal}>OK</button>
            </Modal>
            {/* childrenを表示 */}
            {children}
        </>
    );
};

export default Layout;