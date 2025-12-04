import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import JobCard from '../../components/JobCard.jsx';
import ContentCard from '../../components/ContentCard.jsx';
import { useJobs } from '../../context/JobContext.jsx'; 
import { useTourist } from '../../context/TouristContext.jsx'; // 1. 관광지 Context import

function MainPage() {
  const navigate = useNavigate();
  const { jobs, loadingJobs } = useJobs();
  const { spots, loadingSpots } = useTourist();
  
  const latestJobs = jobs.slice(0, 3);
  const latestRegions = spots.slice(0, 2);// (DB에 2개만 있으므로 2개 표시)

  if (loadingJobs || loadingSpots) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        메인 페이지 로딩 중...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>지역의 숨겨진 일자리,</h1>
          <h2 style={styles.heroSubtitle}>우리가 채워요</h2>
          <p style={styles.heroText}>
            인구 감소 지역의 구인난 해소와<br />
            새로운 기회를 찾는 구직자를 연결합니다.
          </p>
          <div style={styles.heroButtons}>
            <Link to="/regional" style={styles.heroButtonSecondary}>지역 명소 찾기</Link>
            <Link to="/jobs" style={styles.heroButton}>돈 벌면서 여행하기</Link>
          </div>
        </div>
      </section>


      <section style={styles.previewSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>지역 활력 스팟 🏞️</h2>
          <Link to="/regional" style={styles.viewMoreLink}>더보기 &rarr;</Link>
        </div>
        <div style={styles.previewContainer}>
          {latestRegions.length > 0 ? (
            latestRegions.map(item => (
              <Link key={item.id} to={`/regional/${item.id}`} style={{ textDecoration: 'none' }}>
                <ContentCard 
                  item={{
                    title: item.name, 
                    description: `${item.category} | ${item.address}`,
                    imageUrl: item.imageUrl,
                  }} 
                />
              </Link>
            ))
          ) : (
            <p style={styles.emptyMessage}>등록된 콘텐츠가 없습니다.</p>
          )}
        </div>
      </section>
      
      <section style={styles.previewSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>방금 올라온 일자리 🧑‍🍳</h2>
          <Link to="/jobs" style={styles.viewMoreLink}>더보기 &rarr;</Link>
        </div>
        <div style={styles.previewContainer}>
          {latestJobs.length > 0 ? (
            latestJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <p style={styles.emptyMessage}>현재 등록된 일자리가 없습니다.</p>
          )}
        </div>
      </section>

      

      <section style={styles.mbtiSection}>
        <h2 style={styles.sectionTitle}>나와 어울리는 지역은?</h2>
        <p style={styles.mbtiText}>간단한 테스트로 숨겨진 내 성향과 딱 맞는 지역을 찾아보세요!</p>
        <button 
          style={styles.mbtiButton}
          onClick={() => navigate('/mbti-test')}
        >테스트 시작하기</button>
      </section>
      
      <footer style={styles.footer}>
        <p>&copy; 2025 Re:Town. All rights reserved.</p>
      </footer>
    </div>
  );
}

// (styles 객체)
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  // Hero Section
  heroSection: {
    backgroundColor: '#004a9e',
    color: 'white',
    padding: '5rem 2rem',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: '800px',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    margin: 0,
  },
  heroSubtitle: {
    fontSize: '2.5rem',
    fontWeight: '300',
    margin: '0.5rem 0',
  },
  heroText: {
    fontSize: '1.2rem',
    lineHeight: 1.6,
    margin: '1.5rem 0 2rem 0',
  },
  heroButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  heroButton: {
    backgroundColor: '#ffc107',
    color: '#000',
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: 'transform 0.2s',
  },
  heroButtonSecondary: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: 'background-color 0.2s',
  },
  // Preview Section
  previewSection: {
    padding: '3rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    color: '#333',
    margin: 0,
  },
  viewMoreLink: {
    fontSize: '1rem',
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  emptyMessage: {
    color: '#888',
    padding: '1rem 0',
  },
  // MBTI Section
  mbtiSection: {
    backgroundColor: '#f4f4f4',
    padding: '3rem 2rem',
    textAlign: 'center',
  },
  mbtiText: {
    fontSize: '1.1rem',
    color: '#555',
    margin: '1rem 0 1.5rem 0',
  },
  mbtiButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  // Footer
  footer: {
    backgroundColor: '#343a40',
    color: 'white',
    textAlign: 'center',
    padding: '1.5rem 2rem',
  },
};

export default MainPage;