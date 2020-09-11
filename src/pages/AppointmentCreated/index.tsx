import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import prBR from 'date-fns/locale/pt-BR';

import { Container, Title, Description, OKButton, OKButtonText } from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';

interface RouteParams {
	date: number;
}

const AppointmentCreated: React.FC = () => {
	const { reset } = useNavigation();
	const { params } = useRoute();

	const routeParams = params as RouteParams;

	const handkleOkPressed = useCallback(() => {
		reset({
			routes: [{ name: 'Dashboard' }],
			index: 0,
		});
	}, [reset]);

	const formattedDate = useMemo(() => {
		return format(routeParams.date, "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'", { locale: prBR });
	}, [routeParams.date]);

	return (
		<Container>
			<Icon name="check" size={80} color="#04d361" />
			<Title>Agendamento concluído</Title>
			<Description>{formattedDate}</Description>
			<OKButton onPress={handkleOkPressed}>
				<OKButtonText>OK</OKButtonText>
			</OKButton>
		</Container>
	);
};

export default AppointmentCreated;
