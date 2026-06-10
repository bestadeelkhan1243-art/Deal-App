import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomerLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: true,
      tabBarActiveTintColor: '#ED1C24', // Brand Red
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarShowLabel: true,
      tabBarStyle: {
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        height: 65,
        paddingBottom: 10,
        paddingTop: 5,
        backgroundColor: '#FFFFFF',
      }
    }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Deals',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "pricetag" : "pricetag-outline"} size={24} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="saved" 
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "bookmark" : "bookmark-outline"} size={24} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="map" 
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#ED1C24',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -20,
              shadowColor: '#ED1C24',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 5,
            }}>
              <Ionicons name="location" size={24} color="white" />
            </View>
          ),
        }} 
      />
      <Tabs.Screen 
        name="stores" 
        options={{
          title: 'Stores',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "storefront" : "storefront-outline"} size={24} color={color} />
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
      <Tabs.Screen 
        name="personal" 
        options={{
          href: null,
        }} 
      />
    </Tabs>
  );
}
