import Footer from '@/components/navigation/footer';
import Navbar from '@/components/navigation/navbar';
import React from 'react';
import "../globals.css";

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Task Manager App',
  description: "TaskManager app description.",
};

interface Props {
    children: React.ReactNode
}

const MarketingLayout = ({ children }: Props) => {
    return (
        <>
            <Navbar />
            <main className="mt-20 mx-auto w-full z-0 relative">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default MarketingLayout