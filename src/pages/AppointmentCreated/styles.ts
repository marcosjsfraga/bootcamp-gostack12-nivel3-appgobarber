import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { FlatList } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	padding: 0 24px;
`;

export const Title = styled.Text`
	font-size: 32px;
	color: #f4ede8;
	font-family: 'RobotoSlab-Medium';
	margin-top: 48px;
	text-align: center;
`;

export const Description = styled.Text`
	font-size: 18px;
	color: #999591;
	font-family: 'RobotoSlab-Regular';
	margin-top: 16px;
`;

export const OKButton = styled(RectButton)`
	height: 46px;
	background: #ff9000;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
	margin-top: 24px;
	padding: 12px 24px;
`;

export const OKButtonText = styled.Text`
	font-size: 18px;
	color: #312e38;
	font-family: 'RobotoSlab-Medium';
`;
