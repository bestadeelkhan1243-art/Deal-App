import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CustomerProfile() {
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

  const menuItems = [
    { title: 'Profile Information', icon: 'person-outline', route: '/(customer)/personal' },
    { title: 'Land', icon: 'earth-outline' },
    { title: 'Location', icon: 'location-outline' },
    { title: 'Help & contact', icon: 'help-circle-outline' },
    { title: 'Rate', icon: 'star-outline' },
    { title: 'About us', icon: 'information-circle-outline' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-6 border-b border-gray-100 flex-row items-center">
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text className="text-xl font-bold text-gray-900 ml-4">Profile - private</Text>
      </View>

      <ScrollView className="flex-1 bg-white p-6" showsVerticalScrollIndicator={false}>
        
        {/* Menu Options */}
        <View className="bg-gray-50 rounded-2xl overflow-hidden mb-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={item.title} 
              className={`flex-row items-center p-4 bg-gray-50 ${index !== menuItems.length - 1 ? 'border-b border-gray-200' : ''}`}
              onPress={() => item.route && router.push(item.route as any)}
            >
              <Ionicons name={item.icon as any} size={24} color="#4B5563" />
              <Text className="text-gray-700 font-medium text-base ml-3 flex-1">{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity 
          className="flex-row items-center justify-center p-4"
          onPress={handleLogout}
        >
          <Text className="text-gray-500 font-medium text-base">Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
