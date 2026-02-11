import { User } from '../types';

const AUTH_STORAGE_KEY = 'shinchitose_auth_user';

// Simulated user database (in production, this would be a backend API)
const MOCK_USERS = [
    {
        email: 'demo@example.com',
        password: 'demo123',
        name: 'Demo User',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=3b82f6&color=fff'
    }
];

export const authService = {
    // Email login
    loginWithEmail: (email: string, password: string): User | null => {
        const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);

        if (mockUser) {
            const user: User = {
                id: `user-${Date.now()}`,
                email: mockUser.email,
                name: mockUser.name,
                avatar: mockUser.avatar,
                loginMethod: 'email'
            };

            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            return user;
        }

        // For demo purposes, allow any email/password combination
        const user: User = {
            id: `user-${Date.now()}`,
            email: email,
            name: email.split('@')[0],
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3b82f6&color=fff`,
            loginMethod: 'email'
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        return user;
    },

    // LINE login (simulated)
    loginWithLine: (): User => {
        const user: User = {
            id: `user-${Date.now()}`,
            email: 'line.user@line.me',
            name: 'LINE User',
            avatar: 'https://ui-avatars.com/api/?name=LINE+User&background=00B900&color=fff',
            loginMethod: 'line'
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        return user;
    },

    // Logout
    logout: (): void => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    },

    // Get current user
    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    // Check if user is logged in
    isLoggedIn: (): boolean => {
        return !!authService.getCurrentUser();
    }
};
