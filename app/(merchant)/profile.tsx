import { View, Text, Platform } from 'react-native';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'expo-router';

export default function MerchantProfile() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    if (Platform.OS === 'web') {
      window.location.href = '/';
    } else {
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace('/');
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-6 items-center justify-center">
      <View className="w-24 h-24 bg-red-100 rounded-full mb-4 items-center justify-center">
        <Text className="text-3xl">🏪</Text>
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-2">Pizza Hut (Local)</Text>
      <Text className="text-gray-500 mb-8">Verified Merchant</Text>
      
      <Button 
        title="Logout / Switch Role" 
        variant="outline" 
        onPress={handleLogout} 
        className="w-full"
      />
    </View>
  );
}
