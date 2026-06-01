import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomerLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: true,
      tabBarActiveTintColor: '#dc2626',
      tabBarStyle: {
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        height: 60,
        paddingBottom: 10,
        paddingTop: 5,
      }
    }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Deals',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "pricetags" : "pricetags-outline"} size={24} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="map" 
        options={{
          title: 'Nearby',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "map" : "map-outline"} size={24} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}
