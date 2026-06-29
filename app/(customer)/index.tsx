import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useOfferStore } from '../../store/useOfferStore';

export default function CustomerHome() {
  const router = useRouter();
  const { offers, isLoading } = useOfferStore();
  
  const [selectedCategory, setSelectedCategory] = useState('All');

  const todayStr = new Date().toISOString().split('T')[0];

  // Sort offers so active ones show first, expired/sold out ones show at bottom
  const sortedOffers = [...(offers || [])].sort((a, b) => {
    const aExpired = a.endDate && todayStr > a.endDate;
    const bExpired = b.endDate && todayStr > b.endDate;
    const aSoldOut = a.limitType === 'Limited' && a.limitCount && a.claimedCount !== undefined && a.claimedCount >= a.limitCount;
    const bSoldOut = b.limitType === 'Limited' && b.limitCount && b.claimedCount !== undefined && b.claimedCount >= b.limitCount;
    
    const aInactive = aExpired || aSoldOut || a.status !== 'Active';
    const bInactive = bExpired || bSoldOut || b.status !== 'Active';
    
    if (aInactive && !bInactive) return 1;
    if (!aInactive && bInactive) return -1;
    return 0;
  });

  const visibleOffers = sortedOffers.filter(o => {
    const isActive = o.status === 'Active';
    const matchesCategory = selectedCategory === 'All' || o.category === selectedCategory;
    return isActive && matchesCategory;
  });

  const categories = [
    { name: 'All', icon: 'grid' },
    { name: 'Supermarket & Grocery', icon: 'cart' },
    { name: 'Restaurant & Cafe', icon: 'restaurant' },
    { name: 'Clothing & Fashion', icon: 'shirt' },
    { name: 'Electronics & Gadgets', icon: 'laptop' },
    { name: 'Beauty, Salon & Spa', icon: 'sparkles' }
  ];

  return (
    <View className="flex-1 bg-[#f9fafb]">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 bg-white">
        <View className="flex-row justify-between items-center mb-1">
          <View className="flex-row items-center">
            <Text className="text-gray-900 text-base font-medium">Damaskus</Text>
            <Ionicons name="chevron-forward" size={16} color="#ef4444" className="ml-1" />
          </View>
          <View className="relative">
            <Ionicons name="notifications-outline" size={24} color="#111827" />
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full items-center justify-center border border-white">
              <Text className="text-[8px] text-white font-bold">2</Text>
            </View>
          </View>
        </View>
        <Text className="text-gray-600 text-xs font-medium">Hello Khaled, Look to the next Deal.</Text>
      </View>

      {/* Feed & Categories */}
      <ScrollView className="flex-1 pt-2" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Categories inside ScrollView so they scroll away */}
        <View className="bg-white pb-6 mb-6 rounded-b-[32px] shadow-sm border-b border-gray-100">
          <ScrollView horizontal showsHorizontalScrollIndicator={true} className="pl-6" contentContainerStyle={{ paddingRight: 24 }}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <TouchableOpacity 
                  key={cat.name} 
                  onPress={() => setSelectedCategory(cat.name)}
                  className="items-center mr-6"
                >
                  <View className={`w-16 h-16 rounded-3xl mb-2 items-center justify-center shadow-sm border ${isActive ? 'bg-brand border-brand shadow-brand/30' : 'bg-gray-50 border-gray-100'}`}>
                    <Ionicons name={cat.icon as any} size={24} color={isActive ? 'white' : '#6b7280'} />
                  </View>
                  <Text className={`text-[11px] tracking-wide ${isActive ? 'text-gray-900 font-bold' : 'text-gray-500 font-medium'}`}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View className="px-5">

        {visibleOffers.map((offer, i) => {
          const isExpired = offer.endDate && todayStr > offer.endDate;
          const isSoldOut = offer.limitType === 'Limited' && offer.limitCount && offer.claimedCount !== undefined && offer.claimedCount >= offer.limitCount;
          const isInactive = isExpired || isSoldOut;

          return (
          <TouchableOpacity 
            key={offer.id} 
            className={`bg-white rounded-[32px] overflow-hidden mb-8 shadow-xl shadow-gray-200/50 border border-gray-100 ${isInactive ? 'opacity-70' : ''}`}
            activeOpacity={0.95}
            onPress={() => router.push(`/(customer)/offer/${offer.id}`)}
          >
            
            {/* Image Area */}
            <View className="relative h-64 w-full bg-gray-200">
              {offer.imageUrl ? (
                <Image 
                  source={{ uri: offer.imageUrl }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center bg-gray-200">
                  <Ionicons name="image-outline" size={48} color="#9ca3af" />
                </View>
              )}
              {/* Premium Top Left Badge */}
              {isExpired ? (
                <View className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur-md rounded-2xl px-4 py-1.5 shadow-sm">
                  <Text className="text-white font-bold text-xs uppercase tracking-wider">Expired</Text>
                </View>
              ) : isSoldOut ? (
                <View className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur-md rounded-2xl px-4 py-1.5 shadow-sm">
                  <Text className="text-white font-bold text-xs uppercase tracking-wider">Sold Out</Text>
                </View>
              ) : (
                <View className="absolute top-4 left-4 bg-brand/90 backdrop-blur-md rounded-2xl px-4 py-1.5 shadow-sm">
                  <Text className="text-white font-bold text-xs uppercase tracking-wider">Top Deal</Text>
                </View>
              )}
              {/* Distance Badge */}
              <View className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl px-3 py-1.5 shadow-sm flex-row items-center">
                <Ionicons name="location" size={14} color="#ED1C24" />
                <Text className="text-gray-900 font-bold text-xs ml-1">{offer.distance || '2 Km'}</Text>
              </View>
            </View>

            {/* Deal Info */}
            <View className="p-6">
              <View className="flex-row justify-between items-start">
                <Text className="text-2xl font-extrabold text-gray-900 flex-1 mr-4 leading-tight">{offer.title}</Text>
              </View>
              
              <View className="flex-row items-center mt-3">
                <Ionicons name="time-outline" size={16} color="#9ca3af" />
                <Text className="text-sm text-gray-500 font-medium ml-1.5">Valid: {offer.startDate || 'Start'} - {offer.endDate || 'End'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )})}
        {visibleOffers.length === 0 && (
          <View className="items-center justify-center mt-12">
            {isLoading ? (
              <ActivityIndicator size="large" color="#ED1C24" />
            ) : (
              <>
                <Ionicons name="search-outline" size={64} color="#e5e7eb" />
                <Text className="text-center text-gray-500 mt-4 text-lg font-medium">No active deals found.</Text>
              </>
            )}
          </View>
        )}
        </View>
      </ScrollView>
    </View>
  );
}
