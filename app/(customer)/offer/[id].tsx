import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useOfferStore } from '../../../store/useOfferStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { usePopup } from '../../../components/ui/PopupProvider';
import { Button } from '../../../components/ui/Button';

export default function OfferDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { offers, claimOffer } = useOfferStore();
  const { user } = useAuthStore();
  const { showPopup } = usePopup();

  const [isClaiming, setIsClaiming] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [loadingClaimStatus, setLoadingClaimStatus] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const screenWidth = Dimensions.get('window').width;

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    if (activeSlide !== index) {
      setActiveSlide(index);
    }
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * screenWidth, animated: true });
    setActiveSlide(index);
  };

  const offer = offers.find(o => o.id === id);

  useEffect(() => {
    const checkClaimStatus = async () => {
      setLoadingClaimStatus(true);
      if (user && db && offer) {
        try {
          const claimsRef = collection(db, 'claims');
          const q = query(claimsRef, where('offerId', '==', offer.id), where('customerId', '==', user.uid));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            setHasClaimed(true);
          } else {
            setHasClaimed(false);
          }
        } catch (e) {
          console.error("Error checking claim status", e);
          setHasClaimed(false);
        }
      } else {
        setHasClaimed(false);
      }
      setLoadingClaimStatus(false);
    };
    checkClaimStatus();
  }, [user, offer?.id]);

  if (!offer) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Ionicons name="alert-circle-outline" size={64} color="#e5e7eb" />
        <Text className="text-gray-500 mt-4 text-lg font-medium">Offer not found</Text>
        <Button title="Go Back" onPress={() => router.back()} className="mt-6" />
      </View>
    );
  }

  const now = new Date().toISOString();
  const isExpired = !!offer.endDate && now > offer.endDate;
  const isSoldOut = offer.limitType === 'Limited' && !!offer.limitCount && offer.claimedCount !== undefined && offer.claimedCount >= offer.limitCount;
  const isInactive = isExpired || isSoldOut || offer.status !== 'Active';

  const handleClaim = async () => {
    if (!user) {
      showPopup('error', 'Login Required', 'Please log in to claim this offer.');
      return;
    }

    setIsClaiming(true);
    const result = await claimOffer(offer.id);
    setIsClaiming(false);

    if (result.success) {
      setHasClaimed(true);
      showPopup('success', 'Offer Claimed!', offer.requiresCoupon && offer.couponCode 
        ? `Your secret code is: ${offer.couponCode}` 
        : 'Show this app at the store to redeem your deal.');
    } else {
      showPopup('error', 'Claim Failed', result.message);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Full Image Header */}
        <View className="relative w-full h-80 bg-gray-200">
          {offer.imageUrls && offer.imageUrls.length > 0 ? (
            <>
              <ScrollView 
                ref={scrollViewRef}
                horizontal 
                pagingEnabled 
                showsHorizontalScrollIndicator={false} 
                className="w-full h-full"
                onScroll={handleScroll}
                scrollEventThrottle={16}
                snapToInterval={screenWidth}
                decelerationRate="fast"
              >
                {offer.imageUrls.map((url, index) => (
                  <Image 
                    key={index}
                    source={{ uri: url }}
                    style={{ width: screenWidth, height: '100%' }}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>

              {/* Web Navigation Arrows */}
              {offer.imageUrls.length > 1 && (
                <>
                  {activeSlide > 0 && (
                    <TouchableOpacity 
                      onPress={() => goToSlide(activeSlide - 1)}
                      className="absolute left-4 top-1/2 -mt-4 w-10 h-10 bg-black/40 rounded-full items-center justify-center backdrop-blur-sm"
                    >
                      <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>
                  )}
                  {activeSlide < offer.imageUrls.length - 1 && (
                    <TouchableOpacity 
                      onPress={() => goToSlide(activeSlide + 1)}
                      className="absolute right-4 top-1/2 -mt-4 w-10 h-10 bg-black/40 rounded-full items-center justify-center backdrop-blur-sm"
                    >
                      <Ionicons name="chevron-forward" size={24} color="white" />
                    </TouchableOpacity>
                  )}
                </>
              )}
              
              {/* Pagination Dots */}
              {offer.imageUrls.length > 1 && (
                <View className="absolute bottom-12 w-full flex-row justify-center space-x-2">
                  {offer.imageUrls.map((_, idx) => (
                    <TouchableOpacity 
                      key={idx} 
                      onPress={() => goToSlide(idx)}
                      className="p-1"
                    >
                      <View className={`h-2 rounded-full ${activeSlide === idx ? 'w-4 bg-white' : 'w-2 bg-white/50'}`} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          ) : offer.imageUrl ? (
            <Image 
              source={{ uri: offer.imageUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-200">
              <Ionicons name="image-outline" size={64} color="#9ca3af" />
            </View>
          )}
          
          <TouchableOpacity 
            onPress={() => router.back()}
            className="absolute top-12 left-4 w-12 h-12 bg-black/30 backdrop-blur-md rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          {isExpired && (
            <View className="absolute top-12 right-4 bg-gray-900/90 rounded-2xl px-4 py-1.5 shadow-sm">
              <Text className="text-white font-bold tracking-wider">EXPIRED</Text>
            </View>
          )}
          {isSoldOut && !isExpired && (
            <View className="absolute top-12 right-4 bg-gray-900/90 rounded-2xl px-4 py-1.5 shadow-sm">
              <Text className="text-white font-bold tracking-wider">SOLD OUT</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View className="px-6 py-6 -mt-8 bg-white rounded-t-[32px]">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-3xl font-extrabold text-gray-900 flex-1 mr-4">{offer.title}</Text>
          </View>
          
          <Text className="text-xl text-brand font-black mb-4">
            {offer.discountPrice} <Text className="text-sm text-gray-400 line-through font-medium">{offer.originalPrice}</Text>
          </Text>

          <View className="flex-row items-center mb-6 bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm">
              <Ionicons name="storefront" size={24} color="#ED1C24" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-gray-900 font-bold text-lg">{offer.store}</Text>
              <Text className="text-gray-500 font-medium text-sm">{offer.distance || '2 Km'} away</Text>
            </View>
          </View>

          <Text className="text-gray-900 font-bold text-lg mb-2">About this Deal</Text>
          <Text className="text-gray-600 text-base leading-relaxed mb-6">
            {offer.description}
          </Text>

          <Text className="text-gray-900 font-bold text-lg mb-2">Valid Dates</Text>
          <View className="flex-row items-center bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
            <Ionicons name="calendar-outline" size={24} color="#6b7280" />
            <Text className="text-gray-700 font-medium ml-3 text-base">{offer.startDate || 'Start'} to {offer.endDate || 'End'}</Text>
          </View>

          {offer.limitType === 'Limited' && (
            <View className="flex-row items-center bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
              <Ionicons name="people-outline" size={24} color="#6b7280" />
              <Text className="text-gray-700 font-medium ml-3 text-base">
                {offer.claimedCount || 0} / {offer.limitCount} claimed
              </Text>
            </View>
          )}

        </View>
      </ScrollView>

      {/* Floating Claim Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg pt-4 pb-8 px-6 border-t border-gray-100">
        <TouchableOpacity 
          disabled={isInactive || isClaiming || hasClaimed || loadingClaimStatus}
          onPress={hasClaimed ? undefined : handleClaim}
          className={`py-4 rounded-2xl items-center justify-center flex-row shadow-lg ${isInactive || hasClaimed ? 'bg-gray-300 shadow-none' : 'bg-brand shadow-brand/30'}`}
        >
          {isClaiming || loadingClaimStatus ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg tracking-wider">
              {hasClaimed ? 'ALREADY CLAIMED' : isExpired ? 'EXPIRED' : isSoldOut ? 'SOLD OUT' : 'CLAIM THIS DEAL'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
