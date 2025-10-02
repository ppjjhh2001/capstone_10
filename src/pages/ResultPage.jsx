import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { results } from '../data/mbtiData.js'; 
import resultImage from '../assets/main-image.png';

function ResultPage() {
  const navigate = useNavigate();
  const { mbtiType } = useParams(); // URL 파라미터에서 mbtiType 불러옴

  console.log("URL에서 받은 mbtiType:", mbtiType);

  const resultData = results[mbtiType];
  
  console.log("찾은 결과 데이터:", resultData);

  const handleRetry = () => {
    navigate('/');
  };

  // result page
  return (
    <div style={styles.container}>
      <div style={styles.resultCard}>
        <p style={styles.introText}>당신의 여행 MBTI는...</p>
        <h1 style={styles.title}>{resultData.title}</h1>
        <h2 style={styles.mbtiType}>{mbtiType}</h2>
        
        <img src={resultImage} alt="결과 이미지" style={styles.resultImage} />

        <p style={styles.description}>{resultData.description}</p>
        
        <div style={styles.recommendationBox}>
          <h3 style={styles.recommendationTitle}>당신을 위한 추천 여행지</h3>
          <p style={styles.recommendationPlace}>{resultData.recommendedPlace}</p>
        </div>

        <button onClick={handleRetry} style={{...styles.button, backgroundColor: '#28a745'}}>
          다시 테스트하기
        </button>
      </div>
    </div>
  );
}

// styles
const styles = {
    container: {
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        minHeight: '100vh', backgroundColor: '#eef2f6', padding: '20px', fontFamily: 'Arial, sans-serif'
    },
    resultCard: {
        backgroundColor: '#fff', borderRadius: '20px', padding: '40px', textAlign: 'center',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)', width: '90%', maxWidth: '500px'
    },
    introText: { fontSize: '1.2rem', color: '#6c757d' },
    title: { fontSize: '2.5rem', color: '#343a40', margin: '10px 0' },
    mbtiType: { fontSize: '2rem', color: '#007bff', marginBottom: '20px' },
    resultImage: { width: '100%', borderRadius: '15px', marginBottom: '20px' },
    description: { fontSize: '1.1rem', color: '#495057', lineHeight: '1.7', textAlign: 'left', marginBottom: '30px' },
    recommendationBox: { backgroundColor: '#f8f9fa', borderRadius: '15px', padding: '20px', marginBottom: '30px' },
    recommendationTitle: { fontSize: '1.3rem', color: '#343a40', marginBottom: '10px' },
    recommendationPlace: { fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' },
    button: {
        padding: '15px 30px', fontSize: '1.2rem', color: '#fff', border: 'none',
        borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
};

export default ResultPage;