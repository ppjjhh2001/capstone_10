import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig.js';
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const JobContext = createContext(null);

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
    
    const jobsCollectionRef = collection(db, "jobs");
    const q = query(jobsCollectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.createdAt ? new Date(data.createdAt.toDate()).toISOString().split('T')[0] : '날짜 없음'
        };
      });
      setJobs(jobsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addJob = async (jobData) => {
    try {

      const newJobData = {
        ...jobData,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, "jobs"), newJobData);
    } catch (e) {
      console.error("공고 추가 실패:", e);
    }
  };

  const deleteJob = async (id) => {
    try {
      const jobDocRef = doc(db, "jobs", id);
      await deleteDoc(jobDocRef);
    } catch (e) {
      console.error("공고 삭제 실패:", e);
    }
  };

  const updateJob = async (id, updatedData) => {
    try {
      const jobDocRef = doc(db, "jobs", id);
      await updateDoc(jobDocRef, updatedData);
    } catch (e) {
      console.error("공고 수정 실패:", e);
    }
  };

  const getJobById = (id) => {
    return jobs.find(job => job.id === id);
  };

  const value = {
    jobs,
    addJob,
    getJobById,
    deleteJob,
    updateJob,
    loadingJobs: loading
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}