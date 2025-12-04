import React from 'react';

// 공통 카드 컴포넌트
const ContentCard = ({ item }) => (
  <div style={styles.contentCard}>
    <img src={item.imageUrl} alt={item.title} style={styles.cardImage} />
    <div style={styles.cardContent}>
      <h4 style={styles.cardTitle}>{item.title}</h4>
      <p style={styles.cardAuthor}>{item.description}</p>
    </div>
  </div>
);

// ContentCard에 필요한 스타일만 포함
const styles = {
  contentCard: {
    display: 'flex',
    border: '1px solid #eee',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
  },
  cardImage: {
    width: '150px',
    height: '100px',
    objectFit: 'cover'
  },
  cardContent: {
    padding: '1rem'
  },
  cardTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem'
  },
  cardAuthor: {
    fontSize: '0.9rem',
    color: '#666',
    margin: 0
  },
};

export default ContentCard;