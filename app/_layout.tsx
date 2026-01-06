import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: '#0f0f1a',
          },
        }}
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="reader/[bookId]" 
          options={{ 
            title: 'Reader',
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="books/[bookId]/index" 
          options={{ 
            title: 'Book',
          }} 
        />
        <Stack.Screen 
          name="books/[bookId]/chapters" 
          options={{ 
            title: 'Chapters',
          }} 
        />
        <Stack.Screen 
          name="books/[bookId]/sources" 
          options={{ 
            title: 'Sources',
          }} 
        />
        <Stack.Screen 
          name="books/[bookId]/spheres" 
          options={{ 
            title: 'Spheres',
          }} 
        />
        <Stack.Screen 
          name="books/[bookId]/words" 
          options={{ 
            title: 'Words',
          }} 
        />
        <Stack.Screen 
          name="sources/[sourceId]" 
          options={{ 
            title: 'Source',
          }} 
        />
        <Stack.Screen 
          name="spheres/[sphereId]/index" 
          options={{ 
            title: 'Sphere',
          }} 
        />
        <Stack.Screen 
          name="spheres/[sphereId]/passages" 
          options={{ 
            title: 'Passages',
          }} 
        />
        <Stack.Screen 
          name="about" 
          options={{ 
            title: 'About SourceView',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="onboarding" 
          options={{ 
            headerShown: false,
            presentation: 'fullScreenModal',
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}

