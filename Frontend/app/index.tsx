import { Redirect } from 'expo-router';

export default function Index() {
  // In a real app, check auth state here
  // For demo, redirect to login
  return <Redirect href="/(auth)/login" />;
}
