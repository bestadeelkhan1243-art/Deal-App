import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOfferStore } from '../../../store/useOfferStore';
import { useSavedStore } from '../../../store/useSavedStore';
import { usePopup } from '../../../components/ui/PopupProvider';

export default function OfferDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { offers } = useOfferStore();
  const { isSaved, toggleSave } = useSavedStore();
  const { showPopup } = usePopup();

  const offer = offers.find(o => o.id === id);

  const handleClaim = () => {
    showPopup('success', 'Deal Claimed!', 'Present this at the store to redeem your offer.');
  };

  if (!offer) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Offer not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f9fafb]">
      {/* Header */}
      <View className="absolute top-10 left-4 z-10 flex-row justify-between right-4">
        <TouchableOpacity onPress={() => router.back()} className="bg-white/80 p-2 rounded-full">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleSave(offer.id)} className="bg-white/80 p-2 rounded-full">
          <Ionicons name={isSaved(offer.id) ? "bookmark" : "bookmark-outline"} size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image */}
        <View className="relative h-80 w-full bg-white">
          <Image 
            source={offer.imageUrl ? { uri: offer.imageUrl } : require('../../../assets/images/pizza_deal.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <View className="absolute top-0 left-0 bg-red-600 w-16 h-10 rounded-br-xl" />
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
                    source={require('../../../assets/images/pizza_deal.png')}
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
      </ScrollView>

      {/* Sticky Bottom Action Buttons */}
      <View className="flex-row justify-between space-x-2 px-5 py-4 bg-white border-t border-gray-100 pb-8">
        <TouchableOpacity className="bg-[#f9fafb] border border-gray-100 shadow-sm rounded-2xl p-4 items-center justify-center aspect-square">
          <Ionicons name="arrow-redo-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleSave(offer.id)} className="bg-[#f9fafb] border border-gray-100 shadow-sm rounded-2xl p-4 items-center justify-center aspect-square">
          <Ionicons name={isSaved(offer.id) ? "bookmark" : "bookmark-outline"} size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClaim} className="flex-1 bg-brand shadow-lg shadow-brand/40 rounded-2xl py-4 items-center justify-center ml-2">
          <Text className="text-white font-black tracking-widest text-lg uppercase">Claim Deal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
