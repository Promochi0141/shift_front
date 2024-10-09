'use client';
import React from 'react';
import CsvUploader from '@/src/components/csv_uploader';

const Page = () => {
    return (
        <div className="w-auto min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 flex rounded-lg shadow-lg w-auto max-w-md">
                <CsvUploader />
            </div>
        </div>
    );
};

export default Page;