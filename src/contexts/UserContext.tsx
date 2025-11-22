/**
 * UserContext
 * -----------
 * Context for managing user profile state across the application.
 * Persists data to localStorage.
 */

import { createContext, useContext, useState, type ReactNode } from "react";

interface UserProfile {
    name: string;
    avatarUrl: string;
}

interface UserContextType {
    user: UserProfile;
    updateUser: (updates: Partial<UserProfile>) => void;
}

const defaultUser: UserProfile = {
    name: "Admin",
    avatarUrl: "https://www.figma.com/api/mcp/asset/439e197a-32da-4d23-a723-ee143a8d0d92",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile>(() => {
        const saved = localStorage.getItem("userProfile");
        return saved ? JSON.parse(saved) : defaultUser;
    });

    const updateUser = (updates: Partial<UserProfile>) => {
        setUser((prev) => {
            const newUser = { ...prev, ...updates };
            localStorage.setItem("userProfile", JSON.stringify(newUser));
            return newUser;
        });
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
