import { View, Text, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SavedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Ionicons name="bookmark-outline" size={80} color="#D1D5DB" className="mb-6" />
        <Text className="text-2xl font-bold text-gray-900 mb-2">Saved - Empty</Text>
        <Text className="text-base text-gray-500 text-center max-w-[250px]">
          There is nothing here. Look for the next deal!
        </Text>
      </View>
    </SafeAreaView>
  );
}
