import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './src/context/AppContext';
import { router } from './src/router';

const root = createRoot(document.getElementById("root")!);
root.render(
    <AppProvider>
        <RouterProvider router={router} />
    </AppProvider>
);
