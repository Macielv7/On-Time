// App Root Layout — NaHora
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/contexts/AuthContext';

export const unstable_settings = {
  anchor: '(auth)',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(client)" />
          <Stack.Screen name="(entrepreneur)" />
          <Stack.Screen name="notifications" />
        </Stack>
      </AuthProvider>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
    </GestureHandlerRootView>
  );
}
