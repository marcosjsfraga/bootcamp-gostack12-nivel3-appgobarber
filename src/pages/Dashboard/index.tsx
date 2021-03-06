import React, { useCallback, useEffect, useState } from 'react';

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';

import { useAuth } from '../../hooks/auth';

import {
	Container,
	Header,
	HeaderTitle,
	UserName,
	ProfileButton,
	UserAvatar,
	ProvidersList,
	ProvidersListTitle,
	ProviderContainer,
	ProviderAvatar,
	ProviderInfo,
	ProviderName,
	ProviderMeta,
	ProviderMetaText,
} from './styles';

export interface Provider {
	id: string;
	name: string;
	avatar_url: string;
}

const Dashboard: React.FC = () => {
	/**
	 * Declarations
	 **/
	const [providers, setProviders] = useState<Provider[]>([]);

	const { signOut, user } = useAuth();
	const { navigate } = useNavigation();

	/**
	 * Get providers
	 **/
	useEffect(() => {
		api.get('providers').then(response => {
			setProviders(response.data);
		});
	}, []);

	/**
	 * Create Appointment
	 **/
	const navigateToCreateAppointment = useCallback(
		(providerId: string) => {
			navigate('CreateAppointment', { providerId });
		},
		[navigate],
	);

	/**
	 * Navigate to Profile
	 **/
	const navigateToProfile = useCallback(() => {
		// signOut();
		navigate('Profile');
	}, [navigate]);

	/**
	 * Render page
	 **/
	return (
		<Container>
			<Header>
				<HeaderTitle>
					Bem vindo, {'\n'}
					<UserName>{user.name}</UserName>
				</HeaderTitle>

				<ProfileButton onPress={navigateToProfile}>
					<UserAvatar source={{ uri: user.avatar_url }} />
				</ProfileButton>
			</Header>

			<ProvidersList
				data={providers}
				keyExtractor={provider => provider.id}
				ListHeaderComponent={<ProvidersListTitle>Cabeleireiros</ProvidersListTitle>}
				renderItem={({ item: provider }) => (
					<ProviderContainer onPress={() => navigateToCreateAppointment(provider.id)}>
						<ProviderAvatar source={{ uri: provider.avatar_url }} />

						<ProviderInfo>
							<ProviderName>{provider.name}</ProviderName>
							<ProviderMeta>
								<Icon name="calendar" size={14} color="#ff9000" />
								<ProviderMetaText>Segunda a sexta</ProviderMetaText>
							</ProviderMeta>
							<ProviderMeta>
								<Icon name="clock" size={14} color="#ff9000" />
								<ProviderMetaText>8h às 18h</ProviderMetaText>
							</ProviderMeta>
						</ProviderInfo>
					</ProviderContainer>
				)}
			/>
		</Container>
	);
};

export default Dashboard;
