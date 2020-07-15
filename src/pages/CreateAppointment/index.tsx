import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import { Platform, Alert } from 'react-native';
import { useAuth } from '../../contexts/auth';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  CalendarTitle,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  HourSection,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

import api from '../../services/api';
import { IProvider } from './types';

interface IRouteParams {
  providerId: string;
}

interface IDayAvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { providerId } = route.params as IRouteParams;

  const { goBack, navigate } = useNavigation();
  const { user } = useAuth();

  const [providers, setProviders] = useState<IProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(providerId);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);
  const [dayAvailability, setDayAvailability] = useState<
    IDayAvailabilityItem[]
  >([]);

  useEffect(() => {
    async function loadProviders(): Promise<void> {
      const response = await api.get('providers');

      setProviders(response.data);
    }

    loadProviders();
  }, []);

  useEffect(() => {
    async function loadDayAvailability(): Promise<void> {
      const response = await api.get(
        `providers/${selectedProvider}/day-availability`,
        {
          params: {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1,
            day: selectedDate.getDate(),
          },
        },
      );

      setDayAvailability(response.data);
    }

    loadDayAvailability();
  }, [selectedProvider, selectedDate]);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(oldState => !oldState);
  }, []);

  const handleChangeDatePicker = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }

      date && setSelectedDate(date);
    },
    [],
  );

  const morningAvailability = useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour < 12)
      .map(({ available, hour }) => ({
        hour,
        available,
        hourFormatted: format(new Date().setHours(hour), 'HH:00'),
      }));
  }, [dayAvailability]);

  const afternoonAvailability = useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour >= 12)
      .map(({ available, hour }) => ({
        hour,
        available,
        hourFormatted: format(new Date().setHours(hour), 'HH:00'),
      }));
  }, [dayAvailability]);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      date.setHours(selectedHour);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (error) {
      Alert.alert(
        'Erro ao criar o agendamento',
        'Ocorreu um erro ao criar o agendamento. Tente novamente',
      );
    }
  }, [selectedDate, selectedHour, selectedProvider, navigate]);

  return (
    <Container>
      <Header>
        <BackButton onPress={() => goBack()}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            data={providers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => setSelectedProvider(provider.id)}
                selected={provider.id === selectedProvider}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <CalendarTitle>Escolha uma data</CalendarTitle>

          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecione outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              textColor="#f4ede8"
              value={selectedDate}
              onChange={handleChangeDatePicker}
            />
          )}
        </Calendar>

        <Schedule>
          <CalendarTitle>Escolha um horário</CalendarTitle>

          <HourSection>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent
              data={morningAvailability}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={dayHour => dayHour.hourFormatted}
              renderItem={({ item: dayHour }) => (
                <Hour
                  enabled={dayHour.available}
                  available={dayHour.available}
                  onPress={() => setSelectedHour(dayHour.hour)}
                  selected={selectedHour === dayHour.hour}
                >
                  <HourText selected={selectedHour === dayHour.hour}>
                    {dayHour.hourFormatted}
                  </HourText>
                </Hour>
              )}
            />
          </HourSection>

          <HourSection>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent
              data={afternoonAvailability}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={dayHour => dayHour.hourFormatted}
              renderItem={({ item: dayHour }) => (
                <Hour
                  enabled={dayHour.available}
                  available={dayHour.available}
                  onPress={() => setSelectedHour(dayHour.hour)}
                  selected={selectedHour === dayHour.hour}
                >
                  <HourText selected={selectedHour === dayHour.hour}>
                    {dayHour.hourFormatted}
                  </HourText>
                </Hour>
              )}
            />
          </HourSection>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
