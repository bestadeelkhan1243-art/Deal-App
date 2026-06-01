import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Modal, TouchableOpacity, Image } from 'react-native';
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
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header & Search */}
        <View className="bg-gray-950 px-6 pt-6 pb-8 rounded-b-[40px] shadow-sm">
          <Text className="text-white/80 text-base font-medium mb-1">Location</Text>
          <View className="flex-row items-center mb-6">
            <Ionicons name="location" size={20} color="#dc2626" />
            <Text className="text-white text-xl font-bold ml-1">Damascus, SY</Text>
            <Ionicons name="chevron-down" size={20} color="white" className="ml-1" />
          </View>
          
          <View className="bg-white/10 flex-row items-center px-4 py-3 rounded-2xl border border-white/5">
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput 
              placeholder="Search for deals, food, retail..." 
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-2 text-white font-medium"
            />
          </View>
        </View>

        {/* Categories Carousel */}
        <View className="mt-6 pl-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-3 pr-6">
            {['All', '🍕 Food', '👕 Retail', '✂️ Services', '🎉 Fun'].map((cat, i) => (
              <View key={cat} className={`px-5 py-2.5 rounded-full mr-3 ${i === 0 ? 'bg-red-600' : 'bg-white border border-gray-200'}`}>
                <Text className={i === 0 ? 'text-white font-bold' : 'text-gray-600 font-medium'}>{cat}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Featured Deals */}
        <View className="p-6">
          <View className="flex-row justify-between items-end mb-4">
            <Text className="text-2xl font-extrabold text-gray-900">Featured Deals</Text>
            <Text className="text-red-600 font-bold mb-1">See All</Text>
          </View>
          
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
                  badge={offer.discountPrice ? `${offer.discountPrice}` : "🔥 Flash Deal"}
                  onPress={() => setSelectedOffer(offer)}
                />
                {offer.requiresCoupon && (
                  <View className="absolute top-2 right-2 bg-black/70 px-3 py-1 rounded-full flex-row items-center">
                    <Ionicons name="ticket" size={12} color="white" />
                    <Text className="text-white text-[10px] font-bold ml-1 uppercase">Coupon Required</Text>
                  </View>
                )}
                {hasClaimedOffer(offer.id) && (
                   <View className="absolute top-2 left-2 bg-green-500/90 px-3 py-1 rounded-full flex-row items-center">
                    <Ionicons name="checkmark-circle" size={12} color="white" />
                    <Text className="text-white text-[10px] font-bold ml-1 uppercase">Claimed</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Offer Details Modal */}
      <Modal visible={!!selectedOffer} animationType="slide" transparent={true}>
        {selectedOffer && (
          <View className="flex-1 justify-end bg-black/60">
            <View className="bg-white rounded-t-[40px] overflow-hidden max-h-[90%]">
              <View className="relative w-full h-64">
                <Image 
                  source={selectedOffer.imageUrl ? { uri: selectedOffer.imageUrl } : (activeOffers.findIndex(o => o.id === selectedOffer.id) % 2 === 0 ? require('../../assets/images/pizza_deal.png') : require('../../assets/images/coffee_deal.png'))} 
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  onPress={() => setSelectedOffer(null)}
                  className="absolute top-6 right-6 bg-black/50 p-2 rounded-full"
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
              
              <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-3xl font-extrabold text-gray-900 flex-1 pr-4">{selectedOffer.title}</Text>
                </View>
                
                <View className="flex-row items-center mb-6">
                  <Ionicons name="storefront" size={16} color="#6b7280" />
                  <Text className="text-gray-500 font-medium ml-2 mr-4">{selectedOffer.store}</Text>
                  <Ionicons name="location" size={16} color="#6b7280" />
                  <Text className="text-gray-500 font-medium ml-1">{selectedOffer.distance}</Text>
                </View>

                <View className="bg-red-50/50 p-4 rounded-2xl mb-6 flex-row items-center justify-between border border-red-100">
                  <View>
                    <Text className="text-red-800 font-bold text-lg">Special Deal</Text>
                  </View>
                  <Text className="text-3xl font-extrabold text-red-600">{selectedOffer.discountPrice}</Text>
                </View>

                <Text className="text-xl font-bold text-gray-900 mb-2">Details</Text>
                <Text className="text-gray-600 leading-relaxed mb-6">
                  {selectedOffer.description || "No specific details provided for this offer. Claim it before it expires!"}
                </Text>

                <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="location" size={20} color="#dc2626" />
                    <Text className="text-gray-900 font-bold ml-2">Available At</Text>
                  </View>
                  <Text className="text-gray-700 ml-7 font-medium">
                    {selectedOffer.branchType === 'Specific Location' && selectedOffer.specificBranchName
                      ? selectedOffer.specificBranchName
                      : "All Branches"}
                  </Text>
                </View>

                {selectedOffer.requiresCoupon && (
                   <View className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-8 flex-row items-start">
                     <Ionicons name="warning" size={20} color="#ca8a04" className="mt-0.5 mr-2" />
                     <Text className="text-yellow-800 flex-1 font-medium text-sm">
                       This offer requires a coupon code. Claim it now and present the code at the store to redeem.
                     </Text>
                   </View>
                )}

                <Button 
                  title={hasClaimedOffer(selectedOffer.id) ? "Already Claimed" : "Claim Deal Now"} 
                  className={`py-4 shadow-sm mb-12 ${hasClaimedOffer(selectedOffer.id) ? 'bg-gray-400' : 'bg-red-600'}`}
                  disabled={hasClaimedOffer(selectedOffer.id)}
                  onPress={() => {
                    if (selectedOffer.requiresCoupon) {
                      claimCoupon({
                        offerId: selectedOffer.id,
                        title: selectedOffer.title,
                        store: selectedOffer.store,
                        code: selectedOffer.couponCode || 'DEAL-XXXX',
                        expiry: selectedOffer.expiry
                      });
                      alert('Coupon Claimed! Check your profile wallet.');
                    } else {
                      alert('Deal Claimed! Show this screen at the store.');
                    }
                    setSelectedOffer(null);
                  }}
                />
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}
