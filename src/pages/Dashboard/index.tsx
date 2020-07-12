import React from 'react';
import { View, Text, Button } from 'react-native';

import { useAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
	const { sigOut } = useAuth();
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Button title="Sair" onPress={sigOut} />
		</View>
	);
};

export default Dashboard;
