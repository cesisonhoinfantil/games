import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";
import { useSettingsStore } from "@/store/useSettingsStore";

export function useAvatar() {
  const profileSeed = useSettingsStore((state) => state.profileSeed);

  const avatarSrc = useMemo(() => {
    const avatar = createAvatar(funEmoji, {
      seed: profileSeed,
      backgroundColor: [
        "b6e3f4",
        "c0aede",
        "d1d4f9",
        "ffd5dc",
        "ffdfbf",
        "f4d160",
        "98ddca",
        "ffb6b9",
      ],
      backgroundType: ["solid"],
    });
    return avatar.toDataUri();
  }, [profileSeed]);

  return avatarSrc;
}
