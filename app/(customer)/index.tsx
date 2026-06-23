import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useOfferStore } from '../../store/useOfferStore';

export default function CustomerHome() {
  const router = useRouter();
  const { offers } = useOfferStore();
  
  const [selectedCategory, setSelectedCategory] = useState('All');

  const activeOffers = (offers || []).filter(o => o.status === 'Active');

  const categories = [
    { name: 'All', icon: 'grid' },
    { name: 'SuperMarkt', icon: 'cart' },
    { name: 'Electronic', icon: 'laptop' },
    { name: 'Fashion', icon: 'shirt' },
    { name: 'More', icon: 'ellipsis-horizontal' }
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

      {/* Categories */}
      <View className="bg-white pb-6 pt-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6" contentContainerStyle={{ paddingRight: 24 }}>
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

      {/* Feed */}
      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {activeOffers.map((offer, i) => (
          <TouchableOpacity 
            key={offer.id} 
            className="bg-white rounded-[32px] overflow-hidden mb-8 shadow-xl shadow-gray-200/50 border border-gray-100"
            activeOpacity={0.95}
            onPress={() => router.push(`/offer/${offer.id}`)}
          >
            
            {/* Image Area */}
            <View className="relative h-64 w-full bg-gray-200">
              <Image 
                source={offer.imageUrl ? { uri: offer.imageUrl } : (i % 2 === 0 ? require('../../assets/images/pizza_deal.png') : require('../../assets/images/coffee_deal.png'))}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              {/* Premium Top Left Badge */}
              <View className="absolute top-4 left-4 bg-brand/90 backdrop-blur-md rounded-2xl px-4 py-1.5 shadow-sm">
                <Text className="text-white font-bold text-xs uppercase tracking-wider">Top Deal</Text>
              </View>
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
                <Text className="text-sm text-gray-500 font-medium ml-1.5">Valid: 01.06.26 - 05.06.26</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {activeOffers.length === 0 && (
          <View className="items-center justify-center mt-12">
            <Ionicons name="search-outline" size={64} color="#e5e7eb" />
            <Text className="text-center text-gray-500 mt-4 text-lg font-medium">No active deals found.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
