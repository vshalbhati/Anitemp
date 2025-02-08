'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function StartupQuestionnaire() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});

    const questions = [
        {
            id: 1,
            question: "What describes you the best?",
            options: ["Content Creator", "Social Media Influencer", "Business Owner", "Artist", "Other"]
        },
        {
            id: 2,
            question: "What is your primary motive?",
            options: ["Increase Reach", "Grow Account", "Build Community", "Generate Revenue", "Brand Awareness"]
        },
        {
            id: 3,
            question: "What's your preferred platform?",
            options: ["Instagram", "YouTube", "TikTok", "Twitter", "LinkedIn"]
        },
        {
            id: 4,
            question: "How often do you create content?",
            options: ["Daily", "Weekly", "Bi-weekly", "Monthly", "Occasionally"]
        }
    ];

    const handleAnswer = (answer: string) => {
        setAnswers({ ...answers, [currentQuestion]: answer });
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
        if(currentQuestion===questions.length-1){
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center p-4">
            <h1 className="text-center text-3xl font-bold">Help us understand your needs!</h1>
        
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
            
            <div className="max-w-2xl w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="bg-white rounded-xl p-8 shadow-2xl"
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">
                            {questions[currentQuestion].question}
                        </h2>
                        <div className="space-y-4">
                            {questions[currentQuestion].options.map((option, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleAnswer(option)}
                                    className="w-full text-left px-6 py-4 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 
                                                     hover:from-purple-200 hover:to-pink-200 transition-all duration-200 
                                                     text-gray-700 font-medium shadow-md"
                                >
                                    {option}
                                </motion.button>
                            ))}
                        </div>
                        <div className="mt-8 text-sm text-gray-500">
                            Question {currentQuestion + 1} of {questions.length}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
        </div>
    );
}