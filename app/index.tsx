import { View, Text, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";

export default function Index() {
  const router = useRouter();
  const { loginWithEmail, signUpWithEmail, isLoading } = useAuthStore();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'merchant'>('customer');

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    let result;
    if (isRegistering) {
      result = await signUpWithEmail(email, password, selectedRole);
    } else {
      result = await loginWithEmail(email, password);
    }

    if (result.success) {
      // The onAuthStateChanged listener in useAuthStore will automatically 
      // navigate via an auth guard if you have one, or we can force navigate here.
      // Assuming role is successfully fetched for login or passed for signup:
      const roleToNavigate = isRegistering ? selectedRole : (email.includes('merchant') ? 'merchant' : 'customer');
      router.replace(roleToNavigate === 'customer' ? '/(customer)' : '/(merchant)');
    } else {
      Alert.alert("Error", result.error || "Authentication failed.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-brand">
      <StatusBar barStyle="light-content" />
      
      {/* Top Graphic Area */}
      <View className="flex-1 items-center justify-center pt-10">
        <View className="w-24 h-24 bg-white/20 rounded-3xl items-center justify-center mb-6 transform rotate-3">
          <View className="w-24 h-24 bg-white/30 rounded-3xl items-center justify-center absolute -rotate-6" />
          <Ionicons name="pricetags" size={48} color="white" />
        </View>
        <Text className="text-white text-5xl font-black tracking-tighter mb-2 shadow-sm">
          L<Text className="text-accent-yellow">oo</Text>k Deal
        </Text>
        <Text className="text-white/80 text-lg font-medium tracking-wide">Find the best offers around you</Text>
      </View>

      {/* Bottom Sheet Area */}
      <View className="bg-white rounded-t-[40px] px-8 pt-10 pb-12 shadow-2xl">
        <Text className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </Text>

        {isRegistering && (
          <View className="flex-row mb-6 bg-gray-100 p-1 rounded-xl">
            <TouchableOpacity 
              onPress={() => setSelectedRole('customer')}
              className={`flex-1 py-3 rounded-lg items-center ${selectedRole === 'customer' ? 'bg-white shadow-sm' : ''}`}
            >
              <Text className={`font-bold ${selectedRole === 'customer' ? 'text-brand' : 'text-gray-500'}`}>Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setSelectedRole('merchant')}
              className={`flex-1 py-3 rounded-lg items-center ${selectedRole === 'merchant' ? 'bg-white shadow-sm' : ''}`}
            >
              <Text className={`font-bold ${selectedRole === 'merchant' ? 'text-brand' : 'text-gray-500'}`}>Merchant</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="space-y-4">
          <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 mb-4">
            <Ionicons name="mail-outline" size={20} color="#9ca3af" />
            <TextInput 
              placeholder="Email address" 
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className="flex-1 ml-3 text-base text-gray-900 font-medium"
            />
          </View>

          <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 mb-4">
            <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
            <TextInput 
              placeholder="Password" 
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="flex-1 ml-3 text-base text-gray-900 font-medium"
            />
          </View>
          
          <TouchableOpacity 
            onPress={handleAuth}
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-brand/70' : 'bg-brand'} rounded-2xl py-4 items-center shadow-md mb-6 shadow-brand/30`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">
                {isRegistering ? "Sign Up" : "Continue with Email"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {!isRegistering && (
          <>
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="px-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Or continue with</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            <View className="flex-row space-x-4 mb-8">
              <TouchableOpacity 
                className="flex-1 bg-white border border-gray-200 rounded-2xl py-3.5 flex-row items-center justify-center shadow-sm"
              >
                <Ionicons name="logo-google" size={20} color="#EA4335" />
                <Text className="text-gray-700 font-bold ml-2">Google</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 bg-white border border-gray-200 rounded-2xl py-3.5 flex-row items-center justify-center shadow-sm"
              >
                <Ionicons name="logo-apple" size={20} color="black" />
                <Text className="text-gray-700 font-bold ml-2">Apple</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View className="flex-row justify-center mt-2">
          <Text className="text-gray-500 font-medium">
            {isRegistering ? "Already have an account? " : "New to Look Deal? "}
          </Text>
          <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
            <Text className="text-brand font-bold">
              {isRegistering ? "Log In" : "Register Now"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
