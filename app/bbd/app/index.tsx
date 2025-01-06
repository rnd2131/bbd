import React from 'react';
import { WebView } from 'react-native-webview';

export default function HomeScreen() {
  return (
    <WebView
      source={{ uri: 'https://bbd-dun.vercel.app/' }}
      style={{ flex: 1, width: '100%', height: '100%' }}
    />
  );
}
