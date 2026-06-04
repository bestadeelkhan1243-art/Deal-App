import React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PersonalScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold text-gray-900">Private account</Text>
          <Text className="text-gray-500 text-sm">Lookdeal@gmail.com</Text>
        </View>
      </View>

      <View className="flex-1 p-6">
        {/* Form Fields */}
        <View className="mb-6 border-b border-gray-100 pb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-gray-400 text-sm mb-1">Name</Text>
            <Text className="text-gray-900 text-base font-medium">Look Deal</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>

        <View className="mb-6 border-b border-gray-100 pb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-gray-400 text-sm mb-1">Phone Number</Text>
            <Text className="text-gray-900 text-base font-medium">+1 234 567 890</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>

        <View className="mb-8 border-b border-gray-100 pb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-gray-400 text-sm mb-1">Email</Text>
            <Text className="text-gray-900 text-base font-medium">Lookdeal@gmail.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>

        <View className="flex-1" />

        {/* Delete Account */}
        <TouchableOpacity className="mb-8 self-center">
          <Text className="text-gray-500 font-medium">Delete Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
