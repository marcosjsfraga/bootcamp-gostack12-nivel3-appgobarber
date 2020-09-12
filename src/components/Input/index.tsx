import React, { useState, useEffect, useRef, useImperativeHandle, useCallback, forwardRef } from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
	name: string;
	icon: string;
	containerStyle?: {};
}

interface InputValueReference {
	value: string;
}

interface InputRef {
	focus(): void;
}

// Use RefForwardingComponent only when component has to receive 'ref' parameter
const Input: React.RefForwardingComponent<InputRef, InputProps> = (
	{ name, icon, containerStyle = {}, ...allOtherProps },
	ref,
) => {
	const inputElementRef = useRef<any>(null);

	const { registerField, defaultValue = '', fieldName, error } = useField(name);
	const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

	const [isFocuded, setIsFocused] = useState(false);
	const [isFilled, setIsFilled] = useState(false);

	const handleInputFocus = useCallback(() => {
		setIsFocused(true);
	}, []);

	const handleInputBlur = useCallback(() => {
		setIsFocused(false);

		setIsFilled(!!inputValueRef.current.value);
	}, []);

	useImperativeHandle(ref, () => ({
		focus() {
			inputElementRef.current.focus();
		},
	}));

	useEffect(() => {
		registerField({
			name: fieldName,
			ref: inputValueRef.current,
			path: 'value',
			setValue(ref: any, value: string) {
				inputValueRef.current.value = value;
				// Visually changes the input information on the screen
				inputElementRef.current.setNativeProps({ text: value });
			},
			clearValue() {
				inputValueRef.current.value = '';
				inputElementRef.current.clear();
			},
		});
	}, [fieldName, registerField]);

	return (
		<Container style={containerStyle} isFocused={isFocuded} isErrored={!!error}>
			<Icon name={icon} size={20} color={isFocuded || isFilled ? '#ff9000' : '#666360'} />
			<TextInput
				ref={inputElementRef}
				placeholderTextColor="#666360"
				defaultValue={defaultValue}
				onFocus={handleInputFocus}
				onBlur={handleInputBlur}
				onChangeText={value => {
					inputValueRef.current.value = value;
				}}
				{...allOtherProps}
			/>
		</Container>
	);
};

export default forwardRef(Input);
