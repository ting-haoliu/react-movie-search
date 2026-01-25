const CACHE_KEY = 'user_region';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function getUserLocation() {
   const cachedData = localStorage.getItem(CACHE_KEY);
   if (cachedData) {
      const { timestamp, region } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
         return region;
      }
   }

   try {
      const response = await fetch('https://ipapi.co/country_code/');
      if (!response.ok) {
         throw new Error('Failed to fetch location data');
      }

      const region = await response.text();

      // store in cache
      localStorage.setItem(
         CACHE_KEY,
         JSON.stringify({
            region,
            timestamp: Date.now(),
         })
      );
   } catch (error) {
      console.error('Error fetching user location:', error);

      return 'TW';
   }
}
