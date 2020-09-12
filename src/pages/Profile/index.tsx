import React, { useCallback, useRef } from 'react';
import { Image, KeyboardAvoidingView, Platform, View, ScrollView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import { Container, Title, UserAvatarButton, UserAvatar, BackButton } from './styles';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
	name: string;
	email: string;
	old_password: string;
	password: string;
	password_confirmation: string;
}

const Profile: React.FC = () => {
	const { signOut, user, updateUser } = useAuth();

	const formRef = useRef<FormHandles>(null);
	const navigation = useNavigation();

	const emailInputRef = useRef<TextInput>(null);
	const oldPasswordInputRef = useRef<TextInput>(null);
	const passwordInputRef = useRef<TextInput>(null);
	const confirmPasswordInputRef = useRef<TextInput>(null);

	const handleProfile = useCallback(
		async (data: ProfileFormData) => {
			try {
				// Clear errors
				formRef.current?.setErrors({});

				const schema = Yup.object().shape({
					name: Yup.string().required('Nome obrigatório.'),
					email: Yup.string().required('E-mail obrigatório.').email('Informe um e-mail válido.'),
					old_password: Yup.string(),
					password: Yup.string().when('old_password', {
						is: val => !!val.length,
						then: Yup.string().required('Campo obrigatório'),
						otherwise: Yup.string(),
					}),
					password_confirmation: Yup.string()
						.when('old_password', {
							is: val => !!val.length,
							then: Yup.string().required('Campo obrigatório'),
							otherwise: Yup.string(),
						})
						.oneOf([Yup.ref('password'), ''], 'A senha não confere'),
				});

				await schema.validate(data, {
					abortEarly: false,
				});

				const { name, email, old_password, password, password_confirmation } = data;

				const formData = Object.assign(
					{
						name,
						email,
					},
					old_password
						? {
								old_password,
								password,
								password_confirmation,
						  }
						: {},
				);

				const response = await api.put('/profile', formData);

				updateUser(response.data);

				Alert.alert('Perfil atualizado com sucesso.');

				navigation.goBack();
			} catch (error) {
				if (error instanceof Yup.ValidationError) {
					const errors = getValidationErrors(error);
					formRef.current?.setErrors(errors);
					return;
				}

				Alert.alert('Erro', 'Problema ao atualizar o perfil.');
			}
		},
		[navigation, updateUser],
	);

	const handleUpdateAvatar = useCallback(() => {
		ImagePicker.showImagePicker(
			{
				title: 'Selecione uma imagem',
				cancelButtonTitle: 'Cancelar',
				takePhotoButtonTitle: 'Usar câmera',
				chooseFromLibraryButtonTitle: 'Escolher da galeria',
			},
			response => {
				if (response.didCancel) {
					return;
				}

				if (response.error) {
					Alert.alert('Erro ao atualizar imagem: ', response.error);
					return;
				}

				// const source = { uri: response.uri };

				const data = new FormData();

				data.append('avatar', {
					type: 'image/jpeg',
					name: `${user.id}.jpg`,
					uri: response.uri,
				});

				api.patch('users/avatar', data).then(apiResponse => {
					updateUser(apiResponse.data);
				});

				// To resize big images use react-native-image-editor
			},
		);
	}, [updateUser, user.id]);

	const handleGoBack = useCallback(() => {
		navigation.goBack();
	}, [navigation]);

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
			<ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flex: 1 }}>
				<Container>
					<BackButton onPress={handleGoBack}>
						<Icon name="chevron-left" size={24} color="#999521" />
					</BackButton>

					<UserAvatarButton onPress={handleUpdateAvatar}>
						<UserAvatar source={{ uri: user.avatar_url }} />
					</UserAvatarButton>

					{/* This View makes the title move when keyboard appears  */}
					<View>
						<Title>Meu perfil</Title>
					</View>

					<Form initialData={{ name: user.name, email: user.email }} ref={formRef} onSubmit={handleProfile}>
						<Input
							name="name"
							icon="user"
							placeholder="Nome"
							autoCorrect={false}
							autoCapitalize="words"
							returnKeyType="next"
							onSubmitEditing={() => {
								emailInputRef.current?.focus();
							}}
						/>
						<Input
							ref={emailInputRef}
							name="email"
							icon="mail"
							placeholder="E-mail"
							autoCorrect={false}
							autoCapitalize="none"
							keyboardType="email-address"
							returnKeyType="next"
							onSubmitEditing={() => {
								oldPasswordInputRef.current?.focus();
							}}
						/>
						<Input
							ref={oldPasswordInputRef}
							name="old_password"
							icon="lock"
							placeholder="Senha atual"
							returnKeyType="next"
							containerStyle={{ marginTop: 16 }}
							onSubmitEditing={() => {
								passwordInputRef.current?.focus();
							}}
							secureTextEntry
						/>

						<Input
							ref={passwordInputRef}
							name="password"
							icon="lock"
							placeholder="Nova senha"
							returnKeyType="next"
							onSubmitEditing={() => {
								confirmPasswordInputRef.current?.focus();
							}}
							secureTextEntry
						/>

						<Input
							ref={confirmPasswordInputRef}
							name="password_confirmation"
							icon="lock"
							placeholder="Confirmar senha"
							returnKeyType="send"
							onSubmitEditing={() => {
								formRef.current?.submitForm();
							}}
							secureTextEntry
						/>

						<Button
							onPress={() => {
								formRef.current?.submitForm();
							}}
						>
							Confirmar mudanças
						</Button>

						<Button
							onPress={() => {
								signOut();
							}}
						>
							Sair
						</Button>
					</Form>
				</Container>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default Profile;
