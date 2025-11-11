import React, { useEffect, useState } from "react";

const defaultMessages = [
    "Curating the next big hits 🍿",
    "Dialing up the drama 🎭",
    "Scanning the galaxy for blockbusters 🚀",
    "Finding stories you’ll love ❤️",
    "Serving your daily dose of entertainment 📺",
    "Loading endless entertainment 🎞️",
    "Uncovering hidden gems 💎",
];

export default function Loader({ message }) {
    const [displayMessage, setDisplayMessage] = useState("");

    useEffect(() => {
        if (message) {
            setDisplayMessage(message); // use custom message if provided
        } else {
            const randomMessage = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
            setDisplayMessage(randomMessage);
        }
    }, [message]);

    return (
        <div className="flex flex-col items-center justify-center h-[70vh] bg-black text-white">
            <div className="relative flex justify-center items-center">
                <div className="absolute w-24 h-24 rounded-full bg-orange-600 opacity-20 animate-ping"></div>
                <div className="absolute w-16 h-16 rounded-full bg-orange-500 opacity-40 animate-pulse"></div>
                <div className="w-10 h-10 bg-orange-500 rounded-full animate-bounce"></div>
            </div>
            <p className="mt-6 text-2xl font-semibold tracking-widest text-orange-500 animate-pulse text-center px-4">
                {displayMessage}
            </p>
        </div>
    );
}
