import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOfferStore } from '../../store/useOfferStore';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { useCouponStore } from '../../store/useCouponStore';

export default function MerchantDashboard() {
  const { offers } = useOfferStore();
  const { data } = useAnalyticsStore();
  const { claimedCoupons, redeemCoupon, redeemById, cancelCoupon, nudgeCustomer } = useCouponStore();
  const activeCount = offers.filter(o => o.status === 'Active').length;

  const [redeemCode, setRedeemCode] = useState('');
  const [nudgedCoupons, setNudgedCoupons] = useState<string[]>([]);

  // Find max value for bar chart scaling
  const maxViews = Math.max(...data.views.history);

  const handleRedeem = () => {
    if (!redeemCode.trim()) return;
    const success = redeemCoupon(redeemCode.trim().toUpperCase());
    if (success) {
      Alert.alert("Success!", `Coupon ${redeemCode.toUpperCase()} has been successfully redeemed.`);
      setRedeemCode('');
    } else {
      Alert.alert("Error", "Invalid or already redeemed coupon code.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6" showsVerticalScrollIndicator={false}>
      <Text className="text-3xl font-extrabold text-gray-900 mb-6 mt-2">Dashboard</Text>
      
      {/* Redemption Portal */}
      <View className="bg-red-600 p-6 rounded-3xl shadow-md mb-8">
        <View className="flex-row items-center mb-3">
          <Ionicons name="scan" size={24} color="white" />
          <Text className="text-white text-lg font-bold ml-2">Redeem Customer Coupon</Text>
        </View>
        <Text className="text-white/80 text-sm mb-4">Enter the code presented by the shopper to redeem their deal.</Text>
        <View className="flex-row space-x-3">
          <TextInput 
            value={redeemCode}
            onChangeText={setRedeemCode}
            placeholder="e.g. SUMMER50"
            autoCapitalize="characters"
            className="flex-1 bg-white px-4 py-3 rounded-xl font-bold text-gray-900"
          />
          <TouchableOpacity 
            onPress={handleRedeem}
            className="bg-black px-6 py-3 rounded-xl justify-center shadow-sm"
          >
            <Text className="text-white font-bold">Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* KPI Metric Cards */}
      <View className="flex-row flex-wrap justify-between mb-2">
        <View className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 w-[48%] mb-4">
          <View className="flex-row justify-between items-start">
            <View className="bg-red-50 p-2 rounded-full">
              <Ionicons name="pricetags" size={20} color="#dc2626" />
            </View>
            <View className="bg-gray-100 px-2 py-1 rounded-full">
              <Text className="text-gray-600 text-[10px] font-bold">LIVE</Text>
            </View>
          </View>
          <Text className="text-gray-500 text-xs font-medium mt-3 mb-1">Active Offers</Text>
          <Text className="text-2xl font-extrabold text-gray-900">{activeCount}</Text>
        </View>

        <View className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 w-[48%] mb-4">
          <View className="flex-row justify-between items-start">
            <View className="bg-blue-50 p-2 rounded-full">
              <Ionicons name="eye" size={20} color="#2563eb" />
            </View>
            <View className="bg-green-100 px-2 py-1 rounded-full">
              <Text className="text-green-600 text-[10px] font-bold">{data.views.trend}</Text>
            </View>
          </View>
          <Text className="text-gray-500 text-xs font-medium mt-3 mb-1">Total Views</Text>
          <Text className="text-2xl font-extrabold text-gray-900">{(data.views.total / 1000).toFixed(1)}k</Text>
        </View>

        <View className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 w-[48%] mb-4">
          <View className="flex-row justify-between items-start">
            <View className="bg-pink-50 p-2 rounded-full">
              <Ionicons name="heart" size={20} color="#db2777" />
            </View>
            <View className="bg-green-100 px-2 py-1 rounded-full">
              <Text className="text-green-600 text-[10px] font-bold">{data.likes.trend}</Text>
            </View>
          </View>
          <Text className="text-gray-500 text-xs font-medium mt-3 mb-1">Total Likes</Text>
          <Text className="text-2xl font-extrabold text-gray-900">{data.likes.total}</Text>
        </View>

        <View className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 w-[48%] mb-4">
          <View className="flex-row justify-between items-start">
            <View className="bg-purple-50 p-2 rounded-full">
              <Ionicons name="people" size={20} color="#9333ea" />
            </View>
            <View className="bg-green-100 px-2 py-1 rounded-full">
              <Text className="text-green-600 text-[10px] font-bold">{data.followers.trend}</Text>
            </View>
          </View>
          <Text className="text-gray-500 text-xs font-medium mt-3 mb-1">Followers</Text>
          <Text className="text-2xl font-extrabold text-gray-900">{(data.followers.total / 1000).toFixed(1)}k</Text>
        </View>
      </View>

      {/* Growth Trend (Bar Chart Simulation) */}
      <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-lg font-bold text-gray-900">Views Growth Trend</Text>
          <Text className="text-xs text-gray-400 font-medium">Last 7 Days</Text>
        </View>
        <View className="flex-row justify-between items-end h-32 px-2">
          {data.views.history.map((val, idx) => {
            const heightPercent = Math.max((val / maxViews) * 100, 10);
            return (
              <View key={idx} className="items-center w-8">
                <View 
                  className="w-full bg-blue-500 rounded-t-md" 
                  style={{ height: `${heightPercent}%` }} 
                />
                <Text className="text-[10px] text-gray-400 mt-2 font-medium">
                  {['M','T','W','T','F','S','S'][idx]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Customer Segmentation */}
      <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <Text className="text-lg font-bold text-gray-900 mb-6">Customer Age Groups</Text>
        {data.customerDemographics.ageGroups.map((group, idx) => (
          <View key={idx} className="mb-4">
            <View className="flex-row justify-between mb-1">
              <Text className="text-sm font-medium text-gray-600">{group.label}</Text>
              <Text className="text-sm font-bold text-gray-900">{group.value}%</Text>
            </View>
            <View className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <View 
                className={`h-full rounded-full ${idx === 0 ? 'bg-indigo-500' : idx === 1 ? 'bg-purple-500' : idx === 2 ? 'bg-pink-500' : 'bg-gray-400'}`} 
                style={{ width: `${group.value}%` }} 
              />
            </View>
          </View>
        ))}
      </View>

      <Text className="text-xl font-bold text-gray-900 mb-4">Reservation & Claim Log</Text>
      
      {/* Reservation Log List */}
      <View className="mb-8 space-y-4">
        {claimedCoupons.filter(c => c.status === 'Active').length === 0 ? (
          <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 items-center">
            <Text className="text-gray-500 font-medium">No active reservations at this time.</Text>
          </View>
        ) : (
          claimedCoupons.filter(c => c.status === 'Active').map((coupon) => (
            <View key={coupon.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className="text-lg font-bold text-gray-900">{coupon.customerName || "Anonymous Customer"}</Text>
                  <Text className="text-sm font-medium text-red-600">{coupon.title}</Text>
                </View>
                <View className="bg-gray-100 px-3 py-1.5 rounded-full">
                  <Text className="text-gray-700 font-bold text-xs">{coupon.code}</Text>
                </View>
              </View>
              
              <Text className="text-gray-400 text-xs mb-4">Expires: {coupon.expiry}</Text>

              <View className="flex-row justify-between space-x-2">
                <TouchableOpacity 
                  onPress={() => {
                    nudgeCustomer(coupon.id);
                    setNudgedCoupons(prev => [...prev, coupon.id]);
                    setTimeout(() => {
                      setNudgedCoupons(prev => prev.filter(id => id !== coupon.id));
                    }, 2000);
                  }}
                  disabled={nudgedCoupons.includes(coupon.id)}
                  className={`flex-1 py-2.5 rounded-xl items-center ${nudgedCoupons.includes(coupon.id) ? 'bg-green-100' : 'bg-blue-50'}`}
                >
                  <Text className={`font-bold text-xs uppercase ${nudgedCoupons.includes(coupon.id) ? 'text-green-700' : 'text-blue-700'}`}>
                    {nudgedCoupons.includes(coupon.id) ? 'Sent!' : 'Nudge'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => {
                    cancelCoupon(coupon.id);
                  }}
                  className="flex-1 bg-gray-100 py-2.5 rounded-xl items-center"
                >
                  <Text className="text-gray-600 font-bold text-xs uppercase">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => {
                    redeemById(coupon.id);
                  }}
                  className="flex-1 bg-green-500 py-2.5 rounded-xl items-center shadow-sm"
                >
                  <Text className="text-white font-bold text-xs uppercase">Verify</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
