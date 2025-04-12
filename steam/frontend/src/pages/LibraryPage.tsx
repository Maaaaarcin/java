import React, { useEffect, useState } from "react";
import useAuthStore from "../stores/AuthStore";
import { Link, useParams } from "react-router-dom";
import Modal from "../components/Modal";
import axios from "axios";
import GameSearchBar from "../components/GameSearchBar";

interface Game {
    userLibraryId: number;
    username: string;
    gameId: number;
    title: string;
    price: number;
    image: string;
    description: string;
    genres: string[];
}

function LibraryPage() {
    const [allGames, setAllGames] = useState<Game[]>([]);
    const [filteredGames, setFilteredGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const { isLoading, user, updateUserInfo, isAuthenticated } = useAuthStore();
    const { username } = useParams<{ username: string }>();
    const [modalType, setModalType] = useState<"delete" | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [isReturning, setIsReturning] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const openReturnModal = (game: Game) => {
        setSelectedGame(game);
        setModalType("delete");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedGame(null);
        setIsModalOpen(false);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (!query) {
            setFilteredGames(allGames);
            return;
        }

        const lowercaseQuery = query.toLowerCase();
        const filtered = allGames.filter(game =>
            game.title.toLowerCase().includes(lowercaseQuery) ||
            game.genres.some(genre => genre.toLowerCase().includes(lowercaseQuery))
        );

        setFilteredGames(filtered);
    };

    useEffect(() => {
        if (!username) return;
        setLoading(true);

        fetch(`http://localhost:8080/library/${username}`)
            .then((res) => res.json())
            .then((data: Game[]) => {
                setAllGames(data);
                setFilteredGames(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch games:", err);
                setLoading(false);
            });
    }, [username]);

    const handleReturn = async () => {
        if (!selectedGame || !user) return;
        setIsReturning(true);

        try {
            await axios.delete(`http://localhost:8080/library/${user.username}/${selectedGame.gameId}`, {
                withCredentials: true
            });

            const updatedGames = allGames.filter(g => g.userLibraryId !== selectedGame.userLibraryId);
            setAllGames(updatedGames);
            setFilteredGames(prev => prev.filter(g => g.userLibraryId !== selectedGame.userLibraryId));

            const updatedUser = { ...user, coins: user.coins + selectedGame.price };
            updateUserInfo(updatedUser);
        } catch (err) {
            console.error("Failed to return game", err);
        } finally {
            setIsReturning(false);
            closeModal();
        }
    };

    if (loading || isLoading) {
        return <div className="mx-auto flex justify-center items-center pt-6 px-4 2xl:px-0">Loading...</div>;
    }

    return (
        <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                {(allGames.length > 0 &&
                    <GameSearchBar onSearch={handleSearch} />
                )}

                {filteredGames.length === 0 ? (
                    <div className="flex justify-center mt-8">
                        {searchQuery ?
                            "No games found matching your search" :
                            "No games in your library"
                        }
                    </div>
                ) : (
                    <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredGames.map((game) => (
                            <div
                                key={game.userLibraryId}
                                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                            >
                                <Link to={`/games/${game.title}`} state={{ game }}>
                                    <img className="rounded-t-lg w-full h-72 object-fill"
                                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/No_Preview_image_2.png/1024px-No_Preview_image_2.png"
                                         alt={game.title} />
                                </Link>
                                <div className="p-3 h-40 flex flex-col justify-around">
                                    <Link to={`/games/${game.title}`} state={{ game }}>
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                            {game.title}
                                        </h5>
                                    </Link>

                                    <div className="mb-2 text-sm scrollbar-none overflow-auto text-gray-500 dark:text-gray-300">
                                        {game.genres.join(", ")}
                                    </div>

                                    {isAuthenticated && user && user.username === username && (
                                        <div className="flex items-center justify-between gap-4">
                                            <p className="text-xl font-extrabold leading-tight text-gray-900 dark:text-white">
                                                ${game.price}
                                            </p>
                                                <button
                                                    onClick={() => openReturnModal(game)}
                                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                >
                                                    Return
                                                </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleReturn}
                title={`Return ${selectedGame?.title}?`}
                confirmLabel={"Yes, return"}
                cancelLabel="Cancel"
                loading={isReturning}
            >
                <p>Are you sure you want to return {selectedGame?.title}?</p>
                <p>You will be refunded ${selectedGame?.price}.</p>
            </Modal>
        </section>
    );
}

export default LibraryPage;
