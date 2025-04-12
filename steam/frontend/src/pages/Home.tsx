import {useEffect, useState} from "react";
import Games from "../components/Games";
import StoreFilters from "../components/StoreFilters";
import GameSearchBar from "../components/GameSearchBar";
import useAuthStore from "../stores/AuthStore";
import axios from "axios";
import Modal from "../components/Modal";

interface Genre {
    genreId: number;
    genreName: string;
}

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const { isAdmin } = useAuthStore();
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [genreIds, setGenreIds] = useState<number[]>([]);
    const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
    const [refreshGamesTrigger, setRefreshGamesTrigger] = useState(0);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newGame, setNewGame] = useState({
        title: "",
        description: "",
        price: 0,
        diskSize: 0,
        genres: [] as number[]
    });

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

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handlePriceRangeChange = (min: number, max: number) => {
        setPriceRange([min, max]);
    };

    const handleGenresChangeNewGame = (genreId: number) => {
        setNewGame((prevGame) => {
            const newGenres = prevGame.genres.includes(genreId)
                ? prevGame.genres.filter((id) => id !== genreId)
                : [...prevGame.genres, genreId];
            return { ...prevGame, genres: newGenres };
        });
    };

    const handleGenresChange = (ids: number[]) => {
        setGenreIds(ids);
    };

    const handleAddGameModalClose = () => {
        setIsAddGameModalOpen(false);
        setNewGame({
            title: "",
            description: "",
            price: 0,
            diskSize: 0,
            genres: []
        });
    };

    const handleAddGameSubmit = async () => {
        const formData = new FormData();

        formData.append("title", newGame.title);
        formData.append("description", newGame.description);
        formData.append("price", newGame.price.toString());
        formData.append("diskSize", newGame.diskSize.toString());

        if (newGame.genres.length > 0) {
            formData.append("genres", newGame.genres.join(","));
        }

        try {
            await axios.post("http://localhost:8080/games", formData, {
                withCredentials: true,
            });
            setRefreshGamesTrigger(prev => prev + 1);
            handleAddGameModalClose();
        } catch (error) {
            console.error("Failed to add game", error);
        }
    };

    return (
        <>
            <button data-drawer-target="separator-sidebar" data-drawer-toggle="separator-sidebar"
                    aria-controls="separator-sidebar" type="button"
                    className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd"
                          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0=1.5H2.75A.75.75 0 012 10z">
                    </path>
                </svg>
            </button>

            <div className="flex">
                <StoreFilters
                    onPriceRangeChange={handlePriceRangeChange}
                    onGenresChange={handleGenresChange}
                />

                <div className="p-4">
                    <div className="flex flex-column gap-4">
                        <GameSearchBar onSearch={handleSearch} />
                        {isAdmin && (
                            <button
                                onClick={() => setIsAddGameModalOpen(true)}
                                type="button"
                                className="h-14 focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700"
                            >
                                Add Game
                            </button>
                        )}
                    </div>
                    <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Games
                                searchQuery={searchQuery}
                                priceRange={priceRange}
                                genreIds={genreIds}
                                refreshTrigger={refreshGamesTrigger}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isAddGameModalOpen}
                onClose={handleAddGameModalClose}
                onConfirm={handleAddGameSubmit}
                title="Add New Game"
                confirmLabel="Add Game"
                cancelLabel="Cancel"
            >
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={newGame.title}
                        onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                        className="bg-gray-50 border-b outline-none border-gray-300 text-gray-900 w-full p-2.5 dark:bg-gray-700 dark:border-b dark:border-gray-600 dark:text-white"
                        placeholder="Title"
                    />
                    <textarea
                        value={newGame.description}
                        onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                        className="bg-gray-50 border-b outline-none border-gray-300 text-gray-900 w-full p-2.5 dark:bg-gray-700 dark:border-b dark:border-gray-600 dark:text-white"
                        placeholder="Description"
                    />
                    <input
                        type="number"
                        value={newGame.price}
                        onChange={(e) => setNewGame({ ...newGame, price: parseFloat(e.target.value) })}
                        className="bg-gray-50 border-b outline-none border-gray-300 text-gray-900 w-full p-2.5 dark:bg-gray-700 dark:border-b dark:border-gray-600 dark:text-white"
                        placeholder="Price"
                    />
                    <input
                        type="number"
                        value={newGame.diskSize}
                        onChange={(e) => setNewGame({ ...newGame, diskSize: parseFloat(e.target.value) })}
                        className="bg-gray-50 border-b outline-none border-gray-300 text-gray-900 w-full p-2.5 dark:bg-gray-700 dark:border-b dark:border-gray-600 dark:text-white"
                        placeholder="Disk Size"
                    />
                    <div className="h-32 overflow-auto grid grid-cols-2 gap-2">
                        <span className="text-lg font-semibold col-span-2">Genres</span>
                        {genres.map((genre) => (
                            <div key={genre.genreId} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={newGame.genres.includes(genre.genreId)}
                                    onChange={() => handleGenresChangeNewGame(genre.genreId)}
                                />
                                <label className="ml-2">{genre.genreName}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default Home;
