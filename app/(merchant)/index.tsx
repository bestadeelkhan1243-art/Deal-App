import React, { useEffect } from 'react';
import { View, Text, Platform, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useMerchantStore } from '../../store/useMerchantStore';
import { useOfferStore } from '../../store/useOfferStore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MerchantProfile() {
  const { logout } = useAuthStore();
  const { profile, fetchProfile } = useMerchantStore();
  const { offers } = useOfferStore();
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  const myOffers = offers.filter(o => o.merchantId === user?.uid);

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
        
        {/* Premium Profile Header */}
        <View className="bg-white pt-16 pb-8 px-6 rounded-b-[40px] shadow-sm mb-6 items-center border-b border-gray-100">
          <View className="relative mb-5">
            <View className="w-28 h-28 bg-red-50 rounded-full items-center justify-center border-4 border-white shadow-md shadow-brand/20 overflow-hidden">
              {profile.profilePic ? (
                <Image source={{ uri: profile.profilePic }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <Text className="text-5xl">🏪</Text>
              )}
            </View>
            <View className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
          </View>
          
          <Text className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">{profile.businessName || "Unnamed Store"}</Text>
          <View className="flex-row space-x-2 mt-2">
            <View className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text className="text-gray-600 font-bold text-xs ml-1.5">Verified</Text>
            </View>
            <View className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 flex-row items-center">
              <Ionicons name="finger-print-outline" size={14} color="#9ca3af" className="mr-1.5" />
              <Text className="text-gray-500 font-bold text-xs tracking-widest uppercase">
                ID: {user?.uid?.substring(0, 8) || '00000000'}
              </Text>
            </View>
          </View>
        </View>

        {/* Dashboard Stats */}
        <View className="px-6 mb-8 flex-row justify-between">
          <View className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mr-2 items-center">
            <Ionicons name="pricetags" size={28} color="#ED1C24" className="mb-2" />
            <Text className="text-3xl font-black text-gray-900 mb-1">{myOffers.length}</Text>
            <Text className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Deals</Text>
          </View>
          <View className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 ml-2 items-center">
            <Ionicons name="eye" size={28} color="#ED1C24" className="mb-2" />
            <Text className="text-3xl font-black text-gray-900 mb-1">8.4k</Text>
            <Text className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Views</Text>
          </View>
        </View>

        {/* Action Menu */}
        <View className="px-6 pb-10">
          <Text className="text-lg font-bold text-gray-900 mb-4 ml-2">Account Settings</Text>
          
          <View className="bg-white rounded-[32px] p-2 shadow-sm border border-gray-100 mb-6">
            <TouchableOpacity 
              onPress={() => router.push('/(merchant)/edit-profile')} 
              className="flex-row items-center p-4 border-b border-gray-50"
            >
              <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-4">
                <Ionicons name="person" size={20} color="#4b5563" />
              </View>
              <Text className="flex-1 text-base font-bold text-gray-900">Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center p-4 border-b border-gray-50"
            >
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
