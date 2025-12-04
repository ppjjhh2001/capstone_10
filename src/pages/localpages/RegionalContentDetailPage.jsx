import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTourist } from '../../context/TouristContext.jsx'; 
import { useJobs } from '../../context/JobContext.jsx';
import { getDistanceFromLatLonInKm } from '../../utils/distance.js';
import JobCard from '../../components/JobCard.jsx';
import KakaoMapDisplay from '../../components/KakaoMapDisplay.jsx';
import { getCoordsByAddress } from '../../utils/geocoder.js';

function RegionalContentDetailPage() {
  const { id } = useParams(); 
  const { getSpotById, loadingSpots } = useTourist();
  const { jobs, loadingJobs } = useJobs();
  const [mapCoords, setMapCoords] = useState(null);

  const spot = getSpotById(id);

  useEffect(() => {
    const setLocation = async () => {
      if (!spot) return;

      if (spot.lat && spot.lng && spot.lat !== 0 && spot.lng !== 0) {
        setMapCoords({ lat: spot.lat, lng: spot.lng });
      } else if (spot.address) {
        try {
          const coords = await getCoordsByAddress(spot.address);
          if (coords) {
            setMapCoords(coords);
          }
        } catch (e) {
          console.error("좌표 변환 실패:", e);
        }
      }
    };
    setLocation();
  }, [spot]);

  const nearbyJobs = useMemo(() => {
    if (loadingSpots || loadingJobs || !mapCoords || !jobs || jobs.length === 0) {
      return [];
    }

    const RECOMMENDED_RADIUS_KM = 20; 

    return jobs
      .map(job => {
        const distance = getDistanceFromLatLonInKm(
          mapCoords.lat, mapCoords.lng, 
          job.lat, job.lng
        );
        return { ...job, distance };
      })
      .filter(job => job.distance !== null && job.distance <= RECOMMENDED_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3); 

  }, [mapCoords, jobs, loadingSpots, loadingJobs]);

  if (loadingSpots || loadingJobs) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>정보 로딩 중...</div>;
  }

  if (!spot) {
    alert('해당 콘텐츠를 찾을 수 없습니다.');
    return <Navigate to="/regional" replace />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.imageContainer}>
        <img 
          src={spot.imageUrl} 
          alt={spot.name} 
          style={styles.mainImage} 
          onError={(e) => { e.target.src = 'https://placehold.co/800x400?text=No+Image'; }} // 이미지 깨짐 방지
        />
      </div>


      <header style={styles.header}>
        <span style={styles.specialTag}>지역 활력 스팟</span>
        <h1 style={styles.title}>{spot.name}</h1>
        <div style={styles.meta}>
          <span style={styles.category}>{spot.category}</span>
          <span style={styles.separator}>|</span>
          <span style={styles.address}>{spot.address}</span>
        </div>
      </header>

      <div style={styles.content}>
        <h3 style={styles.sectionTitle}>상세 정보</h3>
        <ul style={styles.infoList}>
          <li style={styles.infoItem}>
            <strong>📞 전화번호:</strong> {spot.phone || '정보 없음'}
          </li>
          <li style={styles.infoItem}>
            <strong>⏰ 영업시간:</strong>
            <p style={styles.infoText}>{spot.hours || '정보 없음'}</p>
          </li>
          <li style={styles.infoItem}>
            <strong>🗓️ 휴무일:</strong> {spot.closed || '정보 없음'}
          </li>
          <li style={styles.infoItem}>
            <strong>🚗 주차:</strong> {spot.parking || '정보 없음'}
          </li>
        </ul>
      </div>
      
      <div style={styles.mapContainer}>
        <h3 style={styles.mapTitle}>상세 위치</h3>
        {mapCoords ? (
          <KakaoMapDisplay lat={mapCoords.lat} lng={mapCoords.lng} />
        ) : (
          <p>위치 정보를 불러오는 중이거나 주소를 찾을 수 없습니다.</p>
        )}
      </div>

      <div style={styles.recommendationSection}>
        <h3 style={styles.mapTitle}>이곳 근처의 일자리 💼</h3>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          여행도 하고, 일도 하고! 이 명소에서 <strong>20km 이내</strong>에 있는 일자리입니다.
        </p>
        
        {nearbyJobs.length > 0 ? (
          <div style={styles.recommendationContainer}>
            {nearbyJobs.map(job => (
              <div key={job.id} style={{ position: 'relative' }}>
                <JobCard job={job} />
                <span style={styles.distanceBadge}>
                  📍 약 {job.distance.toFixed(1)}km
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyBox}>
            <p>근처(20km 이내)에 등록된 일자리가 아직 없습니다.</p>
            <Link to="/jobs" style={{ color: '#007bff', fontWeight: 'bold' }}>
              전체 일자리 보러 가기 &rarr;
            </Link>
          </div>
        )}
      </div>

      <Link to="/regional" style={styles.backButton}>
        &larr; 목록으로 돌아가기
      </Link>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '2rem auto', padding: '2rem', border: '1px solid #e0e0e0', borderRadius: '8px' },
  imageContainer: { width: '100%', height: '400px', overflow: 'hidden', borderRadius: '8px', marginBottom: '2rem' },
  mainImage: { width: '100%', height: '100%', objectFit: 'cover' },
  header: { paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #f0f0f0' },
  specialTag: { display: 'inline-block', backgroundColor: '#dc3545', color: 'white', padding: '4px 10px', fontSize: '0.9rem', fontWeight: 'bold', borderRadius: '4px', marginBottom: '1rem' },
  title: { fontSize: '2.2rem', margin: '0 0 0.5rem 0' },
  meta: { display: 'flex', gap: '0.5rem', color: '#666', fontSize: '1rem' },
  category: { fontWeight: 'bold' },
  separator: { color: '#ddd' },
  address: { color: '#666' },
  content: { minHeight: '150px', padding: '1rem 0', fontSize: '1.1rem', lineHeight: '1.7' },
  sectionTitle: { fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' },
  infoList: { listStyle: 'none', paddingLeft: 0 },
  infoItem: { marginBottom: '1rem' },
  infoText: { margin: '0.25rem 0 0 0.5rem', color: '#333', whiteSpace: 'pre-wrap' },
  mapContainer: { marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f0f0f0' },
  mapTitle: { fontSize: '1.3rem', marginBottom: '1rem' },
  backButton: { display: 'inline-block', marginTop: '2rem', padding: '0.5rem 1rem', textDecoration: 'none', color: '#007bff', border: '1px solid #007bff', borderRadius: '4px' },
  recommendationSection: {
    marginTop: '3rem',
    paddingTop: '2rem',
    borderTop: '2px dashed #ccc',
    backgroundColor: '#f9fbfc',
    padding: '2rem',
    borderRadius: '12px'
  },
  recommendationContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  distanceBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 123, 255, 0.9)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    zIndex: 10
  },
  emptyBox: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #eee'
  }
};

export default RegionalContentDetailPage;