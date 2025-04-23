export function calculateDistance(
    lat1?: string | null,
    lon1?: string | null,
    lat2?: string | null,
    lon2?: string | null
  ): number {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(parseFloat(lat2) - parseFloat(lat1));
    const dLon = deg2rad(parseFloat(lon2) - parseFloat(lon1));
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(parseFloat(lat1))) *
        Math.cos(deg2rad(parseFloat(lat2))) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return Math.round(distance * 10) / 10;
  }
  
  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }