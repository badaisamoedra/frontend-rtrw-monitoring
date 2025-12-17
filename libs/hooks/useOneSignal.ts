"use client";

import { useEffect, useRef, useState } from "react";
import OneSignal from "react-onesignal";

const useInitialOneSignal = () => {
  const hasInit = useRef(false);
  const [initialized, setInitialized] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if (hasInit.current) return;
    if (typeof window === "undefined") return;

    hasInit.current = true;

    const init = async () => {
      try {
        await OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONE_SIGNAL_APP_ID!,
          allowLocalhostAsSecureOrigin: process.env.NODE_ENV === "development",
        });

        setInitialized(true);

        setPermission(Notification.permission);

        if (process.env.NODE_ENV === "development") {
          console.log("✅ OneSignal initialized");
        }
      } catch (err) {
        console.error("❌ OneSignal init failed", err);
      }
    };

    init();
  }, []);

  const requestPermission = async () => {
    if (!initialized) return;

    if (Notification.permission === "default") {
      await OneSignal.Slidedown.promptPush();
      setPermission(Notification.permission);
    }
  };

  const getPushSubscriptionId = () => {
    if (!initialized) return null;
    return OneSignal.User.PushSubscription.id ?? null;
  };

  return {
    initialized,
    permission,
    requestPermission,
    getPushSubscriptionId,
  };
};

export default useInitialOneSignal;
