import React, { useState, useEffect } from "react";
import axios from "axios";

interface Genre {
    genreId: number;
    genreName: string;
}

interface StoreFiltersProps {
    onPriceRangeChange: (min: number, max: number) => void;
    onGenresChange: (genres: number[]) => void;
    initialMinPrice?: number;
    initialMaxPrice?: number;
    initialGenres?: number[];
}

function StoreFilters({
                          onPriceRangeChange,
                          onGenresChange,
                          initialMinPrice = 0,
                          initialMaxPrice = 100,
                          initialGenres = []
                      }: StoreFiltersProps) {
    const [minPrice, setMinPrice] = useState<number>(initialMinPrice);
    const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>(initialGenres);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get<Genre[]>("http://localhost:8080/genres");
                setGenres(response.data);
            } catch (error) {
                console.error("Failed to fetch genres:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        const newMinPrice = Math.min(value, maxPrice);
        setMinPrice(newMinPrice);
        onPriceRangeChange(newMinPrice, maxPrice);
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        const newMaxPrice = Math.max(value, minPrice);
        setMaxPrice(newMaxPrice);
        onPriceRangeChange(minPrice, newMaxPrice);
    };

    const handleGenreChange = (genreId: number) => {
        setSelectedGenres(prev => {
            const newGenres = prev.includes(genreId)
                ? prev.filter(id => id !== genreId)
                : [...prev, genreId];

            onGenresChange(newGenres);
            return newGenres;
        });
    };

    const handleClearFilters = () => {
        setMinPrice(initialMinPrice);
        setMaxPrice(initialMaxPrice);
        setSelectedGenres([]);
        onPriceRangeChange(initialMinPrice, initialMaxPrice);
        onGenresChange([]);
    };

    return (
        <aside id="separator-sidebar"
               className="sticky left-0 min-w-64 transition-transform -translate-x-full sm:translate-x-0"
               aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto rounded-br-3xl bg-gray-50 dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    <li>
                        <div className="flex items-center justify-between p-2 text-gray-900 rounded-lg dark:text-white">
                            <div className="flex items-center">
                                <i className='bx bxs-filter-alt'></i>
                                <span className="ms-3 font-bold text-lg">Filters</span>
                            </div>
                            <button
                                onClick={handleClearFilters}
                                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Clear All
                            </button>
                        </div>
                    </li>
                    <li>
                        <div className="p-2 text-gray-900 rounded-lg dark:text-white">
                            <div className="flex items-center mb-2">
                                <svg
                                    className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400"
                                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                    viewBox="0 0 18 18">
                                    <path
                                        d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap font-semibold">Price Range</span>
                            </div>
                            <div className="px-3 py-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Min: ${minPrice}</span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Max: ${maxPrice}</span>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="min-price" className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                                        Minimum Price
                                    </label>
                                    <input
                                        id="min-price"
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={minPrice}
                                        onChange={handleMinPriceChange}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="max-price" className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                                        Maximum Price
                                    </label>
                                    <input
                                        id="max-price"
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={maxPrice}
                                        onChange={handleMaxPriceChange}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                    <li>
                        <div className="p-2 text-gray-900 dark:text-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <svg
                                        className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400"
                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                        viewBox="0 0 17 20">
                                        <path
                                            d="M7.958 19.393a7.7 7.7 0 0 1-6.715-3.439c-2.868-4.832 0-9.376.944-10.654l.091-.122a3.286 3.286 0 0 0 .765-3.288A1 1 0 0 1 4.6.8c.133.1.313.212.525.347A10.451 10.451 0 0 1 10.6 9.3c.5-1.06.772-2.213.8-3.385a1 1 0 0 1 1.592-.758c1.636 1.205 4.638 6.081 2.019 10.441a8.177 8.177 0 0 1-7.053 3.795Z"/>
                                    </svg>
                                    <span className="ms-3 font-semibold">Genres</span>
                                </div>
                                {selectedGenres.length > 0 && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {selectedGenres.length} selected
                                    </span>
                                )}
                            </div>
                            {loading ? (
                                <div className="text-center py-2">Loading genres...</div>
                            ) : (
                                <div className="px-3 space-y-2 max-h-60 overflow-y-auto">
                                    {genres.map(genre => (
                                        <div key={genre.genreId} className="flex items-center">
                                            <input
                                                id={`genre-${genre.genreId}`}
                                                type="checkbox"
                                                checked={selectedGenres.includes(genre.genreId)}
                                                onChange={() => handleGenreChange(genre.genreId)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label
                                                htmlFor={`genre-${genre.genreId}`}
                                                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                {genre.genreName}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </li>
                </ul>
            </div>
        </aside>
    );
}

export default StoreFilters;