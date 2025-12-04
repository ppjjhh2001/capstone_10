import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import ContentCard from '../../components/ContentCard.jsx';
import { regionData } from '../../data/regionData.js';
import { useTourist } from '../../context/TouristContext.jsx'; // 2. ▼▼▼ [신규] ▼▼▼

function RegionalContentPage() {
  
  const [filterRegion, setFilterRegion] = useState(''); 
  const [filterCity, setFilterCity] = useState(null); 
  
  const { spots, loadingSpots } = useTourist();

  const handleRegionClick = (regionKey) => {
    setFilterRegion(regionKey);
    setFilterCity(null); 
  };
  const handleCityClick = (city) => {
    setFilterCity(city);
  };

  const filteredContent = spots.filter(item => {
    if (!filterRegion) return true;
    if (!filterCity) {
      return item.regionKey === filterRegion;
    }
    return item.regionKey === filterRegion && item.cityKey === filterCity;
  });
  if (loadingSpots) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        관심지역 콘텐츠 로딩 중...
      </div>
    );
  }

  return (
    <section style={styles.contentSection}>

      <h1 style={styles.contentTitle}>
        우리의 방문이 힘이 되는 지역 명소
      </h1>
      <p style={styles.subtitle}>
        이곳은 인구 감소로 어려움을 겪고 있지만, 그만큼 독특한 매력을 간직한 곳들입니다.<br />
        여러분의 방문이 지역에 새로운 활력을 불어넣을 수 있습니다.
      </p>

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

      <div style={styles.contentListArea}>
        {filteredContent.length > 0 ? (
          filteredContent.map(item => (
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
          <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
            {filterRegion ? '선택한 지역에 콘텐츠가 없습니다.' : '등록된 콘텐츠가 없습니다.'}
          </p>
        )}
      </div>

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
  contentSection: {
    padding: '4rem 2rem',
    backgroundColor: '#fff',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  contentTitle: {
    fontSize: '2.2rem',
    color: '#343a40',
    marginBottom: '1rem', 
    textAlign: 'center', 
  },
  subtitle: { 
    fontSize: '1.1rem',
    color: '#555',
    textAlign: 'center',
    lineHeight: '1.6',
    marginBottom: '2.5rem',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #eee',
    borderBottom: '1px solid #eee',
    padding: '1.5rem 0'
  },
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
  contentListArea: { 
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
};

export default RegionalContentPage;