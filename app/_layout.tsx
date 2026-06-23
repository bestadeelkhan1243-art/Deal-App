import { Stack } from "expo-router";
import "../global.css";
import { PopupProvider } from '../components/ui/PopupProvider';

export default function RootLayout() {
  return (
    <PopupProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(customer)" />
        <Stack.Screen name="(merchant)" />
      </Stack>
    </PopupProvider>
  );
}
