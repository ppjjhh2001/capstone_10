// src/pages/AboutPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.mainTitle}>새로운 여행 MBTI 알아보기</h1>
        <p style={styles.introText}>
          4가지 새로운 기준을 통해
          <br />
          당신의 진짜 여행 스타일을 발견해 보세요!
        </p>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>1. 여행의 에너지를 어디서 얻나요?</h2>
          <p><strong>R (Relaxation / 휴식형):</strong> 🛏️ 북적이는 곳보다 조용한 곳에서 재충전! 여행은 역시 힐링이 최고예요.</p>
          <p><strong>A (Activity / 활동형):</strong> 🏃‍♀️ 하나라도 더 보고, 더 체험해야 직성이 풀려요! 가만히 있는 건 시간 낭비!</p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>2. 어떤 장소에 더 끌리나요?</h2>
          <p><strong>S (Sightseeing / 관광형):</strong> 랜드마크나 유명 맛집은 꼭 가봐야 해요. 모두가 아는 데는 이유가 있죠!</p>
          <p><strong>U (Uncharted / 탐험형):</strong> 🗺️ 남들이 모르는 숨겨진 장소를 발견하는 게 진짜 여행의 묘미라고 생각해요.</p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>3. 여행지에서 돈을 쓸 때 기준은?</h2>
          <p><strong>C (Cost-effective / 가성비형):</strong> 💰 한정된 예산으로 최대의 효율을! 가격 비교는 필수예요.</p>
          <p><strong>E (Experience / 경험형):</strong> ✨ 돈이 좀 들어도 지금 아니면 못 해요! 특별한 경험이 더 중요해요.</p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>4. 계획은 어느 정도로 세우나요?</h2>
          <p><strong>P (Planner / 계획형):</strong> 🗓️ 분 단위로 짜인 완벽한 계획이 있어야 마음이 편안해요.</p>
          <p><strong>J (Jeuk-heung / 즉흥형):</strong> 🤸 계획은 큰 틀만! 발길 닿는 대로 움직이는 게 진짜 자유여행이죠!</p>
        </div>

        <button onClick={() => navigate('/quiz/1')} style={styles.button}>
          테스트 하러 가기
        </button>
      </div>
    </div>
  );
}

// css
const styles = {
    container: {
        padding: '40px 20px',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        width: '90%',
        maxWidth: '800px'
    },
    mainTitle: {
      textAlign: 'center',
      fontSize: '2.5rem',
      color: '#343a40',
      marginBottom: '20px'
    },
    introText: {
      textAlign: 'center',
      fontSize: '1.2rem',
      color: '#6c757d',
      marginBottom: '40px',
      lineHeight: '1.8'
    },
    section: {
      marginBottom: '30px',
      borderTop: '1px solid #e9ecef',
      paddingTop: '30px'
    },
    sectionTitle: {
      fontSize: '1.8rem',
      color: '#007bff',
      marginBottom: '15px'
    },
    button: {
        display: 'block',
        width: '100%',
        padding: '15px 30px',
        fontSize: '1.2rem',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '40px'
    }
};

export default AboutPage;