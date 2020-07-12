import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import AuthRoutes from './auth.routes';
import ApphRoutes from './app.routes';

import { useAuth } from '../hooks/auth';

const Routes: React.FC = () => {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" color="#999" />
			</View>
		);
	}

	return user ? <ApphRoutes /> : <AuthRoutes />;
};

export default Routes;
