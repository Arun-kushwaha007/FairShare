import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { LoginScreen } from './LoginScreen';

describe('LoginScreen', () => {
  it('renders login action', () => {
    const { getByText } = render(
      <PaperProvider>
        <LoginScreen navigation={{ navigate: jest.fn() }} />
      </PaperProvider>,
    );

    expect(getByText('Sign In')).toBeTruthy();
  });
});
