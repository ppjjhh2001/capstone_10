import React, { createContext, useContext, useState, useEffect } from 'react';

const TouristContext = createContext(null);

export function TouristProvider({ children }) {
  const [spots, setSpots] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpots = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://annett-graspable-alana.ngrok-free.dev', {
          method: 'GET',
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          throw new Error(`서버 통신 에러: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("🔥 서버 원본 데이터:", responseData);

        let rawList = [];
        if (responseData.data && Array.isArray(responseData.data)) {
          rawList = responseData.data;
        } else if (Array.isArray(responseData)) {
          rawList = responseData;
        } else {
          console.error("❌ 데이터 형식이 예상과 다릅니다.", responseData);
          return;
        }

        const formattedSpots = rawList.map((item, index) => ({
          id: String(item.attraction_id),
          name: item.name || item.title || item.spot_name || "이름 없음",
          category: item.type,  
          address: item.address,
          phone: item.phone,
          hours: item.operating_hours,  
          closed: item.holidays,              
          parking: item.parking,
          regionKey: mapRegionToKey(item.region),
          cityKey: item.subregion,         
          lat: item.lat || 0, 
          lng: item.lng || 0,
          imageUrl: item.image_url || 'https://placehold.co/600x400?text=No+Image'
        }));

        setSpots(formattedSpots);
        console.log("✅ 변환 완료된 데이터:", formattedSpots);
        
      } catch (error) {
        console.error("관광지 데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, []);

  const mapRegionToKey = (koreanName) => {
    if (!koreanName) return 'etc';
    if (koreanName.includes('강원')) return 'gangwon';
    if (koreanName.includes('경남') || koreanName.includes('경상남도')) return 'gyeongnam';
    if (koreanName.includes('경북') || koreanName.includes('경상북도')) return 'gyeongbuk';
    if (koreanName.includes('전남') || koreanName.includes('전라남도')) return 'jeonnam';
    if (koreanName.includes('전북') || koreanName.includes('전라북도')) return 'jeonbuk';
    if (koreanName.includes('충남') || koreanName.includes('충청남도')) return 'chungnam';
    if (koreanName.includes('충북') || koreanName.includes('충청북도')) return 'chungbuk';
    return 'etc';
  };

  const getSpotById = (id) => {
    return spots.find(spot => String(spot.id) === String(id));
  };

  const value = {
    spots,
    getSpotById,
    loadingSpots: loading
  };

  return (
    <TouristContext.Provider value={value}>
      {children}
    </TouristContext.Provider>
  );
}

export function useTourist() {
  const context = useContext(TouristContext);
  if (!context) {
    throw new Error('useTourist must be used within a TouristProvider');
  }
  return context;
}