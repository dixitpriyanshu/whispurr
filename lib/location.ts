// lib/location.ts
import * as Location from "expo-location";

export const getUserLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Location permission not granted");
  }

  const loc = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = loc.coords;

  const geocode = await Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });

  const city = geocode?.[0]?.city || "Unknown";

  return {
    coordinates: `POINT(${longitude} ${latitude})`,
    city,
  };
};
