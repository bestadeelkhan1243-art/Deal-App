import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/useAuthStore";

export default function Index() {
  const router = useRouter();
  const { loginAs } = useAuthStore();

  const handleLogin = (role: 'customer' | 'merchant') => {
    loginAs(role);
    router.replace(role === 'customer' ? '/(customer)' : '/(merchant)');
  };

  return (
    <View className="flex-1 bg-white items-center p-6">
      <View className="flex-1 justify-center items-center w-full">
        <Image 
          source={require('../assets/images/app_logo.png')} 
          style={{ width: 120, height: 120, borderRadius: 30, marginBottom: 24 }}
          resizeMode="cover"
        />
        <Text className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Look Deal</Text>
        <Text className="text-lg text-gray-500 mb-12 text-center max-w-xs leading-relaxed">
          Discover the best local offers, curated just for you.
        </Text>
      </View>

      <View className="w-full pb-12" style={{ gap: 16 }}>
        <View className="bg-red-50 p-4 rounded-2xl border border-red-100">
          <Text className="text-red-800 text-center font-medium text-sm">
            ✨ Demo Mode active. Choose your experience below.
          </Text>
        </View>
        <Button 
          title="Continue as Customer" 
          onPress={() => handleLogin('customer')} 
          className="bg-red-600 shadow-md shadow-red-200"
        />
        <Button 
          title="Continue as Merchant" 
          variant="secondary"
          onPress={() => handleLogin('merchant')} 
          className="bg-gray-900 shadow-md shadow-gray-200"
        />
      </View>
    </View>
  );
}
