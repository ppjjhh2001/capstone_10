import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useJobs } from '../../context/JobContext.jsx';
import { regionData } from '../../data/regionData.js';

function JobBoardPage() {
  const { user, isLoggedIn } = useAuth();
  const { jobs } = useJobs(); 
  const navigate = useNavigate();

  const [filterRegion, setFilterRegion] = useState('');
  const [filterCity, setFilterCity] = useState(null);

  const handleWritePost = () => {
    navigate('/jobs/new'); 
  };
  
  const handleRowClick = (jobId) => {
    navigate(`/jobs/${jobId}`); 
  };
  
  const handleRegionClick = (regionKey) => {
    setFilterRegion(regionKey);
    setFilterCity(null);
  };

  const handleCityClick = (city) => {
    setFilterCity(city);
  };

  const filteredJobs = jobs.filter(job => {
    
    if (!filterRegion) return true;
   
    if (!filterCity) {
      return job.regionKey === filterRegion;
    }
    return job.regionKey === filterRegion && job.cityKey === filterCity;
  });


  return (
    <section style={styles.boardSection}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          돈 벌면서 여행하기
        </h2>
        {isLoggedIn && user.role === 'employer' && (
          <button onClick={handleWritePost} style={styles.writeButton}>
            공고 등록하기
          </button>
        )}
      </div>

      <div style={styles.filterContainer}>
        <div style={styles.regionTabs}>
          <button
            onClick={() => handleRegionClick('')}
            style={filterRegion === '' ? styles.tabButtonActive : styles.tabButton}
          >
            전체
          </button>
          {Object.keys(regionData).map((key) => (
            <button
              key={key}
              onClick={() => handleRegionClick(key)}
              style={filterRegion === key ? styles.tabButtonActive : styles.tabButton}
            >
              {regionData[key].name}
            </button>
          ))}
        </div>
  
        {filterRegion && (
          <div style={styles.cityTabs}>
            <button
              onClick={() => handleCityClick(null)}
              style={filterCity === null ? styles.tabButtonActive : styles.tabButton}
            >
              {regionData[filterRegion].name} 전체
            </button>
            {regionData[filterRegion].cities.map((city) => (
              <button
                key={city}
                onClick={() => handleCityClick(city)}
                style={filterCity === city ? styles.tabButtonActive : styles.tabButton}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      <table style={styles.jobTable}>
        <thead>
          <tr>
            <th style={styles.th}>지역</th>
            <th style={styles.th}>제목</th>
            <th style={styles.th}>회사명</th>
            <th style={styles.th}>등록일</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <tr key={job.id} onClick={() => handleRowClick(job.id)} style={styles.tr}>
                <td style={styles.td}>[{regionData[job.regionKey]?.name} {job.cityKey}]</td>
                <td style={styles.tdTitle}>{job.title}</td>
                <td style={styles.td}>{job.company}</td>
                <td style={styles.td}>{job.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={styles.tdEmpty}>
                {filterRegion ? '선택한 지역에 공고가 없습니다.' : '등록된 공고가 없습니다.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

const baseTabButton = {
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: '#ced4da',
  borderRadius: '8px',
  backgroundColor: '#fff',
  color: '#495057',
  cursor: 'pointer',
  marginRight: '0.5rem',
  marginBottom: '0.5rem',
  transition: 'all 0.2s',
};

const styles = {
  boardSection: {
    padding: '4rem 2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#343a40',
    margin: 0,
  },
  writeButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#6c757d',
    marginBottom: '3rem',
  },
  
  // --- 필터 스타일 ---
  filterContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '2rem',
    border: '1px solid #dee2e6',
    borderRadius: '12px',
  },
  regionTabs: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
  },
  cityTabs: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '1rem',
    gap: '0.5rem',
    borderTop: '1px solid #dee2e6',
  },
  tabButton: baseTabButton,
  tabButtonActive: {
    ...baseTabButton,
    backgroundColor: '#007bff',
    color: '#fff',
    borderColor: '#007bff',
    fontWeight: 'bold',
  },
  
  // --- 테이블 스타일 ---
  jobTable: { width: '100%', borderCollapse: 'collapse', borderTop: '2px solid #343a40' },
  th: { padding: '1rem', borderBottom: '1px solid #dee2e6', backgroundColor: '#f8f9fa', fontWeight: 'bold', textAlign: 'left' },
  tr: { cursor: 'pointer', '&:hover': { backgroundColor: '#f1f1f1' } },
  td: { padding: '1rem', borderBottom: '1px solid #e9ecef', color: '#495057' },
  tdTitle: { padding: '1rem', borderBottom: '1px solid #e9ecef', color: '#343a40', fontWeight: 'bold' },
  tdEmpty: { padding: '3rem', textAlign: 'center', color: '#888', fontSize: '1.1rem' }
};

export default JobBoardPage;