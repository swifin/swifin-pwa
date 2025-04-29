/* ~/swifin-pwa/context/ProfileContext.js */

import { createContext, useContext, useState } from 'react';
import { encrypt, decrypt } from '@/lib/crypto';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [credentials, setCredentials] = useState(null);

  const login = ({ profileData, swifinId, password }) => {
    setProfile(profileData);
    setCredentials({
      swifinId: encrypt(swifinId),
      password: encrypt(password)
    });
  };

  const logout = () => {
    setProfile(null);
    setCredentials(null);
  };

  const getDecryptedCredentials = () => {
    if (!credentials) return null;
    return {
      swifinId: decrypt(credentials.swifinId),
      password: decrypt(credentials.password)
    };
  };

  return (
    <ProfileContext.Provider value={{ profile, login, logout, getDecryptedCredentials, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
