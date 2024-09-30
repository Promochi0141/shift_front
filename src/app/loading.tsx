import React from 'react';

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            <p className="mt-4 text-lg text-gray-700">now loading</p>
        </div>
    );
}