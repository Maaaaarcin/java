import { useEffect, useState } from "react";
import useAuthStore from "../stores/AuthStore";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import axios from "axios";

interface User {
    username: string;
    coins: number;
    createdAt: string;
}

function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editUsername, setEditUsername] = useState("");
    const [editCoins, setEditCoins] = useState(0);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { isAdmin, isLoading, user, setUser } = useAuthStore();

    useEffect(() => {
        fetch("http://localhost:8080/users")
            .then(res => res.json())
            .then((data: User[]) => setUsers(data))
            .catch(err => console.error("Failed to fetch users:", err));
    }, []);

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setEditUsername(user.username);
        setEditCoins(user.coins);
        setModalType("edit");
        setIsModalOpen(true);
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setModalType("delete");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    const handleEditConfirm = async () => {
        if (!selectedUser) return;
        setIsDeleting(true);

        try {
            await axios.put(
                `http://localhost:8080/user/${selectedUser.username}`,
                {
                    username: editUsername,
                    coins: editCoins
                },
                { withCredentials: true }
            );

            const { user, setUser } = useAuthStore.getState();

            if (selectedUser.username === user?.username) {
                setUser({
                    ...user,
                    username: editUsername,
                    coins: editCoins,
                });
            }

            setUsers(prev =>
                prev.map(u =>
                    u.username === selectedUser.username
                        ? { ...u, username: editUsername, coins: editCoins }
                        : u
                )
            );
        } catch (err) {
            console.error("Failed to update user", err);
        } finally {
            setIsDeleting(false);
            closeModal();
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        setIsDeleting(true);

        try {
            await axios.delete(`http://localhost:8080/user/${selectedUser.username}`, {
                withCredentials: true
            });
            setUsers(prev => prev.filter(u => u.username !== selectedUser.username));
        } catch (err) {
            console.error("Failed to delete user", err);
        } finally {
            setIsDeleting(false);
            closeModal();
        }
    };

    return (
        <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead
                            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">$</th>
                            <th scope="col" className="px-6 py-3">Created At</th>
                            {isAdmin && (
                                <th scope="col" className="px-6 py-3">Options</th>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user, index) => (
                            <tr
                                key={index}
                                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                    <Link to={`/library/${user.username}`}>
                                        {user.username}
                                    </Link>
                                </th>
                                <td className="px-6 py-4">{user.coins.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    {new Date(user.createdAt).toLocaleString()}
                                </td>
                                {isAdmin && (
                                    <td className="px-6 py-4">
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(user)}
                                                className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            No users found.
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={modalType === "edit" ? handleEditConfirm : handleDelete}
                title={modalType === "edit" ? `Edit ${selectedUser?.username}` : `Delete ${selectedUser?.username}?`}
                confirmLabel={modalType === "edit" ? "Save changes" : "Yes, delete"}
                cancelLabel="Cancel"
                loading={isDeleting}
            >
                {modalType === "edit" && (
                    <div className="flex flex-col gap-1">
                        <input
                            type="text"
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            className="bg-gray-50 border-b outline-none border-gray-300 text-gray-900 w-full p-2.5 dark:bg-gray-700 dark:border-b dark:border-gray-600 dark:text-white"
                            placeholder="Username"
                        />
                        <input
                            type="number"
                            value={editCoins}
                            step="0.01"
                            min="0"
                            max="10000"
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (!isNaN(value)) {
                                    setEditCoins(parseFloat(value.toFixed(2)));
                                } else {
                                    setEditCoins(0);
                                }
                            }}
                            className="scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 bg-gray-50 border-b outline-none border-gray-300 text-gray-900 w-full p-2.5 dark:bg-gray-700 dark:border-b dark:border-gray-600 dark:text-white"
                            placeholder="$"
                        />
                    </div>
                )}
                {modalType === "delete" && (
                    <p className="text-gray-600 dark:text-gray-300">
                        This will permanently remove the user from the system.
                    </p>
                )}
            </Modal>
        </section>
    );
}

export default UsersPage;
