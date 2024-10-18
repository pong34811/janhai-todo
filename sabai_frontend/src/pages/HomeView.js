import React from 'react';
import './HomeView.css';
import { FaPlay } from 'react-icons/fa'; // ใช้ไอคอนจาก react-icons

export default function HomeView() {
    return (
        <div className="homepage-container">
            


            {/* Main Content */}
            <main className="main-content flex flex-col items-center justify-center text-center h-screen bg-gradient-to-r from-blue-500 to-pink-500 text-white">
                <h1 className="text-6xl font-extrabold mb-6">Trello brings all your tasks, teammates, and tools together</h1>
                <p className="text-2xl mb-8">Keep everything in the same place—even if your team isn’t.</p>
                <div className="input-group flex items-center space-x-4 mb-6">
                    <input type="email" placeholder="Enter your email" className="p-3 w-80 rounded-lg border-none focus:ring-2 focus:ring-white" />
                    <button className="signup-button bg-white text-blue-600 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300">
                        Sign up - it’s free!
                    </button>
                </div>
                <a href="#" className="video-link underline hover:text-blue-200 flex items-center">
                    <FaPlay className="mr-2" /> Watch video
                </a>
            </main>

            {/* Extra Section */}
            <section className="extra-content bg-white p-8 mt-6 rounded-lg shadow-md text-center">
                <h2 className="text-4xl font-bold mb-4 text-gray-800">TRELLO 101</h2>
                <p className="text-lg text-gray-600">A productivity powerhouse</p>
            </section>
        </div>
    );
}