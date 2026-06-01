import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-3 px-4 rounded-xl flex-row justify-center items-center";
  
  const variants = {
    primary: "bg-red-600 active:bg-red-700",
    secondary: "bg-gray-950 active:bg-black",
    outline: "bg-transparent border-2 border-red-600 active:bg-red-50",
  };

  const textVariants = {
    primary: "text-white font-semibold text-base",
    secondary: "text-white font-semibold text-base",
    outline: "text-red-600 font-semibold text-base",
  };

  return (
    <TouchableOpacity 
      className={`${baseStyles} ${variants[variant]} ${className} ${props.disabled ? 'opacity-50' : ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'secondary' ? 'white' : '#dc2626'} />
      ) : (
        <Text className={textVariants[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
