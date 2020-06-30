import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 140 : 30}px;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 64px 0 24px;
`;

export const BackToSignInButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;

  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  border-top-width: 1px;
  border-color: #231219;
  background: #321e38;
  padding: 16px 0 ${16 + getBottomSpace()}px;
`;

export const BackToSignInButtonText = styled.Text`
  color: #f4ede8;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
  margin-left: 16px;
`;
