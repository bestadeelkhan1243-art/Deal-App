import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Switch, Image } from 'react-native';
import { Button } from '../../components/ui/Button';
import { useOfferStore } from '../../store/useOfferStore';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

export default function MerchantAddOffer() {
  const { addOffer } = useOfferStore();
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  
  // Advanced Fields
  const [discountType, setDiscountType] = useState<'Percentage' | 'Price'>('Percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [limitType, setLimitType] = useState<'Unlimited' | 'Limited'>('Unlimited');
  const [limitCount, setLimitCount] = useState('');
  
  // Branch Selection
  const [branchType, setBranchType] = useState<'All Branches' | 'Specific Location'>('All Branches');
  const [specificBranchName, setSpecificBranchName] = useState('');

  const [imageUrl, setImageUrl] = useState('');

  const [newExpiry, setNewExpiry] = useState('');
  const [requiresCoupon, setRequiresCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true, 
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageUrl(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleCreateOffer = () => {
    if (newTitle.trim() && discountValue.trim()) {
      const finalCouponCode = requiresCoupon 
        ? (couponCode.trim() || `DEAL-${Math.random().toString(36).substring(2, 6).toUpperCase()}`) 
        : '';

      const finalLimitCount = limitType === 'Limited' ? parseInt(limitCount, 10) || 0 : undefined;

      addOffer({
        title: newTitle,
        description: newDesc,
        originalPrice: '', 
        discountPrice: discountType === 'Percentage' ? `${discountValue}% OFF` : `$${discountValue} OFF`,
        discountType,
        discountValue,
        limitType,
        limitCount: finalLimitCount,
        branchType,
        specificBranchName: branchType === 'Specific Location' ? specificBranchName.trim() : undefined,
        imageUrl,
        status: 'Active',
        expiry: newExpiry.trim() || 'No Expiry Set',
        requiresCoupon,
        couponCode: finalCouponCode
      });
      
      // Reset
      setNewTitle(''); setNewDesc(''); setDiscountValue(''); setNewExpiry('');
      setLimitCount(''); setImageUrl(''); setBranchType('All Branches'); setSpecificBranchName('');
      setRequiresCoupon(false); setCouponCode('');
      setDiscountType('Percentage'); setLimitType('Unlimited');
      
      // Navigate back to offers list
      router.push('/(merchant)/offers');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white"
    >
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6 pt-6 mb-4" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="mb-6">
          <Text className="text-3xl font-extrabold text-gray-900">Create Deal</Text>
          <Text className="text-gray-500 font-medium">Add a new offer to your store.</Text>
        </View>

        <Text className="text-gray-700 font-bold mb-2 ml-1">Offer Title *</Text>
        <TextInput 
          value={newTitle} onChangeText={setNewTitle}
          placeholder="e.g. 20% Off All Desserts"
          className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-5 font-medium"
        />

        <Text className="text-gray-700 font-bold mb-2 ml-1">Description</Text>
        <TextInput 
          value={newDesc} onChangeText={setNewDesc}
          placeholder="Details about the offer..."
          multiline numberOfLines={3}
          className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-5 font-medium text-left"
          style={{ textAlignVertical: 'top' }}
        />

        <Text className="text-gray-700 font-bold mb-2 ml-1">Product Image (Optional)</Text>
        <TouchableOpacity 
          onPress={pickImage}
          className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 mb-6 items-center justify-center h-32"
        >
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} className="w-full h-full rounded-lg" resizeMode="cover" />
          ) : (
            <View className="items-center">
              <Ionicons name="camera-outline" size={28} color="#9ca3af" />
              <Text className="text-gray-500 font-medium mt-2">Tap to select photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text className="text-gray-700 font-bold mb-2 ml-1">Discount Details *</Text>
        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-5">
          <View className="flex-row bg-gray-200 p-1 rounded-lg mb-4">
            <TouchableOpacity 
              className={`flex-1 py-2 items-center rounded-md ${discountType === 'Percentage' ? 'bg-white shadow-sm' : ''}`}
              onPress={() => setDiscountType('Percentage')}
            >
              <Text className={`font-bold ${discountType === 'Percentage' ? 'text-gray-900' : 'text-gray-500'}`}>Percentage (%)</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 py-2 items-center rounded-md ${discountType === 'Price' ? 'bg-white shadow-sm' : ''}`}
              onPress={() => setDiscountType('Price')}
            >
              <Text className={`font-bold ${discountType === 'Price' ? 'text-gray-900' : 'text-gray-500'}`}>Fixed Price ($)</Text>
            </TouchableOpacity>
          </View>
          <TextInput 
            value={discountValue} onChangeText={setDiscountValue} keyboardType="numeric"
            placeholder={discountType === 'Percentage' ? "e.g. 50" : "e.g. 10"}
            className="bg-white p-4 rounded-xl border border-gray-200 font-medium"
          />
        </View>

        <Text className="text-gray-700 font-bold mb-2 ml-1">Customer Limits</Text>
        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-5">
          <View className="flex-row bg-gray-200 p-1 rounded-lg mb-3">
            <TouchableOpacity 
              className={`flex-1 py-2 items-center rounded-md ${limitType === 'Unlimited' ? 'bg-white shadow-sm' : ''}`}
              onPress={() => setLimitType('Unlimited')}
            >
              <Text className={`font-bold ${limitType === 'Unlimited' ? 'text-gray-900' : 'text-gray-500'}`}>Unlimited</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 py-2 items-center rounded-md ${limitType === 'Limited' ? 'bg-white shadow-sm' : ''}`}
              onPress={() => setLimitType('Limited')}
            >
              <Text className={`font-bold ${limitType === 'Limited' ? 'text-gray-900' : 'text-gray-500'}`}>Limited</Text>
            </TouchableOpacity>
          </View>
          {limitType === 'Limited' && (
            <TextInput 
              value={limitCount} onChangeText={setLimitCount} keyboardType="numeric"
              placeholder="Max total customers (e.g. 100)"
              className="bg-white p-4 rounded-xl border border-gray-200 font-medium"
            />
          )}
        </View>

        <Text className="text-gray-700 font-bold mb-2 ml-1">Valid At</Text>
        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-5">
          <View className="flex-row bg-gray-200 p-1 rounded-lg mb-3">
            <TouchableOpacity 
              className={`flex-1 py-2 items-center rounded-md ${branchType === 'All Branches' ? 'bg-white shadow-sm' : ''}`}
              onPress={() => setBranchType('All Branches')}
            >
              <Text className={`font-bold ${branchType === 'All Branches' ? 'text-gray-900' : 'text-gray-500'}`}>All Branches</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 py-2 items-center rounded-md ${branchType === 'Specific Location' ? 'bg-white shadow-sm' : ''}`}
              onPress={() => setBranchType('Specific Location')}
            >
              <Text className={`font-bold ${branchType === 'Specific Location' ? 'text-gray-900' : 'text-gray-500'}`}>Specific Location</Text>
            </TouchableOpacity>
          </View>
          {branchType === 'Specific Location' && (
            <TextInput 
              value={specificBranchName} onChangeText={setSpecificBranchName}
              placeholder="Enter branch name or address..."
              className="bg-white p-4 rounded-xl border border-gray-200 font-medium"
            />
          )}
        </View>

        <Text className="text-gray-700 font-bold mb-2 ml-1">Expiry (Optional)</Text>
        <TextInput 
          value={newExpiry} onChangeText={setNewExpiry}
          placeholder="e.g. End of day"
          className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 font-medium"
        />

        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8">
          <View className="flex-row justify-between items-center mb-2">
            <View>
              <Text className="text-gray-900 font-bold">Require Coupon</Text>
              <Text className="text-gray-500 text-xs">Shoppers must claim code</Text>
            </View>
            <Switch 
              value={requiresCoupon} 
              onValueChange={setRequiresCoupon} 
              trackColor={{ false: '#d1d5db', true: '#fca5a5' }}
              thumbColor={requiresCoupon ? '#dc2626' : '#f3f4f6'}
            />
          </View>
          {requiresCoupon && (
            <View className="mt-3 border-t border-gray-200 pt-3">
              <Text className="text-gray-700 font-bold mb-2 ml-1">Custom Code (Optional)</Text>
              <TextInput 
                value={couponCode} onChangeText={setCouponCode}
                placeholder="e.g. SUMMER50 (Auto-generates)"
                autoCapitalize="characters"
                className="bg-white p-3 rounded-xl border border-gray-200 font-bold"
              />
            </View>
          )}
        </View>

        <Button 
          title="Publish Offer" 
          className="bg-red-600 py-4 shadow-sm"
          onPress={handleCreateOffer}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
