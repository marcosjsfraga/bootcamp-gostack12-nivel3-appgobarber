import React, { useCallback, useRef } from 'react';
import { Image, KeyboardAvoidingView, Platform, View, ScrollView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import {
	Container,
	Title,
	ForgotPassword,
	ForgotPasswordText,
	CreateAccountButton,
	CreateAccountButtonText,
} from './styles';

interface SigInFormData {
	email: string;
	password: string;
}

const SignIn: React.FC = () => {
	const formRef = useRef<FormHandles>(null);
	const passwordInputRef = useRef<TextInput>(null);
	const navigation = useNavigation();

	const { signIn } = useAuth();

	const handleSignIn = useCallback(
		async (data: SigInFormData) => {
			try {
				// Clear errors
				formRef.current?.setErrors({});

				const schema = Yup.object().shape({
					email: Yup.string().required('E-mail obrigatório.').email('Informe um e-mail válido.'),
					password: Yup.string().required('Senha obrigatória.'),
				});

				await schema.validate(data, {
					abortEarly: false,
				});

				await signIn({
					email: data.email,
					password: data.password,
				});
			} catch (error) {
				if (error instanceof Yup.ValidationError) {
					const errors = getValidationErrors(error);
					formRef.current?.setErrors(errors);
					return;
				}

				Alert.alert('Problema na cautenticação', 'Problema ao fazer login, verifique as informações.');
			}
		},
		[signIn],
	);

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
			<ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flex: 1 }}>
				<Container>
					<Image source={logoImg} />
					{/* This View makes the title move when keyboard appears  */}
					<View>
						<Title>Faça seu login</Title>
					</View>

					<Form ref={formRef} onSubmit={handleSignIn}>
						<Input
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
							textContentType="newPassword"
							secureTextEntry
						/>

						<Button
							onPress={() => {
								formRef.current?.submitForm();
							}}
						>
							Entrar
						</Button>
					</Form>

					<ForgotPassword onPress={() => {}}>
						<ForgotPasswordText>Esqueceu sua senha?</ForgotPasswordText>
					</ForgotPassword>

					<CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
						<Icon name="log-in" size={20} color="#ff9000" />
						<CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
					</CreateAccountButton>
				</Container>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default SignIn;
