import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface User {
	id: string;
	name: string;
	email: string;
	avatar_url: string;
}

interface AuthState {
	token: string;
	user: User;
}

interface SigInCredentials {
	email: string;
	password: string;
}

interface AuthContextData {
	user: User;
	loading: boolean;
	signIn(credentials: SigInCredentials): Promise<void>;
	signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
	const [data, setData] = useState<AuthState>({} as AuthState);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadStoragedData(): Promise<void> {
			const token = await AsyncStorage.getItem('@GoBarber:token');
			const user = await AsyncStorage.getItem('@GoBarber:user');

			if (token && user) {
				setData({ token, user: JSON.parse(user) });
			}

			setLoading(false);
		}

		loadStoragedData();
	}, []);

	const signIn = useCallback(async ({ email, password }) => {
		const response = await api.post('/sessions', {
			email,
			password,
		});

		const { token, user } = response.data;

		await AsyncStorage.setItem('@GoBarber:token', token);
		await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

		setData({ token, user });
	}, []);

	const signOut = useCallback(async () => {
		await AsyncStorage.removeItem('@GoBarber:token');
		await AsyncStorage.removeItem('@GoBarber:user');

		setData({} as AuthState);
	}, []);

	return (
		<AuthContext.Provider value={{ user: data.user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
	);
};

export function useAuth(): AuthContextData {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider.');
	}

	return context;
}