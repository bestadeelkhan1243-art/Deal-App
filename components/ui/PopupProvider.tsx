import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type PopupType = 'success' | 'error' | 'info';

interface PopupState {
  visible: boolean;
  type: PopupType;
  title: string;
  message: string;
}

interface PopupContextProps {
  showPopup: (type: PopupType, title: string, message: string) => void;
  hidePopup: () => void;
}

const PopupContext = createContext<PopupContextProps | undefined>(undefined);

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) throw new Error("usePopup must be used within a PopupProvider");
  return context;
};

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [popup, setPopup] = useState<PopupState>({
    visible: false,
    type: 'info',
    title: '',
    message: ''
  });

  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [opacityAnim] = useState(new Animated.Value(0));

  const showPopup = (type: PopupType, title: string, message: string) => {
    setPopup({ visible: true, type, title, message });
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const hidePopup = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      setPopup((prev) => ({ ...prev, visible: false }));
    });
  };

  const getIcon = () => {
    switch (popup.type) {
      case 'success': return <Ionicons name="checkmark-circle" size={56} color="#10B981" />;
      case 'error': return <Ionicons name="close-circle" size={56} color="#ED1C24" />;
      case 'info': return <Ionicons name="information-circle" size={56} color="#3B82F6" />;
    }
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      <Modal transparent visible={popup.visible} animationType="none">
        <View style={styles.overlay}>
          <Animated.View style={[styles.popupContainer, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.iconContainer}>{getIcon()}</View>
            <Text style={styles.title}>{popup.title}</Text>
            <Text style={styles.message}>{popup.message}</Text>
            <TouchableOpacity 
              style={[styles.button, popup.type === 'error' ? styles.errorButton : styles.successButton]} 
              onPress={hidePopup}
            >
              <Text style={styles.buttonText}>Got it</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </PopupContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popupContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#111827',
  },
  errorButton: {
    backgroundColor: '#ED1C24',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
