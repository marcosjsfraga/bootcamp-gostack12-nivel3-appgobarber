import React, { useCallback, useRef } from 'react';
import { Image, KeyboardAvoidingView, Platform, View, ScrollView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import { Container, Title, BackToSignInButton, BackToSignInButtonText } from './styles';

interface SignUpFormData {
	name: string;
	email: string;
	password: string;
}

const SignUp: React.FC = () => {
	const formRef = useRef<FormHandles>(null);
	const navigation = useNavigation();

	const emailInputRef = useRef<TextInput>(null);
	const passwordInputRef = useRef<TextInput>(null);

	const handleSignUp = useCallback(
		async (data: SignUpFormData) => {
			try {
				// Clear errors
				formRef.current?.setErrors({});

				const schema = Yup.object().shape({
					name: Yup.string().required('Nome obrigatório.'),
					email: Yup.string().required('E-mail obrigatório.').email('Informe um e-mail válido.'),
					password: Yup.string().min(6, 'No mínimo 6 dígitos.'),
				});

				await schema.validate(data, {
					abortEarly: false,
				});

				await api.post('/users', data);

				Alert.alert('Você já pode fazer login na aplicação.');

				navigation.navigate('SignIn');
			} catch (error) {
				if (error instanceof Yup.ValidationError) {
					const errors = getValidationErrors(error);
					formRef.current?.setErrors(errors);
					return;
				}

				Alert.alert('Erro no cadastro', 'Problema ao criar a conta.');
			}
		},
		[navigation],
	);

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
			<ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flex: 1 }}>
				<Container>
					<Image source={logoImg} />
					{/* This View makes the title move when keyboard appears  */}
					<View>
						<Title>Crie sua conta</Title>
					</View>

					<Form ref={formRef} onSubmit={handleSignUp}>
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
								passwordInputRef.current?.focus();
							}}
						/>
						<Input
							ref={passwordInputRef}
							name="password"
							icon="lock"
							placeholder="Senha"
							returnKeyType="send"
							onSubmitEditing={() => {
								formRef.current?.submitForm();
							}}
							// textContentType="newPassword"
							secureTextEntry
						/>
					</Form>

					<Button
						onPress={() => {
							formRef.current?.submitForm();
						}}
					>
						Salvar
					</Button>

					<BackToSignInButton onPress={() => navigation.goBack()}>
						<Icon name="arrow-left" size={20} color="#fff" />
						<BackToSignInButtonText>Voltar para login</BackToSignInButtonText>
					</BackToSignInButton>
				</Container>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default SignUp;
