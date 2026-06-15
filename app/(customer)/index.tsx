import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOfferStore } from '../../store/useOfferStore';
import { useSavedStore } from '../../store/useSavedStore';

export default function CustomerHome() {
  const { offers } = useOfferStore();
  const { isSaved, toggleSave } = useSavedStore();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [followedStores, setFollowedStores] = useState<Record<string, boolean>>({});

  const activeOffers = (offers || []).filter(o => o.status === 'Active');

  const categories = ['All', 'SuperMarkt', 'Electronic', 'Fashion', 'More'];

  const toggleFollow = (storeName: string) => {
    setFollowedStores(prev => ({ ...prev, [storeName]: !prev[storeName] }));
  };

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
      <View className="bg-white pb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6 pr-6">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity 
                key={cat} 
                onPress={() => setSelectedCategory(cat)}
                className="items-center mr-6"
              >
                <View className={`w-16 h-16 rounded-full mb-2 items-center justify-center ${isActive ? 'bg-red-600' : 'bg-gray-100'}`} />
                <Text className={`text-[10px] ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Feed */}
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {activeOffers.map((offer, i) => (
          <View key={offer.id} className="bg-gray-100 rounded-3xl overflow-hidden mb-6">
            
            {/* Image */}
            <View className="relative h-72 w-full bg-white">
              <Image 
                source={offer.imageUrl ? { uri: offer.imageUrl } : (i % 2 === 0 ? require('../../assets/images/pizza_deal.png') : require('../../assets/images/coffee_deal.png'))}
                style={{ width: '100%', height: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
                resizeMode="cover"
              />
              <View className="absolute top-0 left-0 bg-red-600 w-16 h-10 rounded-tl-3xl rounded-br-xl" />
            </View>

            {/* Deal Info */}
            <View className="bg-[#f9fafb] rounded-t-[32px] -mt-8 p-5">
              
              {/* Title & Dates Row */}
              <View className="flex-row justify-between items-end mb-4 mt-2">
                <Text className="text-2xl font-bold text-gray-900 flex-1 mr-2">{offer.title}</Text>
                <View className="items-end">
                  <Text className="text-[9px] text-gray-500 font-medium mb-1">Valid: 01.06.26 - 05.06.26</Text>
                  <Text className="text-xl font-bold text-gray-900">{offer.distance || '2 Km'}</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-between space-x-3 mt-5 mb-4">
                <TouchableOpacity className="flex-1 bg-white border border-gray-100 shadow-sm rounded-3xl py-4 items-center justify-center">
                  <Ionicons name="arrow-redo-outline" size={26} color="black" />
                  <Text className="text-black font-bold mt-1 text-sm">Share</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-white border border-gray-100 shadow-sm rounded-3xl py-4 items-center justify-center">
                  <Ionicons name="navigate-outline" size={26} color="black" style={{ transform: [{ rotate: '45deg' }] }} />
                  <Text className="text-black font-bold mt-1 text-sm">Get Location</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleSave(offer.id)} className="flex-1 bg-white border border-gray-100 shadow-sm rounded-3xl py-4 items-center justify-center">
                  <Ionicons name={isSaved(offer.id) ? "bookmark" : "bookmark-outline"} size={26} color="black" />
                  <Text className="text-black font-bold mt-1 text-sm">Save</Text>
                </TouchableOpacity>
              </View>

              {/* Description */}
              <View className="bg-white border border-gray-100 shadow-sm rounded-3xl p-5 mb-5 min-h-[100px]">
                <Text className="text-sm text-gray-600 leading-relaxed">
                  {offer.description || `Enjoy this amazing deal from ${offer.store || 'our partner'}! This exclusive offer is available for a limited time only. Make sure to claim it before it expires and enjoy the best savings in town.`}
                </Text>
              </View>

              {/* Store Profile Box */}
              <View className="bg-white border border-gray-100 shadow-sm rounded-3xl p-5 mb-2">
                <View className="flex-row justify-between items-center mb-5">
                  <TouchableOpacity 
                    onPress={() => toggleFollow(offer.store)}
                    className="flex-row items-center border border-gray-200 rounded-full px-3 py-1.5"
                  >
                    <Ionicons name="person-add-outline" size={12} color="black" />
                    <Text className="text-[10px] font-medium ml-1 text-gray-600">Follow</Text>
                  </TouchableOpacity>

                  <View className="items-center flex-1 mx-2">
                    <Text className="text-sm font-bold text-gray-900">{offer.store || "Khaled Store"}</Text>
                    <View className="flex-row space-x-1 my-1">
                      {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={8} color="#2563eb" />)}
                    </View>
                    <Text className="text-[10px] text-gray-500 pb-0.5" numberOfLines={1}>
                      {offer.branchType === 'Specific Location' ? 'Open until 10:00 PM' : 'Available Online'}
                    </Text>
                  </View>

                  <View className="w-12 h-12 rounded-full border border-gray-200 bg-white overflow-hidden justify-center items-center">
                     <Image 
                        source={i % 2 === 0 ? require('../../assets/images/coffee_deal.png') : require('../../assets/images/pizza_deal.png')}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                  </View>
                </View>

                {/* Bottom Actions */}
                <View className="flex-row justify-between px-1">
                  <TouchableOpacity className="flex-row items-center bg-gray-50 px-3 py-2 rounded-full">
                    <Ionicons name="call-outline" size={12} color="black" />
                    <Text className="text-[10px] text-gray-600 ml-1">Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center bg-gray-50 px-3 py-2 rounded-full">
                    <Ionicons name="globe-outline" size={12} color="black" />
                    <Text className="text-[10px] text-gray-600 ml-1">Web</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center bg-gray-50 px-3 py-2 rounded-full">
                    <Ionicons name="arrow-redo-outline" size={12} color="black" />
                    <Text className="text-[10px] text-gray-600 ml-1">Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center bg-gray-50 px-3 py-2 rounded-full">
                    <Ionicons name="flag-outline" size={12} color="#ef4444" />
                    <Text className="text-[10px] text-gray-500 ml-1">Report</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </View>
        ))}
        {activeOffers.length === 0 && (
          <Text className="text-center text-gray-500 mt-10">No active deals found.</Text>
        )}
      </ScrollView>
    </View>
  );
}
