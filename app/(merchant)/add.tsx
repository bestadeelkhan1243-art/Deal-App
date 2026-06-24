import React, { useState, createElement } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Switch, Image } from 'react-native';
import { Button } from '../../components/ui/Button';
import { useOfferStore } from '../../store/useOfferStore';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { usePopup } from '../../components/ui/PopupProvider';

export default function MerchantAddOffer() {
  const { addOffer } = useOfferStore();
  const { showPopup } = usePopup();
  
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

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [requiresCoupon, setRequiresCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.5,
      base64: true, 
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets
        .filter(asset => asset.base64)
        .map(asset => `data:image/jpeg;base64,${asset.base64}`);
      setImageUrls(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
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
        imageUrl: imageUrls.length > 0 ? imageUrls[0] : '',
        imageUrls,
        status: 'Active',
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        requiresCoupon,
        couponCode: finalCouponCode
      });
      
      // Reset
      setNewTitle(''); setNewDesc(''); setDiscountValue(''); setStartDate(today); setEndDate(today);
      setLimitCount(''); setImageUrls([]); setBranchType('All Branches'); setSpecificBranchName('');
      setRequiresCoupon(false); setCouponCode('');
      setDiscountType('Percentage'); setLimitType('Unlimited');
      
      // Show success popup
      showPopup('success', 'Offer Published!', 'Your deal is now live for all shoppers to see.');
      
      // Navigate back to offers list after delay
      setTimeout(() => {
        router.push('/(merchant)/offers');
      }, 1000);
    } else {
      showPopup('error', 'Missing Fields', 'Please provide a title and a discount value.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-gray-50"
    >
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6 pt-6 mb-4" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="mb-8 mt-2">
          <Text className="text-4xl font-extrabold text-gray-900 tracking-tight">Create Deal</Text>
          <Text className="text-gray-500 font-medium text-base mt-1">Publish a new offer to your store.</Text>
        </View>

        <View className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 mb-6">
          <Text className="text-gray-900 font-bold mb-2 ml-1 text-base">Offer Title <Text className="text-brand">*</Text></Text>
          <TextInput 
            value={newTitle} onChangeText={setNewTitle}
            placeholder="e.g. 20% Off All Desserts"
            placeholderTextColor="#9ca3af"
            className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-5 font-medium text-gray-900 text-base"
          />

          <Text className="text-gray-900 font-bold mb-2 ml-1 text-base">Description</Text>
          <TextInput 
            value={newDesc} onChangeText={setNewDesc}
            placeholder="Details about the offer..."
            placeholderTextColor="#9ca3af"
            multiline numberOfLines={3}
            className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-2 font-medium text-left text-gray-900 text-base min-h-[100px]"
            style={{ textAlignVertical: 'top' }}
          />
        </View>

        <View className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 mb-6">
          <Text className="text-gray-900 font-bold mb-2 ml-1 text-base">Product Image</Text>
          <Text className="text-gray-500 font-medium mb-3 ml-1 text-xs">Add an image to make your deal stand out</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            <View className="flex-row items-center space-x-3">
              {imageUrls.map((url, index) => (
                <View key={index} className="relative w-32 h-32 bg-black rounded-2xl overflow-hidden mr-3">
                  <Image source={{ uri: url }} className="w-full h-full opacity-90" resizeMode="cover" />
                  <TouchableOpacity 
                    onPress={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5"
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity 
                onPress={pickImages}
                className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl items-center justify-center"
              >
                <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mb-2">
                  <Ionicons name="camera" size={20} color="#ED1C24" />
                </View>
                <Text className="text-gray-500 font-bold text-xs">Add Photo</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <View className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 mb-6">
          <Text className="text-gray-900 font-bold mb-4 ml-1 text-base">Discount Details <Text className="text-brand">*</Text></Text>
          <View className="flex-row bg-gray-50 p-1.5 rounded-2xl mb-4 border border-gray-100">
            <TouchableOpacity 
              className={`flex-1 py-3 items-center rounded-xl ${discountType === 'Percentage' ? 'bg-white shadow-sm border border-gray-100' : ''}`}
              onPress={() => setDiscountType('Percentage')}
            >
              <Text className={`font-bold ${discountType === 'Percentage' ? 'text-brand' : 'text-gray-500'}`}>Percentage (%)</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 py-3 items-center rounded-xl ${discountType === 'Price' ? 'bg-white shadow-sm border border-gray-100' : ''}`}
              onPress={() => setDiscountType('Price')}
            >
              <Text className={`font-bold ${discountType === 'Price' ? 'text-brand' : 'text-gray-500'}`}>Fixed Price ($)</Text>
            </TouchableOpacity>
          </View>
          <TextInput 
            value={discountValue} onChangeText={setDiscountValue} keyboardType="numeric"
            placeholder={discountType === 'Percentage' ? "e.g. 50" : "e.g. 10"}
            placeholderTextColor="#9ca3af"
            className="bg-gray-50 p-4 rounded-2xl border border-gray-100 font-medium text-gray-900 text-base"
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

        <Text className="text-gray-700 font-bold mb-2 ml-1">Duration</Text>
        <View className="flex-row justify-between mb-6">
          <View className="flex-1 mr-2">
            <Text className="text-gray-500 text-xs font-bold mb-1 ml-1 uppercase tracking-wider">Start Date</Text>
            {Platform.OS === 'web' ? createElement('input', {
              type: 'date',
              value: startDate,
              onChange: (e: any) => setStartDate(e.target.value),
              style: { width: '100%', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none', fontFamily: 'inherit', fontSize: '16px', color: '#111827' }
            }) : (
              <TextInput 
                value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD"
                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 font-medium"
              />
            )}
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-gray-500 text-xs font-bold mb-1 ml-1 uppercase tracking-wider">End Date</Text>
            {Platform.OS === 'web' ? createElement('input', {
              type: 'date',
              value: endDate,
              onChange: (e: any) => setEndDate(e.target.value),
              style: { width: '100%', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none', fontFamily: 'inherit', fontSize: '16px', color: '#111827' }
            }) : (
              <TextInput 
                value={endDate} onChangeText={setEndDate} placeholder="YYYY-MM-DD"
                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 font-medium"
              />
            )}
          </View>
        </View>

        <View className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 mb-8">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-900 font-bold text-base">Require Coupon</Text>
              <Text className="text-gray-500 text-xs mt-1">Shoppers must claim code</Text>
            </View>
            <Switch 
              value={requiresCoupon} 
              onValueChange={setRequiresCoupon} 
              trackColor={{ false: '#e5e7eb', true: '#fca5a5' }}
              thumbColor={requiresCoupon ? '#ED1C24' : '#ffffff'}
              ios_backgroundColor="#e5e7eb"
            />
          </View>
          {requiresCoupon && (
            <View className="mt-4 border-t border-gray-100 pt-4">
              <Text className="text-gray-900 font-bold mb-2 ml-1 text-sm">Custom Code (Optional)</Text>
              <TextInput 
                value={couponCode} onChangeText={setCouponCode}
                placeholder="e.g. SUMMER50"
                placeholderTextColor="#9ca3af"
                autoCapitalize="characters"
                className="bg-gray-50 p-4 rounded-2xl border border-gray-100 font-bold text-brand tracking-widest text-base"
              />
            </View>
          )}
        </View>

        <Button 
          title="Publish Offer" 
          className="bg-brand py-4 shadow-lg shadow-brand/40 rounded-2xl"
          onPress={handleCreateOffer}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
