import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/AuthStore";
import Modal from "../components/Modal";

interface Game {
    gameId: number;
    title: string;
    description: string;
    price: number;
    diskSize: number;
    genres: string[];
    genreIds?: number[];
    imageUrl?: string;
}

interface GamesProps {
    searchQuery: string;
    priceRange: [number, number];
    genreIds: number[];
    refreshTrigger: number;
}

const Games: React.FC<GamesProps> = ({ searchQuery, priceRange, genreIds, refreshTrigger }) => {
    const [allGames, setAllGames] = useState<Game[]>([]);
    const [filteredGames, setFilteredGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { user, isAdmin, isAuthenticated } = useAuthStore();
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [isBuying, setIsBuying] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editGame, setEditGame] = useState<Game | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPrice, setEditPrice] = useState(0);
    const [editDiskSize, setEditDiskSize] = useState(0);
    const [editGenres, setEditGenres] = useState<string[]>([]);
    const [allGenres, setAllGenres] = useState<{genreId: number, genreName: string}[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    const getGames = async () => {
        setLoading(true);

        try {
            const response = await axios.get<Game[]>('http://localhost:8080/games', {
                params: {
                    username: user?.username || null
                }
            });

            const gamesWithGenreIds = response.data.map(game => ({
                ...game,
                genreIds: game.genreIds || []
            }));

            setAllGames(gamesWithGenreIds);
            setFilteredGames(gamesWithGenreIds);
            setError(null);
        } catch (err) {
            setError('Failed to fetch games');
            setAllGames([]);
            setFilteredGames([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getGames();
    }, [user, refreshTrigger]);

    useEffect(() => {
        if (allGames.length === 0) return;

        let filtered = [...allGames];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(game =>
                game.title.toLowerCase().includes(query)
            );
        }

        filtered = filtered.filter(game =>
            game.price >= priceRange[0] && game.price <= priceRange[1]
        );

        if (genreIds.length > 0) {
            filtered = filtered.filter(game => {
                if (!game.genreIds || !Array.isArray(game.genreIds)) {
                    return false;
                }

                return Array.isArray(game.genreIds) && genreIds.every(genreId => game.genreIds!.includes(genreId));
            });
        }

        setFilteredGames(filtered);
    }, [searchQuery, priceRange, genreIds, allGames]);

    const handleBuyGame = async () => {
        if (!selectedGame || !user) return;
        setIsBuying(true);

        try {
            await axios.post(`http://localhost:8080/games/buy/${selectedGame.gameId}`,
                { username: user.username },
                { withCredentials: true }
            );

            const updatedAllGames = allGames.filter(g => g.gameId !== selectedGame.gameId);
            setAllGames(updatedAllGames);
            setFilteredGames(prev => prev.filter(g => g.gameId !== selectedGame.gameId));

            const updatedCoins = user.coins - selectedGame.price;
            useAuthStore.getState().updateUserInfo({ coins: updatedCoins });

        } catch (err) {
            console.error("Failed to buy game", err);
        } finally {
            setIsBuying(false);
            setIsBuyModalOpen(false);
        }
    };

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:8080/genres');
                setAllGenres(response.data);
            } catch (err) {
                console.error("Failed to fetch genres", err);
            }
        };

        fetchGenres();
    }, []);

    const openEditModal = (game: Game) => {
        setEditGame(game);
        setEditTitle(game.title);
        setEditDescription(game.description || "");
        setEditPrice(game.price);
        setEditDiskSize(game.diskSize || 0);
        setEditGenres(game.genres || []);
        setIsEditModalOpen(true);
    };

    const handleDeleteGame = async () => {
        if (!selectedGame) return;
        setIsDeleting(true);

        try {
            await axios.delete(`http://localhost:8080/games/${selectedGame.gameId}`, {
                withCredentials: true
            });

            setAllGames(prev => prev.filter(g => g.gameId !== selectedGame.gameId));
            setFilteredGames(prev => prev.filter(g => g.gameId !== selectedGame.gameId));
        } catch (err) {
            console.error("Failed to delete game", err);
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const closeModal = () => {
        setSelectedGame(null);
        setIsBuyModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setEditGenres(selectedOptions);
    };

    const handleEditGame = async () => {
        if (!editGame) return;
        setIsEditing(true);

        try {
            const genreIds = editGenres.map(genreName => {
                const genre = allGenres.find(g => g.genreName === genreName);
                return genre ? genre.genreId : null;
            }).filter(id => id !== null);

            const response = await axios.put(
                `http://localhost:8080/games/${editGame.gameId}`,
                {
                    title: editTitle,
                    description: editDescription,
                    price: editPrice,
                    diskSize: editDiskSize,
                    genres: editGenres
                },
                { withCredentials: true }
            );

            const updatedGame = response.data;
            setAllGames(prev =>
                prev.map(g => g.gameId === editGame.gameId ? updatedGame : g)
            );
            setFilteredGames(prev =>
                prev.map(g => g.gameId === editGame.gameId ? updatedGame : g)
            );
        } catch (err) {
            console.error("Failed to update game", err);
        } finally {
            setIsEditing(false);
            setIsEditModalOpen(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-full text-red-500">Error: {error}</div>;

    return (
        <>
            {filteredGames.length === 0 ? (
                <div className="text-center py-8 col-span-full">
                    No games found matching your criteria
                </div>
            ) : (
                filteredGames.map(game => (
                    <div
                        key={game.gameId}
                        className="min-w-52 max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
                    >
                        <Link to={`/games/${game.title}`} state={{ game }}>
                            <img
                                className="rounded-t-lg w-full h-72 object-fill"
                                src={game.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/No_Preview_image_2.png/1024px-No_Preview_image_2.png"}
                                alt={game.title}
                            />
                        </Link>
                        <div className="p-5 h-40 flex flex-col justify-between">
                            <Link to={`/games/${game.title}`} state={{ game }}>
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {game.title}
                                </h5>
                            </Link>
                            <div className="mb-2 text-sm overflow-hidden text-gray-500 dark:text-gray-300">
                                {game.genres.join(", ")}
                            </div>
                            <div className="flex justify-between gap-3">
                                {isAuthenticated && (
                                    <button
                                        onClick={() => {
                                            setSelectedGame(game);
                                            setIsBuyModalOpen(true);
                                        }}
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
                                    >
                                        ${game.price.toFixed(2)}
                                    </button>
                                )}
                                {isAdmin && (
                                    <div>
                                        <button
                                            onClick={() => openEditModal(game)}
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedGame(game);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}

            <Modal
                isOpen={isBuyModalOpen}
                onClose={closeModal}
                onConfirm={handleBuyGame}
                title={`Buy ${selectedGame?.title}?`}
                confirmLabel="Yes, buy"
                cancelLabel="Cancel"
                loading={isBuying}
            >
                <p>Are you sure you want to buy {selectedGame?.title} for ${selectedGame?.price}?</p>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={closeModal}
                onConfirm={handleDeleteGame}
                title={`Delete ${selectedGame?.title}?`}
                confirmLabel="Yes, delete"
                cancelLabel="Cancel"
                loading={isDeleting}
            >
                <p>This will permanently remove the game from the system.</p>
            </Modal>
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onConfirm={handleEditGame}
                title={`Edit ${editGame?.title}`}
                confirmLabel="Save changes"
                cancelLabel="Cancel"
                loading={isEditing}
            >
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            rows={3}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Price ($)
                        </label>
                        <input
                            type="number"
                            value={editPrice}
                            step="0.01"
                            min="0"
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (!isNaN(value)) {
                                    setEditPrice(parseFloat(value.toFixed(2)));
                                } else {
                                    setEditPrice(0);
                                }
                            }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Disk Size (GB)
                        </label>
                        <input
                            type="number"
                            value={editDiskSize}
                            step="0.1"
                            min="0"
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (!isNaN(value)) {
                                    setEditDiskSize(parseFloat(value.toFixed(1)));
                                } else {
                                    setEditDiskSize(0);
                                }
                            }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Genres
                        </label>
                        <select
                            multiple
                            value={editGenres}
                            onChange={handleGenreChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            size={4}
                        >
                            {allGenres.map(genre => (
                                <option key={genre.genreId} value={genre.genreName}>
                                    {genre.genreName}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Hold Ctrl (or Cmd) to select multiple genres
                        </p>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Games;
