import { View, Text, SafeAreaView } from 'react-native';

export default function StoresScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-xl font-bold text-gray-900 mb-2">Stores</Text>
        <Text className="text-gray-500 text-center">
          Find merchant stores near you.
        </Text>
      </View>
    </SafeAreaView>
  );
}
