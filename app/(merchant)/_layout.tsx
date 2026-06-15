import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MerchantLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: true,
      tabBarActiveTintColor: '#dc2626', // Brand Red
      tabBarInactiveTintColor: '#6b7280',
      tabBarShowLabel: true,
      tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
      tabBarStyle: {
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        height: 65,
        paddingBottom: 10,
        paddingTop: 5,
        backgroundColor: '#f9fafb'
      }
    }}>
      <Tabs.Screen 
        name="offers" 
        options={{
          title: 'Offer',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "pricetag" : "pricetag-outline"} size={24} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="add" 
        options={{
          title: 'Add',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "add-square" : "add-square-outline"} size={24} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="search" 
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <View className="bg-red-600 w-14 h-14 rounded-full justify-center items-center shadow-md mb-6 border-4 border-white">
              <Ionicons name="search" size={24} color="white" />
            </View>
          ),
          tabBarLabel: 'Search',
        }} 
      />
      <Tabs.Screen 
        name="chat" 
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "chatbubble" : "chatbubble-outline"} size={24} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'My Store',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "storefront" : "storefront-outline"} size={24} color={color} />
          ),
        }} 
      />
      {/* Hide the old profile tab if it existed, or rename to index */}
      <Tabs.Screen 
        name="profile" 
        options={{ href: null }} 
      />
    </Tabs>
  );
}
