import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userProfile = await fetchUserProfile(fbUser.uid);
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          ...userProfile
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.warn("Firestore에 해당 유저 프로필이 없습니다.");
        return null;
      }
    } catch (e) {
      console.error("프로필 로드 실패:", e);
      return null;
    }
  };

  const signup = async (email, password, name, role, phone, businessNumber) => {
    if (!email || !password || !name || !role || !phone) {
      alert("모든 필수 정보를 입력해주세요.");
      return false;
    }
    if (role === 'employer' && !businessNumber) {
      alert("사장님은 사업자 등록번호가 필수입니다.");
      return false;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newFbUser = userCredential.user;
      
      const userProfile = {
        email: email,
        name: name,
        role: role,
        phone: phone,
        businessNumber: role === 'employer' ? businessNumber : null,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, "users", newFbUser.uid), userProfile);
      
      setUser({
        uid: newFbUser.uid,
        ...userProfile
      });
      
      navigate('/');
      return true;

    } catch (error) {
      console.error("회원가입 실패:", error.code, error.message);
      if (error.code === 'auth/email-already-in-use') {
        alert('이미 사용 중인 이메일입니다.');
      } else {
        alert('회원가입 중 오류가 발생했습니다: ' + error.message);
      }
      return false;
    }
  };
  
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
      return true;
    } catch (error) {
      console.error("로그인 실패:", error.code);
      alert('이메일 또는 비밀번호가 잘못되었습니다.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const value = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    signup,
  };
  
  if (loading) {
    return <div>앱 로딩 중...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}