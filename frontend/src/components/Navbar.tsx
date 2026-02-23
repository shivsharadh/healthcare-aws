"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold">
                            Healthcare Platform
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {!loading && (
                            <>
                                {user ? (
                                    <>
                                        <Link href="/dashboard" className="px-3 py-2 rounded-md hover:bg-blue-700">
                                            Dashboard
                                        </Link>
                                        <div className="flex items-center space-x-2 bg-blue-700 px-3 py-1.5 rounded-full">
                                            <UserIcon size={16} />
                                            <span className="text-sm font-medium">{user.username} ({user.role})</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-1 hover:text-red-200 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="px-3 py-2 rounded-md hover:bg-blue-700">
                                            Login
                                        </Link>
                                        <Link href="/register" className="px-3 py-2 rounded-md bg-white text-blue-600 font-medium hover:bg-gray-100">
                                            Register
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
