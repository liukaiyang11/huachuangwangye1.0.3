import React from 'react';
import { createHashRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Workbench } from '../pages/Workbench';
import { Workspace } from '../pages/Workspace';
import { Marketplace } from '../pages/Marketplace';
import { Knowledge } from '../pages/Knowledge';
import { Creation } from '../pages/Creation';
import { Settings } from '../pages/Settings';
import { Notifications } from '../pages/Notifications';
import { AuthPage } from '../pages/Auth';

export const router = createHashRouter([
    {
        path: '/login',
        element: <AuthPage />
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Workbench /> },
            { path: 'workspace', element: <Workspace /> },
            { path: 'knowledge', element: <Knowledge /> },
            { path: 'marketplace', element: <Marketplace /> },
            { path: 'creation', element: <Creation /> },
            { path: 'settings', element: <Settings /> },
            { path: 'notifications', element: <Notifications /> },
        ]
    }
]);