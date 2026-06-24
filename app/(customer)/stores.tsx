import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StoresScreen() {
  const stores = [
    { id: 1, name: "Luigi's Pizzeria", category: "Restaurant", rating: 4.8, distance: "1.2 km" },
    { id: 2, name: "Brew & Co. Coffee", category: "Cafe", rating: 4.5, distance: "2.5 km" },
    { id: 3, name: "Fresh Supermarket", category: "Grocery", rating: 4.2, distance: "3.1 km" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 py-4 bg-white border-b border-gray-100 flex-row items-center z-10 shadow-sm">
        <View className="flex-1 bg-gray-50 flex-row items-center px-4 py-3 rounded-2xl border border-gray-200">
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput 
            placeholder="Search stores..." 
            className="flex-1 ml-3 text-base font-medium text-gray-900"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity className="ml-4 bg-red-50 p-3.5 rounded-2xl border border-red-100 shadow-sm">
          <Ionicons name="options" size={20} color="#ED1C24" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">Popular Stores</Text>
        
        {stores.map((store) => (
          <TouchableOpacity key={store.id} activeOpacity={0.9} className="bg-white rounded-3xl mb-5 shadow-sm border border-gray-100 overflow-hidden flex-row">
            <View className="w-1/3 h-36 bg-gray-200 items-center justify-center">
              <Ionicons name="storefront-outline" size={32} color="#9ca3af" />
            </View>
            <View className="flex-1 p-4 justify-between">
              <View>
                <View className="flex-row justify-between items-start mb-1">
                  <Text className="font-extrabold text-lg text-gray-900 flex-1 mr-2 leading-tight" numberOfLines={2}>{store.name}</Text>
                  <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                    <Ionicons name="star" size={12} color="#eab308" />
                    <Text className="text-xs font-bold text-yellow-700 ml-1">{store.rating}</Text>
                  </View>
                </View>
                <Text className="text-sm text-gray-500 font-medium mt-1">{store.category}</Text>
              </View>

              <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <View className="flex-row items-center">
                  <Ionicons name="location" size={16} color="#ED1C24" />
                  <Text className="text-sm font-bold text-gray-700 ml-1">{store.distance}</Text>
                </View>
                <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center border border-gray-100">
                  <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
