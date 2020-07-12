import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface AuthState {
	token: string;
	user: object;
}

interface SigInCredentials {
	email: string;
	password: string;
}

interface AuthContextData {
	user: object;
	loading: boolean;
	sigIn(credentials: SigInCredentials): Promise<void>;
	sigOut(): void;
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

	const sigIn = useCallback(async ({ email, password }) => {
		const response = await api.post('/sessions', {
			email,
			password,
		});

		const { token, user } = response.data;

		await AsyncStorage.setItem('@GoBarber:token', token);
		await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

		setData({ token, user });
	}, []);

	const sigOut = useCallback(async () => {
		await AsyncStorage.removeItem('@GoBarber:token');
		await AsyncStorage.removeItem('@GoBarber:user');

		setData({} as AuthState);
	}, []);

	return <AuthContext.Provider value={{ user: data.user, loading, sigIn, sigOut }}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextData {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider.');
	}

	return context;
}
