import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Modal, TouchableOpacity, Image, SafeAreaView, Animated, PanResponder } from 'react-native';
import { DealCard } from '../../components/ui/DealCard';
import { Ionicons } from '@expo/vector-icons';
import { useOfferStore, Offer } from '../../store/useOfferStore';
import { useCouponStore } from '../../store/useCouponStore';
import { useSavedStore } from '../../store/useSavedStore';
import { Button } from '../../components/ui/Button';

export default function CustomerHome() {
  const { offers } = useOfferStore();
  const { claimCoupon, hasClaimedOffer } = useCouponStore();
  const { isSaved, toggleSave } = useSavedStore();
  const activeOffers = (offers || []).filter(o => o.status === 'Active');
  
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [followedStores, setFollowedStores] = useState<Record<string, boolean>>({});
  
  const [viewMode, setViewMode] = useState<'list' | 'swipe'>('list');
  const [selectedStore, setSelectedStore] = useState('All');
  const [swipeIndex, setSwipeIndex] = useState(0);

  const uniqueStores = ['All', ...Array.from(new Set(activeOffers.map(o => o.store).filter(Boolean)))];
  const filteredSwipeOffers = activeOffers.filter(offer => selectedStore === 'All' || offer.store === selectedStore);

  const position = useRef(new Animated.ValueXY()).current;
  const stateRef = useRef({ swipeIndex, filteredSwipeOffers, isSaved });

  useEffect(() => {
    stateRef.current = { swipeIndex, filteredSwipeOffers, isSaved };
  }, [swipeIndex, filteredSwipeOffers, isSaved]);

  const swipeCard = (direction: 'up' | 'down') => {
    const toValue = direction === 'up' ? -800 : 800;
    Animated.timing(position, {
      toValue: { x: 0, y: toValue },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      const { swipeIndex: currentIdx, filteredSwipeOffers: currentOffers } = stateRef.current;
      const currentOffer = currentOffers[currentIdx];
      if (currentOffer) {
        if (direction === 'up') {
          if (!isSaved(currentOffer.id)) {
            toggleSave(currentOffer.id);
          }
        }
        setSwipeIndex(currentIdx + 1);
      }
      position.setValue({ x: 0, y: 0 });
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        position.setValue({ x: 0, y: gestureState.dy });
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy < -120) {
          swipeCard('up');
        } else if (gestureState.dy > 120) {
          swipeCard('down');
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      }
    })
  ).current;

  const likeOpacity = position.y.interpolate({
    inputRange: [-120, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const dislikeOpacity = position.y.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const toggleFollow = (storeName: string) => {
    setFollowedStores(prev => ({
      ...prev,
      [storeName]: !prev[storeName]
    }));
  };

  return (
    <View className="flex-1 bg-white">
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

      {/* View Mode Toggle Switcher */}
      <View className="flex-row bg-gray-100 p-1 rounded-full mx-6 mb-4 mt-2">
        <TouchableOpacity 
          onPress={() => setViewMode('list')} 
          className={`flex-1 py-2.5 rounded-full items-center ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
        >
          <Text className={`font-bold text-sm ${viewMode === 'list' ? 'text-gray-900' : 'text-gray-500'}`}>List Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setViewMode('swipe')} 
          className={`flex-1 py-2.5 rounded-full items-center ${viewMode === 'swipe' ? 'bg-white shadow-sm' : ''}`}
        >
          <Text className={`font-bold text-sm ${viewMode === 'swipe' ? 'text-gray-900' : 'text-gray-500'}`}>Swipe Deck</Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'list' ? (
        <ScrollView 
          className="flex-1 bg-white" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
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
                <View key={`best-${offer.id}`} className="mr-4 w-64 h-[430px]">
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
                    isSaved={isSaved(offer.id)}
                    onToggleSave={() => toggleSave(offer.id)}
                    containerClassName="h-[430px] mb-0"
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
                    isSaved={isSaved(offer.id)}
                    onToggleSave={() => toggleSave(offer.id)}
                  />
                </View>
              ))
            )}
          </View>
        </ScrollView>
      ) : (
        /* Swipe View Layout */
        <View className="flex-1 bg-white">
          {/* Store Tabs */}
          <View className="mb-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6 pr-6">
              {uniqueStores.map((store) => (
                <TouchableOpacity 
                  key={store} 
                  onPress={() => {
                    setSelectedStore(store);
                    setSwipeIndex(0);
                  }}
                  className={`px-5 py-2.5 rounded-full mr-3 border ${selectedStore === store ? 'bg-black border-black' : 'bg-white border-gray-200'}`}
                >
                  <Text className={selectedStore === store ? 'text-white font-bold' : 'text-gray-600 font-medium'}>
                    {store}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Card Deck or Empty State */}
          {swipeIndex < filteredSwipeOffers.length ? (
            <View className="flex-1 justify-center items-center px-6 pb-8">
              <View className="w-full max-w-sm h-[430px] relative">
                {/* Behind Card */}
                {swipeIndex + 1 < filteredSwipeOffers.length && (
                  <View className="w-full h-full opacity-40 scale-95 top-2 absolute">
                    <DealCard 
                      title={filteredSwipeOffers[swipeIndex + 1].title} 
                      store={filteredSwipeOffers[swipeIndex + 1].store} 
                      distance={filteredSwipeOffers[swipeIndex + 1].distance} 
                      branchType={filteredSwipeOffers[swipeIndex + 1].branchType}
                      specificBranchName={filteredSwipeOffers[swipeIndex + 1].specificBranchName}
                      imageUrl={filteredSwipeOffers[swipeIndex + 1].imageUrl}
                      imageSource={activeOffers.findIndex(o => o.id === filteredSwipeOffers[swipeIndex + 1].id) % 2 === 0 ? require('../../assets/images/pizza_deal.png') : require('../../assets/images/coffee_deal.png')}
                      badge={filteredSwipeOffers[swipeIndex + 1].discountPrice ? `${filteredSwipeOffers[swipeIndex + 1].discountPrice}` : "🔥 Deal"}
                      containerClassName="h-[430px] mb-0"
                    />
                  </View>
                )}

                {/* Animated Top Card */}
                <Animated.View 
                  {...panResponder.panHandlers} 
                  style={[position.getLayout(), { width: '100%', height: '100%', position: 'absolute', zIndex: 10 }]}
                >
                  <DealCard 
                    title={filteredSwipeOffers[swipeIndex].title} 
                    store={filteredSwipeOffers[swipeIndex].store} 
                    distance={filteredSwipeOffers[swipeIndex].distance} 
                    branchType={filteredSwipeOffers[swipeIndex].branchType}
                    specificBranchName={filteredSwipeOffers[swipeIndex].specificBranchName}
                    imageUrl={filteredSwipeOffers[swipeIndex].imageUrl}
                    imageSource={activeOffers.findIndex(o => o.id === filteredSwipeOffers[swipeIndex].id) % 2 === 0 ? require('../../assets/images/pizza_deal.png') : require('../../assets/images/coffee_deal.png')}
                    badge={filteredSwipeOffers[swipeIndex].discountPrice ? `${filteredSwipeOffers[swipeIndex].discountPrice}` : "🔥 Deal"}
                    onPress={() => setSelectedOffer(filteredSwipeOffers[swipeIndex])}
                    isSaved={isSaved(filteredSwipeOffers[swipeIndex].id)}
                    onToggleSave={() => toggleSave(filteredSwipeOffers[swipeIndex].id)}
                    containerClassName="h-[430px] mb-0"
                  />
                  
                  {/* Like Badge */}
                  <Animated.View 
                    style={{ opacity: likeOpacity }} 
                    className="absolute top-10 right-10 bg-green-500 border-2 border-white px-4 py-2 rounded-xl rotate-[15deg]"
                  >
                    <Text className="text-white font-extrabold text-lg tracking-wider">LIKE</Text>
                  </Animated.View>
                  
                  {/* Dislike Badge */}
                  <Animated.View 
                    style={{ opacity: dislikeOpacity }} 
                    className="absolute top-10 left-10 bg-red-500 border-2 border-white px-4 py-2 rounded-xl -rotate-[15deg]"
                  >
                    <Text className="text-white font-extrabold text-lg tracking-wider">SKIP</Text>
                  </Animated.View>
                </Animated.View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-center items-center space-x-12 mt-8">
                <View className="items-center">
                  <TouchableOpacity 
                    onPress={() => swipeCard('down')}
                    className="w-16 h-16 rounded-full bg-white border border-red-200 shadow-md items-center justify-center active:bg-red-50"
                  >
                    <Ionicons name="close" size={32} color="#EF4444" />
                  </TouchableOpacity>
                  <Text className="text-xs text-red-500 font-bold mt-1">Deslike</Text>
                </View>
                
                <View className="items-center">
                  <TouchableOpacity 
                    onPress={() => swipeCard('up')}
                    className="w-16 h-16 rounded-full bg-white border border-green-200 shadow-md items-center justify-center active:bg-green-50"
                  >
                    <Ionicons name="heart" size={32} color="#10B981" />
                  </TouchableOpacity>
                  <Text className="text-xs text-green-500 font-bold mt-1">I like it</Text>
                </View>
              </View>
            </View>
          ) : (
            <View className="flex-1 justify-center items-center px-6 py-12">
              <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="sparkles-outline" size={40} color="#9ca3af" />
              </View>
              <Text className="text-lg font-bold text-gray-900 mb-2">No more deals to swipe!</Text>
              <Text className="text-gray-500 text-center mb-6">
                You have caught up with all active deals for this store.
              </Text>
              <TouchableOpacity 
                onPress={() => setSwipeIndex(0)}
                className="bg-black px-6 py-3 rounded-full shadow-sm"
              >
                <Text className="text-white font-bold">Start Over</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

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
                  <TouchableOpacity onPress={() => toggleSave(selectedOffer.id)}>
                    <Ionicons name={isSaved(selectedOffer.id) ? "bookmark" : "bookmark-outline"} size={28} color="#ED1C24" />
                  </TouchableOpacity>
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
                  <View className="flex-row items-center flex-1 pr-2">
                    <View className="w-12 h-12 rounded-full bg-gray-200 mr-3 items-center justify-center">
                      <Ionicons name="person" size={20} color="#9ca3af" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-gray-900" numberOfLines={1}>{selectedOffer.store}</Text>
                      <View className="flex-row items-center mt-0.5 mb-1">
                        {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={12} color="#EAB308" />)}
                      </View>
                      <Text className="text-gray-500 text-xs font-medium flex-row items-center" numberOfLines={1}>
                        <Ionicons name="location" size={10} color="#9CA3AF" /> {selectedOffer.branchType === 'Specific Location' && selectedOffer.specificBranchName ? selectedOffer.specificBranchName : '123 Main St, Damascus'}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity 
                    onPress={() => toggleFollow(selectedOffer.store)}
                    className={`px-4 py-2 rounded-full border ${followedStores[selectedOffer.store] ? 'bg-white border-gray-300' : 'bg-black border-black'}`}
                  >
                    <Text className={`font-bold ${followedStores[selectedOffer.store] ? 'text-gray-700' : 'text-white'}`}>
                      {followedStores[selectedOffer.store] ? 'Followed' : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Action Buttons */}
                <View className="flex-row space-x-4 mb-4">
                  <TouchableOpacity className="flex-1 bg-brand py-4 rounded-xl flex-row justify-center items-center mr-2">
                    <Text className="text-white font-bold text-lg mr-2">Get Location</Text>
                    <Ionicons name="megaphone" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-accent-blue py-4 rounded-xl flex-row justify-center items-center ml-2">
                    <Text className="text-white font-bold text-lg mr-2">Share</Text>
                    <Ionicons name="arrow-redo" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                {/* Report Seller Button */}
                <TouchableOpacity className="w-full bg-[#EF4444] py-4 rounded-xl items-center justify-center mb-8">
                  <Text className="text-white font-bold text-lg">Report the Seller</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}
