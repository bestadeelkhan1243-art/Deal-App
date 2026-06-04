import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DealCardProps {
  title: string;
  store: string;
  distance: string;
  branchType?: 'All Branches' | 'Specific Location';
  specificBranchName?: string;
  imageSource?: ImageSourcePropType;
  imageUrl?: string;
  badge?: string;
  onPress?: () => void;
}

export const DealCard: React.FC<DealCardProps> = ({ 
  title, store, distance, branchType, specificBranchName, imageSource, imageUrl, badge, onPress 
}) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-5">
      <View className="relative w-full h-48">
        <Image 
          source={imageUrl ? { uri: imageUrl } : (imageSource || require('../../assets/images/pizza_deal.png'))} 
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {badge && (
          <View className="absolute top-4 left-4 bg-brand px-3 py-1.5 rounded-full shadow-sm">
            <Text className="text-white font-bold text-xs">{badge}</Text>
          </View>
        )}
        <TouchableOpacity 
          className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm"
          onPress={(e) => {
             e.stopPropagation();
             if (onPress) onPress();
          }}
        >
          <Ionicons name="bookmark" size={20} color="#ED1C24" />
        </TouchableOpacity>
      </View>
      
      <View className="p-5">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-xl font-bold text-gray-900 flex-1 pr-2">{title}</Text>
          <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-lg">
            <Ionicons name="location" size={14} color="#6b7280" />
            <Text className="text-gray-500 font-medium text-sm ml-1">{distance}</Text>
          </View>
        </View>
        
        <Text className="text-gray-500 font-medium mb-3">{store}</Text>

        <View className="bg-gray-50 rounded-xl p-3 mb-4 flex-row items-center">
          <Ionicons name="business" size={16} color="#4b5563" />
          <Text className="text-gray-700 font-medium ml-2 text-sm flex-1">
            {branchType === 'Specific Location' && specificBranchName
              ? specificBranchName
              : "Valid at all locations"}
          </Text>
        </View>
        
        <View className="flex-row justify-between items-center pt-4 border-t border-gray-100">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#ef4444" />
            <Text className="text-red-500 font-medium text-sm ml-1">Ends today</Text>
          </View>
          <View className="bg-red-600 active:bg-red-700 px-5 py-2 rounded-xl">
            <Text className="text-white font-bold">Claim Deal</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
