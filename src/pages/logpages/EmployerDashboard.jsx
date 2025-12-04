import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx'; 
import { useJobs } from '../../context/JobContext.jsx';
import { Link } from 'react-router-dom';
import { db } from '../../firebaseConfig.js';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

function EmployerDashboard() {
  const { user, getUserInfo } = useAuth();
  const { jobs, loadingJobs } = useJobs();

  const myJobs = jobs.filter(job => job.authorId === user.uid);
  

  const [allApplicants, setAllApplicants] = useState([]); // [{ jobId, jobTitle, applicants: [...] }]
  const [loadingApplicants, setLoadingApplicants] = useState(true);

  useEffect(() => {
    if (loadingJobs || myJobs.length === 0) {
      setLoadingApplicants(false);
      return;
    }

    const fetchApplicants = async () => {
      setLoadingApplicants(true);

      const myJobIds = myJobs.map(job => job.id);

      const appQuery = query(
        collection(db, "applications"), 
        where("jobId", "in", myJobIds),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(appQuery);

      const applicantsData = querySnapshot.docs.map(doc => doc.data());

      const groupedData = myJobs.map(job => {
        const applicantsForThisJob = applicantsData
          .filter(app => app.jobId === job.id)
          .map(app => ({
            userId: app.userId,
            date: new Date(app.createdAt.toDate()).toISOString()
          }));

          const uniqueApplicants = [
          ...new Map(applicantsForThisJob.map(app => [app.userId, app])).values()
        ];
        
        return {
          jobId: job.id,
          jobTitle: job.title,
          applicants: uniqueApplicants
        };
      });

      setAllApplicants(groupedData);
      setLoadingApplicants(false);
    };

    fetchApplicants();
    
  }, [loadingJobs, myJobs]);

  if (loadingJobs || loadingApplicants) {
    return <div>내 공고 및 지원자 정보 로딩 중...</div>;
  }

  return (
    <>
      <div style={styles.box}>
        <h3 style={styles.boxTitle}>내가 올린 공고 ({myJobs.length}개)</h3>
        {myJobs.length > 0 ? (
          <ul style={styles.jobList}>
            {myJobs.map(job => (
              <li key={job.id} style={styles.jobItem}>
                <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                <span style={styles.jobDate}>{job.date}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>내가 올린 공고가 없습니다.</p>
        )}
      </div>

      <div style={styles.box}>
        <h3 style={styles.boxTitle}>지원 내역</h3>
        {allApplicants.length > 0 ? (
          allApplicants.map(item => (
            item.applicants.length > 0 && (
              <div key={item.jobId} style={styles.applicantSection}>
                <h4>
                  &raquo; <Link to={`/jobs/${item.jobId}`}>{item.jobTitle}</Link> 공고
                </h4>
                <ul style={styles.applicantList}>
                  
                  {item.applicants.map((applicant, index) => {
                    const applicantDetails = getUserInfo(applicant.userId);
                    return (
                      <li key={index}>
                        <strong>{applicant.userId}</strong> 님
                        {applicantDetails ? (
                          <span style={styles.phone}> ({applicantDetails.phone})</span>
                        ) : ( ' (연락처 정보 없음)' )}
                        <br />
                        <span style={styles.dateText}>
                          {new Date(applicant.date).toLocaleString('ko-KR')}에 지원
                        </span>
                      </li>
                    );
                  })}

                </ul>
              </div>
            )
          ))
        ) : (
          <p>아직 지원자가 없습니다.</p>
        )}
      </div>
    </>
  );
}

const styles = {
  box: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '1.5rem 2rem',
    marginBottom: '2rem',
  },
  boxTitle: { fontSize: '1.5rem', marginTop: 0, marginBottom: '1rem' },
  // (내가 올린 공고 스타일)
  jobList: { listStyle: 'none', paddingLeft: 0 },
  jobItem: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' },
  jobDate: { color: '#888' },
  // (지원 내역 스타일)
  applicantSection: { marginTop: '1rem' },
  applicantList: { 
    listStyle: 'none', 
    paddingLeft: '1rem', 
    borderLeft: '3px solid #007bff' 
  },
  phone: { // 전화번호 스타일
    color: '#007bff',
    fontWeight: 'bold',
  },
  dateText: { // 날짜 스타일
    fontSize: '0.9rem',
    color: '#666',
  }
};

export default EmployerDashboard;