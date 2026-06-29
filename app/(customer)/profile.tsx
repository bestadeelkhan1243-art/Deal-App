import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useOfferStore, Offer } from '../../store/useOfferStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function CustomerProfile() {
  const { user, logout } = useAuthStore();
  const { offers } = useOfferStore();
  const router = useRouter();

  // Claims have been moved to saved.tsx

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
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
        <View className="bg-white pt-16 pb-8 px-6 rounded-b-[40px] shadow-sm mb-6 items-center border-b border-gray-100">
          <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm">
            <Ionicons name="person" size={40} color="#9ca3af" />
          </View>
          <Text className="text-2xl font-extrabold text-gray-900 tracking-tight">{user?.email?.split('@')[0] || 'Customer'}</Text>
          <Text className="text-gray-500 font-medium mt-1">{user?.email}</Text>
          <View className="mt-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 flex-row items-center">
            <Ionicons name="finger-print-outline" size={14} color="#9ca3af" className="mr-1.5" />
            <Text className="text-gray-500 font-bold text-xs tracking-widest uppercase">
              ID: {user?.uid?.substring(0, 8) || '00000000'}
            </Text>
          </View>
        </View>


        {/* Account Settings */}
        <View className="px-6 pb-12">
          <Text className="text-xl font-bold text-gray-900 mb-4">Settings</Text>
          
          <View className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 mb-6">
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-50">
              <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-4">
                <Ionicons name="notifications" size={20} color="#4b5563" />
              </View>
              <Text className="flex-1 text-base font-bold text-gray-900">Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleLogout} 
              className="flex-row items-center p-4"
            >
              <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center mr-4">
                <Ionicons name="log-out" size={20} color="#ED1C24" />
              </View>
              <Text className="flex-1 text-base font-bold text-brand">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
