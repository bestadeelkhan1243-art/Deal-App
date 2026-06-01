import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Switch, Image } from 'react-native';
import { Button } from '../../components/ui/Button';
import { useOfferStore } from '../../store/useOfferStore';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function MerchantOffers() {
  const { offers, addOffer, toggleOfferStatus, deleteOffer } = useOfferStore();
  const [modalVisible, setModalVisible] = useState(false);
  
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
      base64: true, // Required for persistent local storage
    });

    if (!result.canceled && result.assets[0].base64) {
      // Store as base64 string so it survives page reloads
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
        originalPrice: '', // Kept for legacy
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
      setModalVisible(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-8 mt-2">
          <Text className="text-3xl font-extrabold text-gray-900">My Offers</Text>
          <TouchableOpacity 
            className="bg-red-600 active:bg-red-700 px-4 py-2.5 rounded-full flex-row items-center shadow-sm"
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-bold ml-1">New</Text>
          </TouchableOpacity>
        </View>
        
        {offers.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="pricetag-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-400 mt-4 text-lg">No active offers</Text>
          </View>
        ) : (
          offers.map(offer => (
            <View key={offer.id} className={`bg-white p-5 rounded-3xl shadow-sm mb-4 border border-gray-100 ${offer.status === 'Paused' ? 'opacity-60' : ''}`}>
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold text-gray-900 flex-1 pr-4">{offer.title}</Text>
                <TouchableOpacity onPress={() => deleteOffer(offer.id)}>
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
              <Text className="text-gray-500 mb-2">{offer.description}</Text>
              
              <View className="flex-row items-center mb-2">
                <Text className="text-xl font-bold text-green-600 mr-2">{offer.discountPrice}</Text>
              </View>

              {offer.limitType === 'Limited' && (
                <View className="bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 mb-2 self-start flex-row items-center">
                  <Ionicons name="people" size={14} color="#ea580c" />
                  <Text className="text-orange-700 text-xs font-bold ml-1">Limited to {offer.limitCount} customers</Text>
                </View>
              )}

              <View className="flex-row items-center justify-between">
                <Text className={`${offer.status === 'Active' ? 'text-red-600' : 'text-gray-500'} font-medium`}>
                  {offer.status} • Exp. {offer.expiry}
                </Text>
                {offer.requiresCoupon && (
                  <View className="bg-gray-100 px-2 py-1 rounded border border-gray-200">
                    <Text className="text-xs font-bold text-gray-700">CODE: {offer.couponCode}</Text>
                  </View>
                )}
              </View>
              
              <View className="mt-5 flex-row space-x-3">
                <Button 
                  title={offer.status === 'Active' ? 'Pause Offer' : 'Resume Offer'} 
                  variant="outline" 
                  className="flex-1 py-2" 
                  onPress={() => toggleOfferStatus(offer.id)}
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Offer Modal (Using Absolute View to fix React Navigation Portal bug) */}
      {modalVisible && (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          className="absolute inset-0 justify-end bg-black/50 z-50"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
        >
          <View className="bg-white p-6 rounded-t-3xl shadow-lg max-h-[90%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-900">Create Offer</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-gray-700 font-medium mb-2 ml-1">Offer Title *</Text>
              <TextInput 
                value={newTitle} onChangeText={setNewTitle}
                placeholder="e.g. 20% Off All Desserts"
                className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4 font-medium"
              />

              <Text className="text-gray-700 font-medium mb-2 ml-1">Description</Text>
              <TextInput 
                value={newDesc} onChangeText={setNewDesc}
                placeholder="Details about the offer..."
                multiline numberOfLines={3}
                className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4 font-medium text-left"
                style={{ textAlignVertical: 'top' }}
              />

              {/* Advanced: Image Picker */}
              <Text className="text-gray-700 font-medium mb-2 ml-1">Product Image (Optional)</Text>
              <TouchableOpacity 
                onPress={pickImage}
                className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 mb-6 items-center justify-center h-24"
              >
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} className="w-full h-full rounded-lg" resizeMode="cover" />
                ) : (
                  <View className="items-center">
                    <Ionicons name="camera-outline" size={24} color="#9ca3af" />
                    <Text className="text-gray-500 font-medium mt-1">Tap to select photo</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Advanced: Discount Type & Value */}
              <Text className="text-gray-700 font-medium mb-2 ml-1">Discount Details *</Text>
              <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
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

              {/* Advanced: Customer Limits */}
              <Text className="text-gray-700 font-medium mb-2 ml-1">Customer Limits</Text>
              <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
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

              {/* Advanced: Branch / Location Support */}
              <Text className="text-gray-700 font-medium mb-2 ml-1">Valid At</Text>
              <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
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

              <Text className="text-gray-700 font-medium mb-2 ml-1">Expiry (Optional)</Text>
              <TextInput 
                value={newExpiry} onChangeText={setNewExpiry}
                placeholder="e.g. End of day"
                className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 font-medium"
              />

              <View className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
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
                    <Text className="text-gray-700 font-medium mb-2 ml-1">Custom Code (Optional)</Text>
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
                className="bg-red-600 py-4 shadow-sm mb-4"
                onPress={handleCreateOffer}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
