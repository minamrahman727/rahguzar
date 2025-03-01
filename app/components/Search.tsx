"use client";

import { useState, ChangeEvent, KeyboardEvent } from 'react';

interface SearchProps {
    onSearch?: (query: string) => void;
}

export default function Search({ onSearch }: SearchProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(searchTerm);
        }
    };

    return (
        <div className="p-6 text-center">
            <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Search routes..."
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
}