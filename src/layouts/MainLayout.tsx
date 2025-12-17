
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { StandbyOverlay } from '../components/StandbyOverlay';
import { OnboardingTour } from '../components/OnboardingTour';
import { useApp } from '../context/AppContext';

export const MainLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-transparent selection:bg-brand-500/30 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
            <StandbyOverlay />
            <OnboardingTour />
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative h-full">
                <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth p-6 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
