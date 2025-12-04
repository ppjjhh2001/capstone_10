import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useJobs } from '../../context/JobContext.jsx';
import { useInteraction } from '../../context/InteractionContext.jsx'; 
import { Link } from 'react-router-dom';

function SeekerDashboard() {
  const { getJobById, loadingJobs } = useJobs();
  const { 
    applications,
    favorites,
    loadingInteractions 
  } = useInteraction();

  const appliedJobIds = [...new Set(applications.map(app => app.jobId))];
  
  const favoriteJobIds = [...new Set(favorites.map(fav => fav.jobId))];

  const appliedJobs = appliedJobIds
    .map(jobId => getJobById(jobId))
    .filter(Boolean);
  
  const favoriteJobs = favoriteJobIds
    .map(jobId => getJobById(jobId))
    .filter(Boolean);

  if (loadingJobs || loadingInteractions) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        내 정보 로딩 중...
      </div>
    );
  }

  return (
    <>
      <div style={styles.box}>
        <h3 style={styles.boxTitle}>지원한 공고 ({appliedJobs.length}개)</h3>
        {appliedJobs.length > 0 ? (
          <ul style={styles.jobList}>
            {appliedJobs.map(job => (
              <li key={job.id} style={styles.jobItem}>
                <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                <span style={styles.jobCompany}>{job.company}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>지원한 공고가 없습니다.</p>
        )}
      </div>

      <div style={styles.box}>
        <h3 style={styles.boxTitle}>즐겨찾기 ({favoriteJobs.length}개)</h3>
        {favoriteJobs.length > 0 ? (
          <ul style={styles.jobList}>
            {favoriteJobs.map(job => (
              <li key={job.id} style={styles.jobItem}>
                <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                <span style={styles.jobCompany}>{job.company}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>즐겨찾기한 공고가 없습니다.</p>
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

export default SeekerDashboard;