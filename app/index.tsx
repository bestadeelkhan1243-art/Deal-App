import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const router = useRouter();
  const { loginAs } = useAuthStore();

  const handleLogin = (role: 'customer' | 'merchant') => {
    loginAs(role);
    router.replace(role === 'customer' ? '/(customer)' : '/(merchant)');
  };

  return (
    <View className="flex-1 bg-brand items-center justify-center p-6">
      
      {/* App Logo & Welcome */}
      <View className="items-center mb-10 mt-12">
        <Text className="text-white text-5xl font-black tracking-widest mb-2">LOOK DEAL</Text>
        <Text className="text-white/90 text-lg font-medium tracking-wider">Welcome</Text>
      </View>

      {/* Dealer Toggle Button */}
      <TouchableOpacity 
        onPress={() => handleLogin('merchant')}
        className="w-full max-w-sm flex-row items-center justify-center border border-white rounded-full py-3 mb-8"
      >
        <Text className="text-white text-base font-semibold mr-1">Are you a dealer?</Text>
        <Text className="text-accent-yellow text-base font-bold underline">Click here</Text>
      </TouchableOpacity>

      {/* Login Card area (Simulated inputs for pitch) */}
      <View className="w-full max-w-sm mb-6" style={{ gap: 12 }}>
        <View className="bg-white rounded-full px-5 py-4 flex-row items-center shadow-sm">
          <Text className="text-gray-400 font-semibold mr-3">Email</Text>
          <View className="flex-1 h-full" />
        </View>

        <View className="flex-row items-center justify-center my-2">
          <View className="flex-1 h-px bg-white/30" />
          <Text className="text-white px-4 font-bold">Or</Text>
          <View className="flex-1 h-px bg-white/30" />
        </View>

        {/* Social Logins */}
        <TouchableOpacity 
          onPress={() => handleLogin('customer')}
          className="bg-transparent border border-white rounded-full px-5 py-4 flex-row items-center justify-center"
        >
          <Ionicons name="logo-apple" size={20} color="white" />
          <Text className="text-white font-semibold ml-3">With Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => handleLogin('customer')}
          className="bg-transparent border border-white rounded-full px-5 py-4 flex-row items-center justify-center"
        >
          <Ionicons name="logo-google" size={20} color="white" />
          <Text className="text-white font-semibold ml-3">With Google</Text>
        </TouchableOpacity>
      </View>

      {/* Register Text */}
      <TouchableOpacity className="mt-2 mb-auto">
        <Text className="text-white font-semibold">New Here? <Text className="font-bold underline">Register now</Text></Text>
      </TouchableOpacity>

      {/* Skip Button */}
      <TouchableOpacity 
        onPress={() => handleLogin('customer')}
        className="absolute bottom-10 right-8"
      >
        <Text className="text-white font-bold text-lg">Skip</Text>
      </TouchableOpacity>
    </View>
  );
}
