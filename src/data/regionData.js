export const regionData = {
  'gangwon': { name: '강원특별자치도', cities: ['영월군', '정선군', '화천군'] },
  'jeonnam': { name: '전남', cities: ['고흥군', '보성군', '진도군'] },
  'gyeongbuk': { name: '경북', cities: ['영덕군', '청송군', '영양군'] },
  'jeonbuk': { name: '전북', cities: ['임실군', '장수군', '무주군', '순창군'] },
  'gyeongnam': { name: '경남', cities: ['의령군'] },
  'chungbuk': { name: '충북', cities: ['단양군'] },
};

export const findRegionKeyByName = (sidoName) => {
  return Object.keys(regionData).find(key => regionData[key].name === sidoName);
};

export const findCityKeyByName = (regionKey, sigunguName) => {
  if (!regionKey || !regionData[regionKey]) return null;
  const baseCity = sigunguName.split(' ')[0]; 
  const foundCity = regionData[regionKey].cities.find(city => city === baseCity);
  return foundCity ? baseCity : null;
};