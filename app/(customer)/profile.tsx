import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { useCouponStore } from '../../store/useCouponStore';
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

  const { claimedCoupons } = useCouponStore();

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      
      {/* 1. PROFILE HEADER CARD */}
      <View className="bg-gray-950 px-6 pt-8 pb-12 rounded-b-[40px] items-center shadow-md">
        <View className="w-24 h-24 bg-red-100 rounded-full border-4 border-white items-center justify-center shadow-md mb-4 overflow-hidden">
          <Ionicons name="person" size={56} color="#dc2626" />
        </View>
        <Text className="text-white font-extrabold text-2xl mb-1">Alex Carter</Text>
        <Text className="text-white/60 font-medium text-sm mb-4">Loyalty Tier • Damascus, SY</Text>
        
        {/* Badges */}
        <View className="bg-red-600 px-4 py-1.5 rounded-full shadow-sm">
          <Text className="text-white font-bold text-xs">✨ Gold Member</Text>
        </View>
      </View>

      {/* 2. STATS DASHBOARD GRID */}
      <View className="px-6 -mt-6">
        <View className="bg-white p-5 rounded-3xl shadow-lg border border-gray-100 flex-row justify-between items-center">
          <View className="items-center flex-1">
            <Text className="text-gray-400 font-bold text-xs uppercase mb-1">Claimed</Text>
            <Text className="text-2xl font-extrabold text-gray-900">{claimedCoupons.length}</Text>
          </View>
          <View className="w-[1] h-10 bg-gray-100" />
          <View className="items-center flex-1">
            <Text className="text-gray-400 font-bold text-xs uppercase mb-1">Saved</Text>
            <Text className="text-2xl font-extrabold text-green-600">$42.50</Text>
          </View>
          <View className="w-[1] h-10 bg-gray-100" />
          <View className="items-center flex-1">
            <Text className="text-gray-400 font-bold text-xs uppercase mb-1">Stores</Text>
            <Text className="text-2xl font-extrabold text-gray-900">3</Text>
          </View>
        </View>
      </View>

      {/* 3. CLAIMED COUPONS WALLET */}
      <View className="p-6">
        <Text className="text-xl font-extrabold text-gray-900 mb-4">My Saved Coupons</Text>

        {claimedCoupons.map((coupon) => (
          <View key={coupon.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-5 overflow-hidden">
            {/* Header part */}
            <View className="p-5 border-b border-gray-100">
              <View className="flex-row justify-between items-start mb-1">
                <Text className="text-lg font-bold text-gray-900 flex-1 pr-2">{coupon.title}</Text>
                <Ionicons name="bookmark" size={20} color="#dc2626" />
              </View>
              <Text className="text-gray-500 font-medium mb-3">{coupon.store}</Text>
              
              <View className="flex-row items-center">
                <Ionicons name="time" size={14} color="#ef4444" />
                <Text className="text-red-500 font-bold text-xs ml-1">{coupon.expiry}</Text>
              </View>
            </View>

            {/* Mock QR / Barcode Scan Area */}
            <View className="bg-gray-50/50 p-5 items-center justify-center border-t border-dashed border-gray-200">
              <Text className="text-gray-400 font-bold text-[10px] uppercase mb-3 tracking-widest">Presenter code to merchant</Text>
              
              {/* Stylized visual representation of a barcode */}
              <View className="w-full h-14 bg-white border border-gray-200 rounded-xl px-4 flex-row items-center justify-center space-x-[2px]" style={{ gap: 2 }}>
                {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4].map((width, idx) => (
                  <View 
                    key={idx} 
                    style={{ width: width === 9 ? 4 : width > 4 ? 2 : 1 }}
                    className="h-9 bg-gray-900"
                  />
                ))}
              </View>
              
              <Text className="text-gray-700 font-extrabold text-sm tracking-wider mt-2.5">{coupon.code}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 4. ACTIONS */}
      <View className="px-6 pb-12">
        <Button 
          title="Logout / Switch Role" 
          variant="outline" 
          onPress={handleLogout} 
          className="w-full py-4"
        />
      </View>

    </ScrollView>
  );
}
