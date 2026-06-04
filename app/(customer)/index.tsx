import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Modal, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { DealCard } from '../../components/ui/DealCard';
import { Ionicons } from '@expo/vector-icons';
import { useOfferStore, Offer } from '../../store/useOfferStore';
import { useCouponStore } from '../../store/useCouponStore';
import { Button } from '../../components/ui/Button';

export default function CustomerHome() {
  const { offers } = useOfferStore();
  const { claimCoupon, hasClaimedOffer } = useCouponStore();
  const activeOffers = offers.filter(o => o.status === 'Active');
  
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  return (
    <View className="flex-1 bg-white">
      <ScrollView 
        className="flex-1 bg-white" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header & Location */}
        <View className="px-6 pt-6 pb-2">
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={24} color="#111827" />
              <Text className="text-gray-900 text-xl font-bold ml-2">Damascus</Text>
              <Ionicons name="chevron-down" size={20} color="#111827" className="ml-1" />
            </View>
            <View className="relative">
              <Ionicons name="notifications-outline" size={24} color="#111827" />
              <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand rounded-full border border-white" />
            </View>
          </View>
          
          <View className="bg-gray-100 flex-row items-center px-4 py-3 rounded-full">
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput 
              placeholder="Search..." 
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-2 text-gray-900 font-medium"
            />
          </View>
        </View>

        {/* Categories Carousel */}
        <View className="mt-4 pl-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-3 pr-6">
            {['All', 'Supermarket', 'Electronic', 'Fashion', 'More'].map((cat, i) => (
              <View key={cat} className={`px-6 py-2.5 rounded-full mr-3 border ${i === 0 ? 'bg-brand border-brand' : 'bg-white border-gray-200'}`}>
                <Text className={i === 0 ? 'text-white font-bold' : 'text-gray-600 font-medium'}>{cat}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Best Reserve Offers (Horizontal Carousel) */}
        <View className="mt-8">
          <View className="px-6 flex-row justify-between items-end mb-4">
            <Text className="text-xl font-extrabold text-gray-900">Best reserve offers</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6 pr-6">
            {activeOffers.slice(0, 3).map((offer, i) => (
              <View key={`best-${offer.id}`} className="mr-4 w-64">
                <DealCard 
                  title={offer.title} 
                  store={offer.store} 
                  distance={offer.distance} 
                  branchType={offer.branchType}
                  specificBranchName={offer.specificBranchName}
                  imageUrl={offer.imageUrl}
                  imageSource={i % 2 === 0 ? require('../../assets/images/pizza_deal.png') : require('../../assets/images/coffee_deal.png')}
                  badge={offer.discountPrice ? `${offer.discountPrice}` : "🔥 Flash Deal"}
                  onPress={() => setSelectedOffer(offer)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Popular Sellers */}
        <View className="mt-6">
          <View className="px-6 flex-row justify-between items-end mb-4">
            <Text className="text-xl font-extrabold text-gray-900">Popular Sellers</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6 pr-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <View key={`seller-${item}`} className="mr-5 items-center">
                <View className="w-16 h-16 rounded-full bg-gray-200 border-2 border-brand overflow-hidden mb-2 items-center justify-center">
                  <Ionicons name="storefront" size={24} color="#9ca3af" />
                </View>
                <Text className="text-xs font-medium text-gray-600">Store {item}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* All Deals Vertical List */}
        <View className="p-6 mt-2">
          {activeOffers.length === 0 ? (
             <Text className="text-gray-500 mt-4 text-center">No active deals found nearby.</Text>
          ) : (
            activeOffers.map((offer, i) => (
              <View key={offer.id} className="relative">
                <DealCard 
                  title={offer.title} 
                  store={offer.store} 
                  distance={offer.distance} 
                  branchType={offer.branchType}
                  specificBranchName={offer.specificBranchName}
                  imageUrl={offer.imageUrl}
                  imageSource={i % 2 === 0 ? require('../../assets/images/pizza_deal.png') : require('../../assets/images/coffee_deal.png')}
                  badge={offer.discountPrice ? `${offer.discountPrice}` : "🔥 Deal"}
                  onPress={() => setSelectedOffer(offer)}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Offer Details Modal */}
      <Modal visible={!!selectedOffer} animationType="slide" transparent={true}>
        {selectedOffer && (
          <View className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="relative w-full h-80">
                <Image 
                  source={selectedOffer.imageUrl ? { uri: selectedOffer.imageUrl } : (activeOffers.findIndex(o => o.id === selectedOffer.id) % 2 === 0 ? require('../../assets/images/pizza_deal.png') : require('../../assets/images/coffee_deal.png'))} 
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  onPress={() => setSelectedOffer(null)}
                  className="absolute top-12 left-6 bg-white/90 p-2 rounded-full shadow-sm"
                >
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
              </View>
              
              <View className="p-6 -mt-8 bg-white rounded-t-3xl">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-2xl font-black text-gray-900">{selectedOffer.title}</Text>
                  <Ionicons name="bookmark-outline" size={24} color="#ED1C24" />
                </View>
                
                <Text className="text-gray-400 font-medium mb-6">Valid from 01.06.2026 to 05.06.2026</Text>
                
                <View className="bg-gray-50 p-5 rounded-2xl mb-6">
                  <Text className="text-xl font-bold text-gray-900 mb-2">Description</Text>
                  <Text className="text-gray-600 leading-relaxed">
                    {selectedOffer.description || "Enjoy our exclusive deal available only for a limited time!"}
                  </Text>
                </View>

                {/* Rating & Location placeholder */}
                <View className="flex-row items-center justify-between mb-8 pb-6 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-full bg-gray-200 mr-3 items-center justify-center">
                      <Ionicons name="person" size={20} color="#9ca3af" />
                    </View>
                    <View>
                      <Text className="font-bold text-gray-900">{selectedOffer.store}</Text>
                      <View className="flex-row items-center mt-1">
                        {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={12} color="#EAB308" />)}
                      </View>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row space-x-4 mb-8">
                  <TouchableOpacity className="flex-1 bg-brand py-4 rounded-xl flex-row justify-center items-center mr-2">
                    <Text className="text-white font-bold text-lg mr-2">Get Location</Text>
                    <Ionicons name="megaphone" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-accent-blue py-4 rounded-xl flex-row justify-center items-center ml-2">
                    <Text className="text-white font-bold text-lg mr-2">Share</Text>
                    <Ionicons name="arrow-redo" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}
