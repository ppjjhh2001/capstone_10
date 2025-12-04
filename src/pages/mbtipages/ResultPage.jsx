import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMbti } from '../../context/MbtiContext.jsx';
import { useTourist } from '../../context/TouristContext.jsx';
import resultImage from '../../assets/main-image.png';

function ResultPage() {
  const navigate = useNavigate();
  const { mbtiType } = useParams();
  
  const { mbtiResults, loadingMbti } = useMbti();
  const { spots } = useTourist(); 
  
  const resultData = mbtiResults ? mbtiResults[mbtiType] : null;

  const [randomRecommendation, setRandomRecommendation] = useState(null);

  useEffect(() => {
    if (resultData && resultData.recommended && resultData.recommended.length > 0) {
      const randomIndex = Math.floor(Math.random() * resultData.recommended.length);
      setRandomRecommendation(resultData.recommended[randomIndex]);
    }
  }, [resultData]);

  const matchedSpot = useMemo(() => {
    if (!randomRecommendation || !spots || spots.length === 0) return null;
    return spots.find(spot => randomRecommendation.place.includes(spot.name));
  }, [randomRecommendation, spots]);

  const handleRetry = () => {
    navigate('/mbti-test');
  };

  const handleMain = () => {
    navigate('/');
  };

  if (loadingMbti) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>결과 로딩 중...</div>;
  }

  if (!resultData) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>결과를 찾을 수 없습니다.</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.resultCard}>
        <p style={styles.introText}>당신의 여행 MBTI는...</p>
        <h1 style={styles.title}>{resultData.title}</h1>
        <h2 style={styles.mbtiType}>{mbtiType}</h2>
        
        {matchedSpot ? (
          <Link to={`/regional/${matchedSpot.id}`} style={styles.imageLinkWrapper}>
             <img 
               src={matchedSpot.imageUrl} 
               alt={matchedSpot.name} 
               style={styles.spotImage} 
               onError={(e) => { e.target.src = resultImage; }} 
             />
             <div style={styles.imageOverlay}>
                <span>📸 {matchedSpot.name} 보러가기</span>
             </div>
          </Link>
        ) : (
          <img src={resultImage} alt="결과 이미지" style={styles.defaultImage} />
        )}

        <div style={{marginTop: '20px'}}>
           <p style={styles.description}>{resultData.description}</p>
        </div>

        {randomRecommendation && (
          <div style={styles.recommendationBox}>
            <h3 style={styles.recommendationTitle}>추천 여행지: {randomRecommendation.place}</h3>
            <p style={styles.placeReason}>{randomRecommendation.reason}</p>
            
            {!matchedSpot && (
              <p style={{fontSize: '0.8rem', color: '#999', marginTop: '10px'}}>
                * 이 여행지의 상세 정보는 준비 중입니다.
              </p>
            )}
          </div>
        )}

        <div style={styles.buttonGroup}>
          <button onClick={handleRetry} style={styles.retryButton}>테스트 다시하기</button>
          <button onClick={handleMain} style={styles.homeButton}>홈으로 가기</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px', fontFamily: 'Arial, sans-serif'
  },
  resultCard: {
    backgroundColor: '#fff', borderRadius: '20px', padding: '40px', textAlign: 'center',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)', width: '90%', maxWidth: '500px'
  },
  introText: { fontSize: '1.2rem', color: '#6c757d' },
  title: { fontSize: '2.5rem', color: '#343a40', margin: '10px 0' },
  mbtiType: { fontSize: '2rem', color: '#007bff', marginBottom: '20px' },
  description: { fontSize: '1.1rem', color: '#495057', lineHeight: '1.7', textAlign: 'left', marginBottom: '30px' },
  imageLinkWrapper: {
    display: 'block', position: 'relative', width: '100%', height: '300px', 
    borderRadius: '15px', overflow: 'hidden', cursor: 'pointer', marginBottom: '20px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
  },
  spotImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
  imageOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', color: 'white',
    padding: '10px', fontWeight: 'bold'
  },
  defaultImage: { width: '100%', borderRadius: '15px', marginBottom: '20px' },
  recommendationBox: { 
    backgroundColor: '#f1f3f5', borderRadius: '15px', padding: '20px', textAlign: 'left', marginBottom: '30px' 
  },
  recommendationTitle: { fontSize: '1.3rem', color: '#007bff', marginBottom: '10px', fontWeight: 'bold' },
  placeReason: { fontSize: '1rem', color: '#495057', lineHeight: '1.5' },
  buttonGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
  retryButton: { padding: '15px', fontSize: '1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' },
  homeButton: { padding: '15px', fontSize: '1rem', backgroundColor: '#fff', color: '#007bff', border: '2px solid #007bff', borderRadius: '10px', cursor: 'pointer' }
};

export default ResultPage;