'use client';

import React, { createContext, useContext, useState } from 'react';
import { RegisterFormData } from '../types/register.types';

type RegisterContextType = {
  formData: RegisterFormData;
  updateFormData: (patch: Partial<RegisterFormData>) => void;
  errors: Partial<Record<keyof RegisterFormData, string>>;
  setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof RegisterFormData, string>>>>;
};

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export function RegisterProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    otp: '',
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const updateFormData = (patch: Partial<RegisterFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  return (
    <RegisterContext.Provider value={{ formData, updateFormData, errors, setErrors }}>
      {children}
    </RegisterContext.Provider>
  );
}

export const useRegisterForm = () => {
  const context = useContext(RegisterContext);
  if (!context) throw new Error('useRegisterForm must be used within RegisterProvider');
  return context;
};