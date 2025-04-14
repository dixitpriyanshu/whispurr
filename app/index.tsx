import { View, Text, FlatList, RefreshControl, Button } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getNearbyWhispurrs } from "@/lib/getNearbyWhispurr";
import { router } from "expo-router";

dayjs.extend(relativeTime);

type Whispurr = {
  id: string;
  message: string;
  city: string;
  created_at: string;
  location: { coordinates: [number, number] };
  distance: number;
};

export default function FeedScreen() {
  const [whispurrs, setWhispurrs] = useState<Whispurr[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const location = await Location.getCurrentPositionAsync({});
    setCoords({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  };

  const fetch = async () => {
    console.log("Fetching nearby whispurrs...");
    if (!coords) {
      console.log("No coordinates available. cancel fetch.");
      return;
    }

    setRefreshing(true);

    const data = await getNearbyWhispurrs(coords.lat, coords.lng);

    setWhispurrs(data.sort((a, b) => a.distance - b.distance));
    setRefreshing(false);
  };

  useEffect(() => {
    (async () => {
      await getLocation();
    })();
  }, []);

  useEffect(() => {
    if (coords) fetch();
  }, [coords]);

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <Button
        title="Compose Whispurr"
        onPress={() => router.push("/compose")}
      />
      <FlatList
        data={whispurrs}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetch} />
        }
        renderItem={({ item }) => (
          <View className="mb-4 p-4 bg-gray-100 rounded-xl">
            <Text className="text-base font-medium">{item.message}</Text>
            <View className="flex-row justify-between mt-2">
              <Text className="text-xs text-gray-500">
                {item.city ?? "Unknown City"}
              </Text>
              <Text className="text-xs text-gray-500">
                {dayjs(item.created_at).fromNow()}
              </Text>
              <Text className="text-xs text-gray-500">
                {item.distance.toFixed(1)} km away
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
