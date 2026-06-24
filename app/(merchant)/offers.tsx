import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { useOfferStore, Offer } from '../../store/useOfferStore';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';

export default function MerchantOffers() {
  const { offers, deleteOffer, updateOffer } = useOfferStore();
  const { user } = useAuthStore();
  const myOffers = offers.filter(o => o.merchantId === user?.uid);
  
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
        {myOffers.length === 0 ? (
          <View className="items-center justify-center py-20 mt-10">
            <Ionicons name="pricetag-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-400 mt-4 text-lg">No active offers</Text>
          </View>
        ) : (
          myOffers.map((offer, i) => (
            <View key={offer.id} className="bg-white mx-4 mb-6 rounded-3xl shadow-md border border-gray-100 overflow-hidden">
              
              {/* Deal Image with Overlay View Count */}
              <View className="w-full h-48 bg-gray-200 relative">
                <Image 
                  source={offer.imageUrl ? { uri: offer.imageUrl } : (i % 2 === 0 ? require('../../assets/images/pizza_deal.png') : require('../../assets/images/coffee_deal.png'))}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <View className="absolute top-4 right-4 bg-black/60 rounded-full px-3 py-1.5 flex-row items-center backdrop-blur-sm">
                  <Ionicons name="eye" size={14} color="white" />
                  <Text className="text-white text-xs font-bold ml-1.5">{Math.floor(Math.random() * 500) + 50}</Text>
                </View>
              </View>

              {/* Deal Content */}
              <View className="p-5">
                {/* Title & Edit Button */}
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 pr-4">
                    <Text className="text-xl font-bold text-gray-900 leading-tight mb-1">{offer.title}</Text>
                    <Text className="text-sm text-gray-500">{offer.description || 'Valid for all items in store'}</Text>
                  </View>
                  <TouchableOpacity onPress={() => openEditModal(offer)} className="bg-gray-50 border border-gray-200 p-2.5 rounded-full shadow-sm">
                    <Ionicons name="pencil" size={18} color="#e62020" />
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View className="h-px bg-gray-100 my-4" />

                {/* Details List */}
                <View className="flex-row items-center mb-3">
                  <View className="w-9 h-9 rounded-full bg-red-50 items-center justify-center mr-3">
                    <Ionicons name="calendar" size={16} color="#e62020" />
                  </View>
                  <View>
                    <Text className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Valid Dates</Text>
                    <Text className="text-sm text-gray-800 font-semibold mt-0.5">15.06 to 25.06.2026</Text>
                  </View>
                </View>

                <View className="flex-row items-center mb-5">
                  <View className="w-9 h-9 rounded-full bg-red-50 items-center justify-center mr-3">
                    <Ionicons name="location" size={16} color="#e62020" />
                  </View>
                  <View>
                    <Text className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Location</Text>
                    <Text className="text-sm text-gray-800 font-semibold mt-0.5">
                      {offer.branchType === 'Specific Location' && offer.specificBranchName 
                        ? `Only in ${offer.specificBranchName} store` 
                        : 'All Locations'}
                    </Text>
                  </View>
                </View>

                {/* Code Badge */}
                <View className={`self-start px-4 py-2.5 rounded-xl flex-row items-center ${offer.requiresCoupon ? 'bg-red-50 border border-red-100' : 'bg-gray-50 border border-gray-200'}`}>
                  <Ionicons name="ticket" size={16} color={offer.requiresCoupon ? '#e62020' : '#6B7280'} />
                  <Text className={`font-bold ml-2 text-sm ${offer.requiresCoupon ? 'text-red-600' : 'text-gray-600'}`}>
                    {offer.requiresCoupon ? 'Code: Look Deal' : 'No Code Needed'}
                  </Text>
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
