import { View, Text, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { usePopup } from "../components/ui/PopupProvider";
import * as ImagePicker from 'expo-image-picker';

export default function Index() {
  const router = useRouter();
  const { loginWithEmail, signUpWithEmail, isLoading } = useAuthStore();
  const { showPopup } = usePopup();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'customer' | 'merchant'>('customer');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setProfilePic(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleAuth = async () => {
    if (!email || !password) {
      showPopup('error', 'Missing Fields', 'Please enter both your email and password.');
      return;
    }

    if (isRegistering && selectedRole === 'merchant' && !businessName.trim()) {
      showPopup('error', 'Business Name Required', 'Please provide your business name to register as a merchant.');
      return;
    }

    let result;
    if (isRegistering) {
      result = await signUpWithEmail(email, password, selectedRole, {
        profilePic: profilePic || undefined,
        businessName: selectedRole === 'merchant' ? businessName.trim() : undefined
      });
    } else {
      result = await loginWithEmail(email, password);
    }

    if (result.success) {
      if (isRegistering) {
        showPopup('success', 'Welcome!', 'Your account has been successfully created.');
      }
      const roleToNavigate = result.role || (isRegistering ? selectedRole : 'customer');
      // Wait for popup animation to start before routing
      setTimeout(() => {
        router.replace(roleToNavigate === 'merchant' ? '/(merchant)' : '/(customer)');
      }, 500);
    } else {
      showPopup('error', 'Authentication Failed', result.error || "An unknown error occurred.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-brand">
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        {/* Top Graphic Area */}
        <View className="items-center justify-center pt-20 pb-10">
          <View className="w-24 h-24 bg-white/20 rounded-[32px] items-center justify-center mb-6 transform rotate-3 shadow-lg shadow-black/10">
            <View className="w-24 h-24 bg-white/30 rounded-[32px] items-center justify-center absolute -rotate-6" />
            <Ionicons name="pricetags" size={48} color="white" />
          </View>
          <Text className="text-white text-5xl font-black tracking-tighter mb-2 drop-shadow-md">
            L<Text className="text-accent-yellow">oo</Text>k Deal
          </Text>
          <Text className="text-white/80 text-lg font-medium tracking-wide">Premium Deals & Offers</Text>
        </View>

        {/* Bottom Sheet Area */}
        <View className="flex-1 bg-white rounded-t-[40px] px-8 pt-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <Text className="text-3xl font-black text-gray-900 mb-8 text-center tracking-tight">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </Text>

          {isRegistering && (
            <View className="flex-row mb-6 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
              <TouchableOpacity 
                onPress={() => setSelectedRole('customer')}
                className={`flex-1 py-3.5 rounded-xl items-center ${selectedRole === 'customer' ? 'bg-white shadow-sm border border-gray-100' : ''}`}
              >
                <Text className={`font-bold ${selectedRole === 'customer' ? 'text-brand text-base' : 'text-gray-400 text-sm'}`}>Shopper</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSelectedRole('merchant')}
                className={`flex-1 py-3.5 rounded-xl items-center ${selectedRole === 'merchant' ? 'bg-white shadow-sm border border-gray-100' : ''}`}
              >
                <Text className={`font-bold ${selectedRole === 'merchant' ? 'text-brand text-base' : 'text-gray-400 text-sm'}`}>Merchant</Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="space-y-4 mb-8">
            {isRegistering && (
              <View className="items-center mb-4">
                <TouchableOpacity 
                  onPress={pickImage}
                  className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-full items-center justify-center overflow-hidden relative"
                >
                  {profilePic ? (
                    <Image source={{ uri: profilePic }} className="w-full h-full" resizeMode="cover" />
                  ) : (
                    <>
                      <Ionicons name="camera" size={32} color="#9ca3af" />
                      <Text className="text-[10px] text-gray-400 font-bold mt-1">ADD PHOTO</Text>
                    </>
                  )}
                  {profilePic && (
                    <View className="absolute bottom-0 w-full bg-black/50 py-1 items-center">
                      <Text className="text-[10px] text-white font-bold">EDIT</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {isRegistering && selectedRole === 'merchant' && (
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
                <Ionicons name="storefront-outline" size={20} color="#9ca3af" />
                <TextInput 
                  placeholder="Business Name" 
                  placeholderTextColor="#9ca3af"
                  value={businessName}
                  onChangeText={setBusinessName}
                  className="flex-1 ml-3 text-base text-gray-900 font-medium"
                />
              </View>
            )}

            <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
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

            <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
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
              className={`w-full ${isLoading ? 'bg-brand/70' : 'bg-brand'} rounded-2xl py-4 items-center shadow-lg shadow-brand/40 mt-2`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-black tracking-wide">
                  {isRegistering ? "CREATE ACCOUNT" : "LOGIN TO CONTINUE"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center pb-12">
            <Text className="text-gray-500 font-medium">
              {isRegistering ? "Already have an account? " : "New to Look Deal? "}
            </Text>
            <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
              <Text className="text-brand font-black">
                {isRegistering ? "Log In" : "Register Now"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
