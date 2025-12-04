import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig.js';
import { 
  collection, addDoc, deleteDoc, doc, query, where, onSnapshot, serverTimestamp 
} from 'firebase/firestore';

const InteractionContext = createContext();

export function InteractionProvider({ children }) {
  const [applications, setApplications] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const appQ = query(collection(db, 'applications'));
    const unsubscribeApp = onSnapshot(appQ, (snapshot) => {
      const appList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        appliedAt: doc.data().appliedAt || doc.data().date || new Date().toISOString()
      }));
      setApplications(appList);
    });

    const favQ = query(collection(db, 'favorites'));
    const unsubscribeFav = onSnapshot(favQ, (snapshot) => {
      const favList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFavorites(favList);
      setLoading(false);
    });

    return () => {
      unsubscribeApp();
      unsubscribeFav();
    };
  }, []);

  const addApplication = async (userId, jobId, name, phone, introduction) => {
    const alreadyApplied = applications.some(
      app => app.userId === userId && app.jobId === jobId
    );
    if (alreadyApplied) {
      alert("이미 지원한 공고입니다.");
      return;
    }

    await addDoc(collection(db, 'applications'), {
      userId: userId,
      jobId: jobId,
      applicantName: name || "이름 없음",
      applicantPhone: phone || "전화번호 없음",
      applicantIntro: introduction || "",
      appliedAt: new Date().toISOString(),
    });
  };


  const addFavorite = async (userId, jobId) => {
    const alreadyFaved = favorites.some(
      fav => fav.userId === userId && fav.jobId === jobId
    );
    if (alreadyFaved) return;

    await addDoc(collection(db, 'favorites'), {
      userId: userId,
      jobId: jobId,
      createdAt: new Date().toISOString()
    });
  };

  const removeFavorite = async (userId, jobId) => {
    const favToRemove = favorites.find(
      fav => fav.userId === userId && fav.jobId === jobId
    );
    if (favToRemove) {
      await deleteDoc(doc(db, 'favorites', favToRemove.id));
    }
  };

  const hasApplied = (userId, jobId) => {
    return applications.some(app => app.userId === userId && app.jobId === jobId);
  };

  const isFavorited = (userId, jobId) => {
    return favorites.some(fav => fav.userId === userId && fav.jobId === jobId);
  };

  const value = {
    applications,
    favorites,
    addApplication,
    addFavorite,
    removeFavorite,
    hasApplied,
    isFavorited,
    loading
  };

  return (
    <InteractionContext.Provider value={value}>
      {children}
    </InteractionContext.Provider>
  );
}

export function useInteraction() {
  return useContext(InteractionContext);
}