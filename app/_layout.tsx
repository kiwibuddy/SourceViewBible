import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { View } from 'react-native';
import { Colors } from '../src/common';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    sourceview: require('../assets/fonts/sourceview.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            headerTintColor: Colors.tint,
            headerTitleStyle: {
              fontWeight: '600',
            },
            contentStyle: {
              backgroundColor: '#FFFFFF',
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
            name="discovery-center/index"
            options={{
              title: 'Discovery Center',
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
      </View>
    </SafeAreaProvider>
  );
}
