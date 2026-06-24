import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSavedStore } from '../../store/useSavedStore';
import { useOfferStore } from '../../store/useOfferStore';
import { DealCard } from '../../components/ui/DealCard';
import { useRouter } from 'expo-router';

export default function SavedScreen() {
  const { savedOfferIds, toggleSave, isSaved } = useSavedStore();
  const { offers } = useOfferStore();
  const router = useRouter();

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
        {savedOffers.length > 0 ? (
          <View className="p-5">
            <Text className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">Saved Deals</Text>
            {savedOffers.map((offer, i) => (
              <DealCard 
                key={offer.id}
                title={offer.title} 
                store={offer.store} 
                distance={offer.distance} 
                branchType={offer.branchType}
                specificBranchName={offer.specificBranchName}
                imageUrl={offer.imageUrl}
                imageSource={i % 2 === 0 ? require('../../assets/images/pizza_deal.png') : require('../../assets/images/coffee_deal.png')}
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
                    {offer.imageUrl ? (
                      <Image source={{ uri: offer.imageUrl }} style={{width: '100%', height: '100%'}} resizeMode="cover" />
                    ) : (
                      <View className="w-full h-full items-center justify-center bg-gray-200">
                        <Ionicons name="image-outline" size={32} color="#9ca3af" />
                      </View>
                    )}
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
