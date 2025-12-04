import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const MbtiContext = createContext(null);

export function MbtiProvider({ children }) {
  const [mbtiQuestions, setMbtiQuestions] = useState([]);
  const [mbtiResults, setMbtiResults] = useState({}); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {

        const qQuery = query(collection(db, 'mbtiQuestions'), orderBy('id', 'asc'));
        const qSnapshot = await getDocs(qQuery);
        const questionsData = qSnapshot.docs.map(doc => doc.data());
        setMbtiQuestions(questionsData);

        const rSnapshot = await getDocs(collection(db, 'mbtiResults'));
        const resultsData = {};
        rSnapshot.docs.forEach(doc => {
          resultsData[doc.id] = doc.data();
        });
        setMbtiResults(resultsData);

      } catch (error) {
        console.error("MBTI 데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const value = {
    mbtiQuestions,
    mbtiResults,
    loadingMbti: loading
  };

  return (
    <MbtiContext.Provider value={value}>
      {children}
    </MbtiContext.Provider>
  );
}

export function useMbti() {
  const context = useContext(MbtiContext);
  if (!context) {
    throw new Error('useMbti must be used within an MbtiProvider');
  }
  return context;
}