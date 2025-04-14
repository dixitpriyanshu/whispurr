// store/user.ts
import { create } from "zustand";
import { MMKV } from "react-native-mmkv";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const storage = new MMKV();
const DEVICE_ID_KEY = "device_id";

type UserStore = {
  deviceId: string;
};

export const useUserStore = create<UserStore>(() => {
  let id = storage.getString(DEVICE_ID_KEY);

  if (!id) {
    id = uuidv4();
    storage.set(DEVICE_ID_KEY, id);
  }

  return {
    deviceId: id,
  };
});
