'use client';
import { motion } from 'framer-motion';
import { FiUsers, FiTrendingUp, FiDollarSign, FiActivity } from 'react-icons/fi';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const cards = [
        { icon: FiUsers, title: 'Total Users', value: '1,234', color: 'bg-blue-500' },
        { icon: FiTrendingUp, title: 'Growth', value: '+12.3%', color: 'bg-green-500' },
        { icon: FiDollarSign, title: 'Revenue', value: '$12,345', color: 'bg-purple-500' },
        { icon: FiActivity, title: 'Activity', value: '892', color: 'bg-orange-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                                <card.icon className="text-white text-2xl" />
                            </div>
                            <h2 className="text-gray-600 text-sm">{card.title}</h2>
                            <p className="text-2xl font-bold mt-2">{card.value}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8 bg-white rounded-lg shadow-lg p-6"
                >
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: item * 0.1 }}
                                className="flex items-center p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-4" />
                                <div>
                                    <p className="font-medium">Activity {item}</p>
                                    <p className="text-sm text-gray-500">2 hours ago</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}