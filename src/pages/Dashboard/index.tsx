import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../contexts/auth';

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
} from './styles';

const Dashboard: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  return (
    <Container>
      <Header>
        <View>
          <HeaderTitle>Bem vindo,</HeaderTitle>
          <UserName>{user.name}</UserName>
        </View>

        <ProfileButton onPress={() => navigation.navigate('Profile')}>
          <UserAvatar source={{ uri: user.avatar_url }} />
        </ProfileButton>
      </Header>
    </Container>
  );
};

export default Dashboard;
