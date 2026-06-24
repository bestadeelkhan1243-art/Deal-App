import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useOfferStore, Offer } from '../../store/useOfferStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function CustomerProfile() {
  const { user, logout } = useAuthStore();
  const { offers } = useOfferStore();
  const router = useRouter();

  const [claimedOffers, setClaimedOffers] = useState<{ claimId: string, offer: Offer, claimedAt: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      if (!user || !db) return;
      
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
        setLoading(false);
      }
    };

    fetchClaims();
  }, [user, offers]);

  const handleLogout = () => {
    logout();
    if (Platform.OS === 'web') {
      window.location.href = '/';
    } else {
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace('/');
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
        <View className="bg-white pt-16 pb-8 px-6 rounded-b-[40px] shadow-sm mb-6 items-center border-b border-gray-100">
          <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm">
            <Ionicons name="person" size={40} color="#9ca3af" />
          </View>
          <Text className="text-2xl font-extrabold text-gray-900 tracking-tight">{user?.email?.split('@')[0] || 'Customer'}</Text>
          <Text className="text-gray-500 font-medium mt-1">{user?.email}</Text>
        </View>

        {/* Claimed Offers Section */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">My Claimed Deals</Text>
          
          {loading ? (
            <Text className="text-gray-500 font-medium text-center py-8">Loading your claims...</Text>
          ) : claimedOffers.length === 0 ? (
            <View className="bg-white p-8 rounded-3xl border border-gray-100 items-center justify-center">
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

        {/* Account Settings */}
        <View className="px-6 pb-12">
          <Text className="text-xl font-bold text-gray-900 mb-4">Settings</Text>
          
          <View className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 mb-6">
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-50">
              <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-4">
                <Ionicons name="notifications" size={20} color="#4b5563" />
              </View>
              <Text className="flex-1 text-base font-bold text-gray-900">Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleLogout} 
              className="flex-row items-center p-4"
            >
              <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center mr-4">
                <Ionicons name="log-out" size={20} color="#ED1C24" />
              </View>
              <Text className="flex-1 text-base font-bold text-brand">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
