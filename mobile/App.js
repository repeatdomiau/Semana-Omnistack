import React from 'react';
import { StatusBar } from 'react-native';
import Routes from './src/Routes';
import { statusPurple } from './src/utils/Colors';

export default function App() {
  return (
    <>
      <StatusBar barStyle='light-content' backgroundColor={statusPurple} />
      <Routes />
    </>
  );
}