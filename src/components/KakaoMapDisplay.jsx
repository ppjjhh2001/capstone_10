import React, { useEffect } from 'react';

const useKakaoLoader = () => {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (!window.kakao) {
      console.error("Kakao SDK not found");
      return;
    }
    window.kakao.maps.load(() => {
      setLoading(false);
    });
  }, []);
  return [loading];
};

function KakaoMapDisplay({ lat, lng }) {
  const [loading] = useKakaoLoader();

  useEffect(() => {
    if (!loading && lat && lng) {
      const container = document.getElementById('map');
      if (!container) return;
      
      const position = new window.kakao.maps.LatLng(lat, lng);
      const options = {
        center: position,
        level: 5
      };
      const map = new window.kakao.maps.Map(container, options);

      const marker = new window.kakao.maps.Marker({
        position: position
      });
      marker.setMap(map);
    }
  }, [loading, lat, lng]);

  if (loading) {
    return <div>지도 로딩 중...</div>;
  }
  
  return (
    <div 
      id="map" 
      style={{ 
        width: '100%', 
        height: '400px', 
        borderRadius: '8px', 
        border: '1px solid #ddd' 
      }}
    ></div>
  );
}

export default KakaoMapDisplay;