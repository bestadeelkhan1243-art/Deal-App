import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { useOfferStore, Offer } from '../../store/useOfferStore';
import { Ionicons } from '@expo/vector-icons';

export default function MerchantOffers() {
  const { offers, deleteOffer, updateOffer } = useOfferStore();
  
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  
  // Local state for edit modal
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const openEditModal = (offer: Offer) => {
    setEditingOffer(offer);
    setEditTitle(offer.title);
    setEditDescription(offer.description);
    setEditCode(offer.couponCode || '');
    setEditStartDate('17.06.2026'); // Mocking date split for UI
    setEditEndDate('27.06.2026');   // Mocking date split for UI
    setEditLocation(offer.branchType === 'Specific Location' ? (offer.specificBranchName || '') : 'all our Location');
  };

  const handleSaveEdit = () => {
    if (editingOffer) {
      updateOffer(editingOffer.id, {
        title: editTitle,
        description: editDescription,
        couponCode: editCode,
        requiresCoupon: editCode.length > 0,
        expiry: `From ${editStartDate} to ${editEndDate}`,
        branchType: editLocation.toLowerCase().includes('all') ? 'All Branches' : 'Specific Location',
        specificBranchName: editLocation
      });
      setEditingOffer(null);
    }
  };

  const handleDeleteEdit = () => {
    if (editingOffer) {
      deleteOffer(editingOffer.id);
      setEditingOffer(null);
    }
  };

  return (
    <View className="flex-1 bg-[#f4f4f4]">
      {/* Header */}
      <View className="bg-white px-6 pt-10 pb-4 shadow-sm z-10">
        <Text className="text-xl font-medium text-[#c02626]">My Offers</Text>
      </View>
      
      <ScrollView className="flex-1 mt-2" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {offers.length === 0 ? (
          <View className="items-center justify-center py-20 mt-10">
            <Ionicons name="pricetag-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-400 mt-4 text-lg">No active offers</Text>
          </View>
        ) : (
          offers.map((offer, i) => (
            <View key={offer.id} className="bg-white mb-3 shadow-sm">
              
              {/* Deal Image */}
              <View className="w-full h-44 bg-gray-200">
                <Image 
                  source={offer.imageUrl ? { uri: offer.imageUrl } : (i % 2 === 0 ? require('../../assets/images/pizza_deal.png') : require('../../assets/images/coffee_deal.png'))}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>

              {/* Deal Content */}
              <View className="p-4">
                {/* Title & Views */}
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1 pr-4">
                    <Text className="text-base font-bold text-gray-900 mb-0.5">{offer.title}</Text>
                    <Text className="text-[10px] text-gray-800">{offer.description || 'for each artikel'}</Text>
                  </View>
                  <View className="items-center justify-center pt-1">
                    <Ionicons name="eye" size={16} color="#e62020" />
                    <Text className="text-[7px] text-gray-800 mt-0.5 font-medium">{Math.floor(Math.random() * 500) + 50} views</Text>
                  </View>
                </View>

                {/* Details List & Right Column */}
                <View className="flex-row justify-between items-end">
                  
                  {/* Left Column: Icon Details */}
                  <View className="flex-1 pr-2">
                    <View className="flex-row items-center mb-1.5">
                      <Ionicons name="calendar-outline" size={12} color="#111827" />
                      <Text className="text-[10px] text-gray-700 ml-1.5">Today at 15:00 pm</Text>
                    </View>
                    <View className="flex-row items-center mb-1.5">
                      <Ionicons name="time-outline" size={12} color="#111827" />
                      <Text className="text-[10px] text-gray-700 ml-1.5">From 15.06 to 25.06.2026</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="storefront-outline" size={12} color="#111827" />
                      <Text className="text-[10px] text-gray-700 ml-1.5">
                        {offer.branchType === 'Specific Location' && offer.specificBranchName 
                          ? `only in the ${offer.specificBranchName} store` 
                          : 'In all our Location'}
                      </Text>
                    </View>
                  </View>

                  {/* Right Column: Code Button & Edit Icon */}
                  <View className="items-end justify-between h-full">
                    <View className="bg-[#e62020] px-3 py-1 mb-3">
                      <Text className="text-white text-[9px] font-medium tracking-wide">
                        {offer.requiresCoupon ? 'Code: Look Deal' : 'Code: No code'}
                      </Text>
                    </View>
                    
                    <TouchableOpacity onPress={() => openEditModal(offer)}>
                      <Ionicons name="create-outline" size={18} color="#e62020" style={{ opacity: 0.6 }} />
                    </TouchableOpacity>
                  </View>

                </View>

              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={!!editingOffer} animationType="slide" transparent={true}>
        <View className="flex-1 bg-[#f4f4f4] mt-12 rounded-t-3xl overflow-hidden shadow-2xl border border-gray-200">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Hero Image */}
            <View className="w-full h-56 relative bg-black">
              <Image 
                source={editingOffer?.imageUrl ? { uri: editingOffer.imageUrl } : require('../../assets/images/pizza_deal.png')}
                style={{ width: '100%', height: '100%', opacity: 0.9 }}
                resizeMode="cover"
              />
              <TouchableOpacity 
                className="absolute top-4 right-4 z-10 p-2"
                onPress={() => setEditingOffer(null)}
              >
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
            </View>

            {/* Dots Mock */}
            <View className="flex-row justify-center mt-3 mb-4 space-x-1.5">
              <View className="w-2 h-2 rounded-full bg-gray-400" />
              <View className="w-2 h-2 rounded-full bg-gray-300" />
              <View className="w-2 h-2 rounded-full bg-gray-300" />
              <View className="w-2 h-2 rounded-full bg-gray-300" />
              <View className="w-2 h-2 rounded-full bg-gray-300" />
            </View>

            <View className="px-6">
              {/* Change photo */}
              <Text className="text-[12px] text-gray-700 mb-2">Change photo</Text>
              <View className="bg-white p-3 rounded-2xl flex-row space-x-3 mb-5">
                {[1, 2, 3].map((item) => (
                  <View key={item} className="relative w-20 h-14 bg-black rounded-sm overflow-hidden">
                    <Image source={require('../../assets/images/pizza_deal.png')} className="w-full h-full opacity-80" resizeMode="cover" />
                    <View className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5">
                      <Ionicons name="close" size={10} color="white" />
                    </View>
                  </View>
                ))}
              </View>

              {/* Change title */}
              <Text className="text-[12px] text-gray-700 mb-1.5">Change title</Text>
              <TextInput 
                value={editTitle} onChangeText={setEditTitle}
                className="bg-white px-4 py-3 rounded-full mb-4 text-[13px] font-medium text-gray-800 border border-gray-100"
              />

              {/* Change description */}
              <Text className="text-[12px] text-gray-700 mb-1.5">Change description</Text>
              <TextInput 
                value={editDescription} onChangeText={setEditDescription}
                multiline numberOfLines={4}
                className="bg-white p-4 rounded-2xl mb-4 text-[13px] font-medium text-gray-800 h-28 border border-gray-100"
                style={{ textAlignVertical: 'top' }}
              />

              {/* Add Code */}
              <Text className="text-[12px] text-gray-700 mb-1.5">Add Code</Text>
              <TextInput 
                value={editCode} onChangeText={setEditCode}
                placeholder="e.g. sale 10"
                placeholderTextColor="#9ca3af"
                className="bg-white px-4 py-3 rounded-full mb-4 text-[13px] font-medium text-gray-800 border border-gray-100"
              />

              {/* Change Date */}
              <Text className="text-[12px] text-gray-700 mb-1.5">Change Date</Text>
              <View className="flex-row justify-between mb-4 space-x-3">
                <TextInput 
                  value={editStartDate} onChangeText={setEditStartDate}
                  className="flex-1 bg-white px-4 py-3 rounded-full text-[13px] text-center text-gray-500 font-medium border border-gray-100"
                />
                <TextInput 
                  value={editEndDate} onChangeText={setEditEndDate}
                  className="flex-1 bg-white px-4 py-3 rounded-full text-[13px] text-center text-gray-500 font-medium border border-gray-100"
                />
              </View>

              {/* Select Location */}
              <Text className="text-[12px] text-gray-700 mb-1.5">Select Location</Text>
              <View className="bg-white px-4 py-3 rounded-full mb-8 flex-row justify-between items-center border border-gray-100">
                <TextInput 
                  value={editLocation} onChangeText={setEditLocation}
                  className="flex-1 text-[13px] text-gray-500 font-medium"
                />
                <Ionicons name="chevron-down" size={16} color="#ef4444" />
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-between space-x-4 mb-10">
                <TouchableOpacity 
                  className="flex-1 bg-white border border-[#e62020] py-3 rounded-full items-center"
                  onPress={handleSaveEdit}
                >
                  <Text className="text-[#e62020] text-lg font-medium">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-1 bg-[#e62020] py-3 rounded-full items-center"
                  onPress={handleDeleteEdit}
                >
                  <Text className="text-white text-lg font-medium">Ad Delete</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </View>
      </Modal>

    </View>
  );
}
