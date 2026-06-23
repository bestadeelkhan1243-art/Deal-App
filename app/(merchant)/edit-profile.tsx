import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMerchantStore } from '../../store/useMerchantStore';
import { useRouter } from 'expo-router';
import { usePopup } from '../../components/ui/PopupProvider';

export default function MerchantOnboarding() {
  const { profile, updateProfile } = useMerchantStore();
  const router = useRouter();
  const { showPopup } = usePopup();

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [birth, setBirth] = useState(profile.birth);
  const [privatePhone, setPrivatePhone] = useState(profile.privatePhone);

  const [businessName, setBusinessName] = useState(profile.businessName);
  const [businessType, setBusinessType] = useState(profile.businessType);
  const [country, setCountry] = useState(profile.country);
  const [businessPhone, setBusinessPhone] = useState(profile.businessPhone);
  const [businessAddress, setBusinessAddress] = useState(profile.businessAddress);
  const [businessEmail, setBusinessEmail] = useState(profile.businessEmail);

  // Sync state if profile loads from async storage slightly later
  useEffect(() => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setBirth(profile.birth);
    setPrivatePhone(profile.privatePhone);
    setBusinessName(profile.businessName);
    setBusinessType(profile.businessType);
    setCountry(profile.country);
    setBusinessPhone(profile.businessPhone);
    setBusinessAddress(profile.businessAddress);
    setBusinessEmail(profile.businessEmail);
  }, [profile]);

  const handleSaveProfile = () => {
    updateProfile({
      firstName,
      lastName,
      birth,
      privatePhone,
      businessName,
      businessType,
      country,
      businessPhone,
      businessAddress,
      businessEmail
    });
    showPopup('success', 'Profile Updated', 'Your merchant profile has been successfully saved.');
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100 justify-between bg-white mt-12">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-gray-900">Edit Profile</Text>
          </View>
        </View>
      </View>

      <View className="px-6">
        <Text className="text-lg font-bold text-gray-900 mb-6">We need more Information</Text>

        {/* Personal Information */}
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <Text className="text-xs font-bold text-gray-500 mb-4">Personal information</Text>
          
          <View className="flex-row space-x-4 mb-4">
            <View className="flex-1">
              <TextInput 
                value={firstName} onChangeText={setFirstName}
                placeholder="First name *" placeholderTextColor="#9ca3af"
                className="bg-gray-50 px-4 py-3 rounded-full text-[11px] font-medium"
              />
            </View>
            <View className="flex-1">
              <TextInput 
                value={lastName} onChangeText={setLastName}
                placeholder="Last name *" placeholderTextColor="#9ca3af"
                className="bg-gray-50 px-4 py-3 rounded-full text-[11px] font-medium"
              />
            </View>
          </View>

          <View className="flex-row space-x-4">
            <View className="flex-1">
              <TextInput 
                value={birth} onChangeText={setBirth}
                placeholder="Birth *" placeholderTextColor="#9ca3af"
                className="bg-gray-50 px-4 py-3 rounded-full text-[11px] font-medium"
              />
            </View>
            <View className="flex-1">
              <TextInput 
                value={privatePhone} onChangeText={setPrivatePhone}
                placeholder="Private Phone" placeholderTextColor="#9ca3af"
                className="bg-gray-50 px-4 py-3 rounded-full text-[11px] font-medium"
              />
            </View>
          </View>
        </View>

        {/* Business Information */}
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
          <Text className="text-xs font-bold text-gray-500 mb-4">Business information</Text>
          
          <View className="flex-row space-x-4 mb-4">
            <View className="flex-1">
              <TextInput 
                value={businessName} onChangeText={setBusinessName}
                placeholder="Business name *" placeholderTextColor="#9ca3af"
                className="bg-gray-50 px-4 py-3 rounded-full text-[11px] font-medium"
              />
            </View>
            <View className="flex-1 bg-gray-50 rounded-full flex-row justify-between items-center px-4 py-3">
              <TextInput 
                value={businessType} onChangeText={setBusinessType}
                placeholder="Type of business *" placeholderTextColor="#9ca3af"
                className="flex-1 text-[11px] font-medium"
              />
              <Ionicons name="caret-down" size={12} color="#000" />
            </View>
          </View>

          <View className="flex-row space-x-4 mb-4">
            <View className="flex-1 bg-gray-50 rounded-full flex-row justify-between items-center px-4 py-3">
              <TextInput 
                value={country} onChangeText={setCountry}
                placeholder="Country *" placeholderTextColor="#9ca3af"
                className="flex-1 text-[11px] font-medium"
              />
              <Ionicons name="caret-down" size={12} color="#000" />
            </View>
            <View className="flex-1">
              <TextInput 
                value={businessPhone} onChangeText={setBusinessPhone}
                placeholder="Business Phone *" placeholderTextColor="#9ca3af"
                className="bg-gray-50 px-4 py-3 rounded-full text-[11px] font-medium"
              />
            </View>
          </View>

          <View className="bg-gray-50 rounded-full flex-row items-center mb-4 pl-4 pr-1 py-1">
            <TextInput 
              value={businessAddress} onChangeText={setBusinessAddress}
              placeholder="Business Address *" placeholderTextColor="#9ca3af"
              className="flex-1 text-[11px] font-medium py-2"
            />
            <TouchableOpacity className="bg-[#e62020] px-4 py-2 rounded-full flex-row items-center shadow-sm">
              <Ionicons name="location-outline" size={12} color="white" className="mr-1" />
              <Text className="text-white text-[10px] font-bold ml-1">Select location</Text>
            </TouchableOpacity>
          </View>

          <TextInput 
            value={businessEmail} onChangeText={setBusinessEmail}
            placeholder="Business Email *" placeholderTextColor="#9ca3af"
            className="bg-gray-50 px-4 py-3 rounded-full text-[11px] font-medium"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          className="bg-red-600 py-4 rounded-2xl items-center shadow-md mb-12"
          onPress={handleSaveProfile}
        >
          <Text className="text-white font-bold text-sm tracking-wide">SAVE PROFILE</Text>
        </TouchableOpacity>

        {/* Footer Links */}
        <View className="flex-row justify-center space-x-8 mb-4">
          <TouchableOpacity>
            <Text className="text-gray-500 text-xs font-medium">About us</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-gray-500 text-xs font-medium">Pricing</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-gray-500 text-xs font-medium">Help and contact</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}
