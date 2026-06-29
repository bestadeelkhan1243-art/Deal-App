import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSavedStore } from '../../store/useSavedStore';
import { useOfferStore, Offer } from '../../store/useOfferStore';
import { DealCard } from '../../components/ui/DealCard';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

export default function SavedScreen() {
  const { savedOfferIds, toggleSave, isSaved } = useSavedStore();
  const { offers } = useOfferStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'saved' | 'claimed'>('saved');
  const [claimedOffers, setClaimedOffers] = useState<{ claimId: string, offer: Offer, claimedAt: string }[]>([]);
  const [loadingClaims, setLoadingClaims] = useState(false);

  useEffect(() => {
    const fetchClaims = async () => {
      const user = auth.currentUser;
      if (!user || !db) return;
      
      setLoadingClaims(true);
      try {
        const claimsRef = collection(db, 'claims');
        const q = query(claimsRef, where('customerId', '==', user.uid));
        const snapshot = await getDocs(q);
        
        const claims: any[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          const offerDetail = offers.find(o => o.id === data.offerId);
          if (offerDetail) {
            claims.push({
              claimId: doc.id,
              offer: offerDetail,
              claimedAt: data.claimedAt
            });
          }
        });
        
        setClaimedOffers(claims.sort((a, b) => new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime()));
      } catch (error) {
        console.error("Error fetching claims:", error);
      } finally {
        setLoadingClaims(false);
      }
    };

    if (activeTab === 'claimed') {
      fetchClaims();
    }
  }, [activeTab, offers]);

  const savedOffers = offers.filter(offer => savedOfferIds.includes(offer.id));
  const activeOffers = offers.filter(o => o.status === 'Active');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <Text className="text-gray-900 font-bold mr-1">Damaskus</Text>
          <Ionicons name="chevron-forward" size={16} color="#ED1C24" />
        </View>
        <View className="relative">
          <Ionicons name="notifications-outline" size={24} color="#111827" />
          <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand rounded-full border border-white" />
        </View>
      </View>

      <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Top Tabs */}
        <View className="px-6 mt-4 mb-2 flex-row justify-between space-x-4">
          <TouchableOpacity 
            onPress={() => setActiveTab('saved')}
            className={`flex-1 py-3 rounded-2xl items-center border ${activeTab === 'saved' ? 'bg-[#ED1C24] border-[#ED1C24]' : 'bg-white border-gray-200'}`}
          >
            <Text className={`font-bold ${activeTab === 'saved' ? 'text-white' : 'text-gray-600'}`}>Saved Deals</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('claimed')}
            className={`flex-1 py-3 rounded-2xl items-center border ${activeTab === 'claimed' ? 'bg-[#ED1C24] border-[#ED1C24]' : 'bg-white border-gray-200'}`}
          >
            <Text className={`font-bold ${activeTab === 'claimed' ? 'text-white' : 'text-gray-600'}`}>My Claims</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'saved' ? (
          savedOffers.length > 0 ? (
            <View className="p-5">
              {savedOffers.map((offer, i) => (
                <DealCard 
                  key={offer.id}
                  title={offer.title} 
                  store={offer.store} 
                  distance={offer.distance} 
                  branchType={offer.branchType}
                  specificBranchName={offer.specificBranchName}
                  imageUrl={offer.imageUrl}
                  badge={offer.discountPrice ? `${offer.discountPrice}` : "Top Deal"}
                  isSaved={isSaved(offer.id)}
                  onToggleSave={() => toggleSave(offer.id)}
                  onPress={() => router.push(`/offer/${offer.id}` as any)} 
                />
              ))}
            </View>
          ) : (
            <View className="flex-1">
              <View className="items-center justify-center mt-20 mb-10 px-8">
                <View className="w-24 h-24 bg-red-50 rounded-full items-center justify-center mb-6 border border-red-100">
                  <Ionicons name="bookmark-outline" size={48} color="#ED1C24" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 text-center mb-3 tracking-tight">
                  No Saved Deals Yet
                </Text>
                <Text className="text-gray-500 text-center text-base leading-relaxed">
                  When you find a deal you love, save it here to access it quickly later.
                </Text>
              </View>

              <View className="mt-8 bg-white py-8 border-t border-gray-100">
                <Text className="px-6 text-xl font-extrabold text-gray-900 mb-6 tracking-tight">Recommended For You</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6" contentContainerStyle={{ paddingRight: 24 }}>
                  {[1, 2, 3, 4].map((item) => (
                    <View key={`another-${item}`} className="w-48 mr-5 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                      <View className="h-32 bg-gray-200">
                        <View className="w-full h-full items-center justify-center">
                          <Ionicons name="image-outline" size={32} color="#9ca3af" />
                        </View>
                      </View>
                      <View className="p-4">
                        <View className="flex-row items-center mb-2">
                          <View className="w-6 h-6 bg-gray-100 rounded-full items-center justify-center mr-2">
                            <Ionicons name="storefront" size={12} color="#9ca3af" />
                          </View>
                          <Text className="text-xs text-gray-500 font-semibold" numberOfLines={1}>Restaurant Homs</Text>
                        </View>
                        <Text className="text-gray-900 font-bold text-sm leading-tight mb-3">
                          $20 valid for the first 10 customers
                        </Text>
                        <TouchableOpacity className="bg-red-50 py-2 rounded-xl items-center border border-red-100">
                          <Text className="text-brand font-bold text-xs">View Deal</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          )
        ) : (
          <View className="px-5 mt-4">
            {loadingClaims ? (
              <View className="py-20 items-center justify-center">
                <ActivityIndicator size="large" color="#ED1C24" />
                <Text className="text-gray-500 font-medium mt-4">Loading your claims...</Text>
              </View>
            ) : claimedOffers.length === 0 ? (
              <View className="bg-white p-8 rounded-3xl border border-gray-100 items-center justify-center mt-10">
                <Ionicons name="ticket-outline" size={48} color="#e5e7eb" className="mb-3" />
                <Text className="text-gray-500 font-medium text-center">You haven't claimed any deals yet.</Text>
                <TouchableOpacity onPress={() => router.push('/(customer)')} className="mt-4">
                  <Text className="text-brand font-bold">Browse Deals</Text>
                </TouchableOpacity>
              </View>
            ) : (
              claimedOffers.map((claim) => (
                <TouchableOpacity 
                  key={claim.claimId}
                  onPress={() => router.push(`/(customer)/offer/${claim.offer.id}`)}
                  className="bg-white rounded-2xl p-4 mb-4 flex-row items-center border border-gray-100 shadow-sm"
                >
                  <View className="w-20 h-20 bg-gray-100 rounded-2xl mr-4 overflow-hidden border border-gray-100 items-center justify-center">
                    {claim.offer.imageUrl ? (
                      <Image 
                        source={{ uri: claim.offer.imageUrl }} 
                        style={{width: '100%', height: '100%'}} 
                        resizeMode="cover" 
                      />
                    ) : (
                      <Ionicons name="image-outline" size={24} color="#9ca3af" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base" numberOfLines={1}>{claim.offer.title}</Text>
                    <Text className="text-gray-500 font-medium text-xs mt-1">{claim.offer.store}</Text>
                    
                    {claim.offer.requiresCoupon && claim.offer.couponCode && (
                      <View className="mt-2 bg-gray-50 self-start px-2 py-1 rounded-md border border-gray-200">
                        <Text className="text-brand font-bold text-xs">Code: {claim.offer.couponCode}</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
