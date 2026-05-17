import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/constants/theme';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isAuthenticated && user) {
    if (user.role === 'entrepreneur') {
      return <Redirect href="/(entrepreneur)/dashboard" />;
    }
    return <Redirect href="/(client)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
