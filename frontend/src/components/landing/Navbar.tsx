"use client";

import Link from "next/link";
import { useState } from "react";
import MenuIcon from "./MenuIcon";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            B
                        </div>
                        <span className="font-bold text-2xl text-blue-900 tracking-tight">
                            Billim
                        </span>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link
                            href="#"
                            className="text-slate-600 hover:text-blue-700 font-medium"
                        >
                            기능 소개
                        </Link>
                        <Link
                            href="#"
                            className="text-slate-600 hover:text-blue-700 font-medium"
                        >
                            요금 안내
                        </Link>
                        <Link href="/login" className="text-blue-600 font-medium">
                            로그인
                        </Link>
                        <Link
                            href="/login"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                        >
                            무료로 시작하기
                        </Link>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 focus:outline-none"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-2 pb-4 space-y-2 shadow-lg">
                    <Link
                        href="#"
                        className="block text-slate-600 hover:text-blue-700 font-medium py-2"
                    >
                        기능 소개
                    </Link>
                    <Link
                        href="#"
                        className="block text-slate-600 hover:text-blue-700 font-medium py-2"
                    >
                        요금 안내
                    </Link>
                    <Link
                        href="/login"
                        className="block text-blue-600 font-medium py-2"
                    >
                        로그인
                    </Link>
                    <Link
                        href="/login"
                        className="block bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition text-center mt-2"
                    >
                        무료로 시작하기
                    </Link>
                </div>
            )}
        </nav>
    );
}
