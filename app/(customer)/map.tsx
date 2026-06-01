import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOfferStore, Offer } from '../../store/useOfferStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.82;

export default function CustomerMap() {
  const { offers } = useOfferStore();
  const activeOffers = offers.filter(o => o.status === 'Active');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeIndex, setActiveIndex] = useState(0);

  // Stylized coordinates for mock map pins to center cards on selection
  const mockPins = [
    { id: '1', top: '35%', left: '25%', label: "Luigi's Pizzeria" },
    { id: '2', top: '55%', left: '65%', label: "Brew & Co." },
  ];

  return (
    <View className="flex-1 bg-gray-100 relative">
      
      {/* 1. MOCK PREMIUM STYLIZED MAP SYSTEM */}
      <View className="absolute inset-0 bg-gray-50 flex justify-center items-center overflow-hidden">
        {/* Stylized background grid representing roads */}
        <View className="absolute w-[200%] h-[200%] rotate-12 flex-row flex-wrap opacity-[0.08]">
          {Array.from({ length: 48 }).map((_, i) => (
            <View 
              key={i} 
              className="w-48 h-48 border border-gray-900 border-dashed"
            />
          ))}
        </View>

        {/* Mock Custom Styled Roads & Parks */}
        <View className="absolute top-[40%] left-0 right-0 h-10 bg-white shadow-sm rotate-[15deg] opacity-60" />
        <View className="absolute top-0 bottom-0 left-[35%] w-10 bg-white shadow-sm -rotate-[45deg] opacity-60" />
        <View className="absolute w-[250] h-[250] bg-green-50 rounded-full top-[10%] left-[-50] opacity-50" />
        <View className="absolute w-[300] h-[150] bg-blue-50 rounded-full bottom-[10%] right-[-50] opacity-50" />

        {/* Mock Pins */}
        {mockPins.map((pin, i) => {
          const isSelected = activeIndex === i;
          return (
            <TouchableOpacity 
              key={pin.id} 
              style={{ position: 'absolute', top: pin.top, left: pin.left }}
              className="items-center justify-center"
              activeOpacity={0.8}
            >
              {/* Pulse effect */}
              {isSelected && (
                <View className="absolute w-12 h-12 bg-red-600/20 rounded-full animate-ping" />
              )}
              {/* Main Pin */}
              <View className={`${isSelected ? 'bg-red-600 scale-125' : 'bg-gray-950'} p-3 rounded-full shadow-lg border-2 border-white`}>
                <Ionicons 
                  name={i === 0 ? "pizza" : "cafe"} 
                  size={18} 
                  color="white" 
                />
              </View>
              {/* Pin Label */}
              <View className="bg-white/95 px-2.5 py-1 rounded-lg shadow-sm border border-gray-100 mt-1.5">
                <Text className="text-gray-900 font-bold text-[10px]">{pin.label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 2. FLOATING CATEGORIES BAR */}
      <View className="absolute top-6 left-0 right-0 px-6 z-10">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-3">
          {['All', '🍕 Food', '👕 Retail', '✂️ Services'].map((cat) => {
            const isSelected = selectedCategory === cat || (cat === 'All' && selectedCategory === 'All');
            return (
              <TouchableOpacity 
                key={cat} 
                onPress={() => setSelectedCategory(cat)}
                className={`px-5 py-3 rounded-full shadow-sm mr-2 flex-row items-center border ${
                  isSelected ? 'bg-red-600 border-red-600' : 'bg-white border-gray-100'
                }`}
              >
                <Text className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-700'}`}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. HORIZONTALLY SCROLLING DEALS CAROUSEL */}
      <View className="absolute bottom-10 left-0 right-0 z-10">
        <ScrollView 
          horizontal 
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 16}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: (width - CARD_WIDTH) / 2 }}
          onScroll={(e) => {
            const xOffset = e.nativeEvent.contentOffset.x;
            const index = Math.round(xOffset / (CARD_WIDTH + 16));
            if (index !== activeIndex && index >= 0 && index < activeOffers.length) {
              setActiveIndex(index);
            }
          }}
          scrollEventThrottle={16}
        >
          {activeOffers.map((offer, i) => (
            <TouchableOpacity 
              key={offer.id} 
              activeOpacity={0.9}
              style={{ width: CARD_WIDTH }}
              className="bg-white p-4 rounded-[28px] shadow-lg border border-gray-100 mr-4 flex-row items-center overflow-hidden"
            >
              {/* Deal Icon Box */}
              <View className="w-20 h-20 bg-red-50 rounded-2xl items-center justify-center mr-4 border border-red-100">
                <Ionicons name={i === 0 ? "pizza" : "cafe"} size={36} color="#dc2626" />
              </View>

              {/* Deal Info */}
              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-gray-400 font-bold text-xs uppercase tracking-wider">{offer.distance}</Text>
                  <View className="bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                    <Text className="text-red-700 font-extrabold text-[10px]">{offer.discountPrice}</Text>
                  </View>
                </View>
                <Text className="text-gray-900 font-bold text-base mb-1" numberOfLines={1}>{offer.title}</Text>
                <Text className="text-gray-500 font-medium text-xs mb-2" numberOfLines={1}>{offer.store}</Text>
                
                <View className="flex-row items-center">
                  <Ionicons name="time" size={12} color="#dc2626" />
                  <Text className="text-red-600 font-medium text-[11px] ml-1">Expires in 2 hours</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

    </View>
  );
}
