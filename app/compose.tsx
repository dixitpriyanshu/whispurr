import {
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { getUserLocation } from "@/lib/location";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/user";
import { router } from "expo-router";

export default function ComposeWhispurr() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { deviceId } = useUserStore();

  const handleSubmit = async () => {
    setLoading(true);
    if (!message.trim()) {
      Alert.alert("Message cannot be empty.");
      return;
    }
    try {
      const { coordinates, city } = await getUserLocation();

      console.log("Location:", coordinates);
      console.log("City:", city);

      const { error } = await supabase.from("whispurrs").insert({
        message,
        location: coordinates,
        city,
        device_id: deviceId,
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Could not get your location.");
    }
    setLoading(false);
    router.back();
  };

  return (
    <View className="flex-1 p-4 justify-center">
      <TextInput
        placeholder="Whispurr something positive..."
        multiline
        className="border rounded-xl p-4 text-base h-40"
        value={message}
        onChangeText={setMessage}
      />
      {!loading ? (
        <Button title="Post Whispurr" onPress={handleSubmit} />
      ) : (
        <ActivityIndicator className="mt-4" size="large" color="#0000ff" />
      )}
    </View>
  );
}
