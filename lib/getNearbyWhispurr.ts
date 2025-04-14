import { getDistanceFromLatLonInKm } from "@/utils/getDistanceFromLatLon";
import { supabase } from "./supabase";

export const getNearbyWhispurrs = async (
  latitude: number,
  longitude: number
) => {
  const { data, error } = await supabase
    .from("whispurrs")
    .select("*")
    .filter("is_flagged", "eq", false)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching whispurrs:", error);
    return [];
  }

  const whispurrsWithDistance = data.map((item) => {
    const [lng, lat] = item.location;
    const distance = getDistanceFromLatLonInKm(latitude, longitude, lat, lng);
    return { ...item, distance };
  });

  const sortedWhispurrs = whispurrsWithDistance.sort(
    (a, b) => a.distance - b.distance
  );

  return sortedWhispurrs;
};
