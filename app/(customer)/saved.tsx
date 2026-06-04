import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
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

      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 100 }}>
        {savedOffers.length > 0 ? (
          <View className="p-6">
            <Text className="text-2xl font-extrabold text-gray-900 mb-6">Saved Deals</Text>
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
                badge={offer.discountPrice ? `${offer.discountPrice}` : "🔥 Deal"}
                isSaved={isSaved(offer.id)}
                onToggleSave={() => toggleSave(offer.id)}
                onPress={() => router.push('/(customer)')} // Simplified nav for preview
              />
            ))}
          </View>
        ) : (
          <View className="flex-1 mt-32">
            <Text className="text-gray-900 font-bold text-center mb-16 text-base">
              Is nothing here look the next Deal
            </Text>

            <View className="mt-8">
              <Text className="px-6 text-gray-900 font-extrabold mb-4">Another Deals</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6 pr-6">
                {[1, 2, 3, 4].map((item) => (
                  <View key={`another-${item}`} className="w-36 mr-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <View className="flex-row justify-between items-center p-2 border-b border-gray-100">
                      <View className="flex-row items-center">
                        <Ionicons name="person-circle-outline" size={20} color="#9ca3af" />
                        <Text className="text-[10px] text-gray-500 font-medium ml-1">Restaurant Homs</Text>
                      </View>
                      <Ionicons name="person-outline" size={14} color="#ED1C24" />
                    </View>
                    <View className="h-24 bg-white justify-center px-3 pb-2 pt-16">
                      <Text className="text-gray-900 font-bold text-xs leading-tight">
                        $20 valid for the{'\n'}first 10 customers
                      </Text>
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
