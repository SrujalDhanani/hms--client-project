import React, { createContext, useEffect, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarOpen2, setIsSidebarOpen2] = useState(false);
    const [isSidebarOpen3, setIsSidebarOpen3] = useState(false);
    const [isSidebarOpen4, setIsSidebarOpen4] = useState(false);
    const [isSidebarOpen5, setIsSidebarOpen5] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        setIsSidebarOpen2(false)
        setIsSidebarOpen3(false)
        setIsSidebarOpen4(false)
        setIsSidebarOpen5(false)
    };
    const toggleSidebar2 = () => {
        setIsSidebarOpen2(!isSidebarOpen2);
        setIsSidebarOpen(false)
        setIsSidebarOpen3(false)
        setIsSidebarOpen4(false)
        setIsSidebarOpen5(false)
    };
    const toggleSidebar3 = () => {
        setIsSidebarOpen3(!isSidebarOpen3);
        setIsSidebarOpen(false)
        setIsSidebarOpen2(false)
        setIsSidebarOpen4(false)
        setIsSidebarOpen5(false)
    };
    const toggleSidebar4 = () => {
        setIsSidebarOpen4(!isSidebarOpen4);
        setIsSidebarOpen(false)
        setIsSidebarOpen2(false)
        setIsSidebarOpen3(false)
        setIsSidebarOpen5(false)
    };
    const toggleSidebar5 = () => {
        setIsSidebarOpen5(!isSidebarOpen5);
        setIsSidebarOpen(false)
        setIsSidebarOpen2(false)
        setIsSidebarOpen3(false)
        setIsSidebarOpen4(false)
    };


    return (
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, isSidebarOpen2, toggleSidebar2, isSidebarOpen3, toggleSidebar3, isSidebarOpen4, toggleSidebar4, isSidebarOpen5, toggleSidebar5  }}>
            {children}
        </SidebarContext.Provider>
    );
};

export default SidebarContext;
