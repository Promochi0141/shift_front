'use client';
import React from 'react';
import CsvUploader from '@/src/components/csv_uploader';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    return (
        // /admin/detailへのリンクボタンを追加
        // ボタンを押すと/admin/detailに遷移する
        <button className="mt-6 ml-70p focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={() => router.push('/admin/detail')}>シフトの詳細情報を入れる</button>
        <div className="w-auto min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 flex rounded-lg shadow-lg w-auto max-w-md">
                <CsvUploader />
            </div>
        </div>
    );
};

export default Page;