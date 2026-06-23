import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PersonalScreen() {
  const router = useRouter();
  
  const [name, setName] = useState('Look Deal');
  const [phone, setPhone] = useState('+1 234 567 890');
  const [email, setEmail] = useState('Lookdeal@gmail.com');

  const handleSave = () => {
    // In a real app, save to backend here
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center border-b border-gray-100 justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-bold text-gray-900">Edit Profile</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleSave} className="bg-red-600 px-4 py-2 rounded-full">
            <Text className="text-white font-bold text-sm">Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
          {/* Profile Image Section */}
          <View className="items-center mb-8 mt-2">
            <View className="relative">
              <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center border border-gray-200 overflow-hidden">
                 <Ionicons name="person" size={40} color="#9CA3AF" />
              </View>
              <TouchableOpacity className="absolute bottom-0 right-0 bg-red-600 w-8 h-8 rounded-full items-center justify-center border-2 border-white">
                <Ionicons name="camera" size={14} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View className="mb-6">
            <Text className="text-gray-500 text-sm mb-2 font-medium ml-1">Full Name</Text>
            <View className="flex-row items-center border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50">
              <Ionicons name="person-outline" size={20} color="#9CA3AF" className="mr-3" />
              <TextInput 
                value={name}
                onChangeText={setName}
                className="flex-1 text-gray-900 text-base font-medium ml-2"
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-gray-500 text-sm mb-2 font-medium ml-1">Phone Number</Text>
            <View className="flex-row items-center border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50">
              <Ionicons name="call-outline" size={20} color="#9CA3AF" className="mr-3" />
              <TextInput 
                value={phone}
                onChangeText={setPhone}
                className="flex-1 text-gray-900 text-base font-medium ml-2"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-gray-500 text-sm mb-2 font-medium ml-1">Email Address</Text>
            <View className="flex-row items-center border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50">
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" className="mr-3" />
              <TextInput 
                value={email}
                onChangeText={setEmail}
                className="flex-1 text-gray-900 text-base font-medium ml-2"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View className="flex-1" />

          {/* Delete Account */}
          <TouchableOpacity className="mb-8 mt-4 self-center bg-red-50 px-6 py-3 rounded-full border border-red-100">
            <Text className="text-red-500 font-bold">Delete Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
