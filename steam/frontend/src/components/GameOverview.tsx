import React, {useEffect, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import axios from "axios";
import useAuthStore from "../stores/AuthStore";
import Modal from "./Modal";

interface Game {
    gameId: number;
    price: number;
    title: string;
    description: string;
    diskSize: number;
    genres: string[];
}

function GameOverview() {
    const location = useLocation();
    const {title} = useParams<{ title: string }>();
    const [game, setGame] = useState<Game | null>(location.state?.game || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {isAuthenticated, user} = useAuthStore();

    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [isBuying, setIsBuying] = useState(false);

    const getGame = async () => {
        if (!title) {
            setError("Invalid game title");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get<Game>(
                `http://localhost:8080/games/${title}`,
                {withCredentials: isAuthenticated}
            );
            setGame(response.data);
            setError(null);
        } catch (error) {
            setError("Failed to fetch game or access denied");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(game)
        if (!game) {
            getGame();
        }
    }, [game, title]);

    const handleBuyGame = async () => {
        if (!selectedGame || !user) return;
        setIsBuying(true);

        try {
            await axios.post(`http://localhost:8080/games/buy/${selectedGame.gameId}`,
                { username: user.username },
                { withCredentials: true }
            );

            const updatedCoins = user.coins - selectedGame.price;
            useAuthStore.getState().updateUserInfo({ coins: updatedCoins });

        } catch (err) {
            console.error("Failed to buy game", err);
        } finally {
            setIsBuying(false);
            setIsBuyModalOpen(false);
        }
    };

    const closeModal = () => {
        setSelectedGame(null);
        setIsBuyModalOpen(false);
    };

    if (loading) return <div className="text-center text-gray-500">Loading...</div>;
    if (error || !game) return <div className="text-center text-gray-500">Game not found.</div>;

    return (
        <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 justify-items-center">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                    {/*<div className="lg:grid lg:grid-cols-1 max-w-xl lg:gap-8 xl:gap-16">*/}
                    <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                        <img className="w-full hidden dark:block"
                             src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/No_Preview_image_2.png/1024px-No_Preview_image_2.png" alt={game.title}/>
                    </div>

                    <div className="mt-6 sm:mt-8 lg:mt-0">
                        <h1
                            className="text-xl font-bold text-gray-900 sm:text-3xl dark:text-white"
                        >
                            {game.title}
                        </h1>

                        <div className="my-6">
                            <div className="mt-2 flex flex-wrap gap-2">
                                {game.genres.map((genre, index) => (
                                    <p
                                        key={index}
                                        className="text-white mt-4 sm:mt-0 bg-primary-700  focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark focus:outline-none dark:focus:ring-primary-800 flex items-center justify-center"
                                    >
                                        {genre}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <h2 className="text-xl">Description: </h2>
                        <p className="mb-6 text-gray-500 dark:text-gray-400 text-justify">
                            {game.description}
                        </p>

                        <h2 className="text-xl">Disk size: </h2>
                        <p className="mb-6 text-gray-500 dark:text-gray-400 text-justify">
                            {game.diskSize} GB
                        </p>

                        <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800"/>

                        {isAuthenticated && (
                            <>
                                <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                                    <p
                                        className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white"
                                    >
                                        {game.price.toFixed(2)} $
                                    </p>
                                </div>
                                <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
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
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
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
        </section>
    );
}

export default GameOverview;