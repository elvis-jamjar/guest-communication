import { useEffect, useState, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/app/types";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

// Fetch notifications from API
const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await fetch("/api/notifications/recent");
  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.status}`);
  }
  const data = await response.json();
  return data.notifications || [];
};

export function useNotificationsPolling() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);

  // Initialize data loaded state
  useEffect(() => {
    setIsDataLoaded(true);
  }, []);

  // React Query to fetch notifications with polling
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 10000, // Poll every 10 seconds
    refetchIntervalInBackground: true,
    staleTime: 0, // Always consider data stale to ensure fresh polling
    enabled: isDataLoaded, // Only start polling after localStorage data is loaded
  });

  // Helper function to check if notification is expired
  const isNotificationExpired = (notification: Notification): boolean => {
    if (!notification.expiresAt) return false;
    return new Date(notification.expiresAt) < new Date();
  };

  // Helper function to create content key for deduplication
  const createContentKey = (title: string, message: string): string => {
    return `${title.trim().toLowerCase()}|${message.trim().toLowerCase()}`;
  };

  // Helper function to check if we're on the preview path
  const isPreviewPath = useCallback((): boolean => {
    return pathname === "/preview";
  }, [pathname]);

  // Helper function to filter valid notifications
  const getValidNotifications = useCallback(
    (notifications: Notification[]): Notification[] => {
      // Filter out expired notifications and only show notifications where isShowing is true
      let filteredNotifications = notifications.filter(
        (notification) =>
          !isNotificationExpired(notification) &&
          notification.isShowing === true
      );

      // Filter out preview notifications if not on preview path
      if (!isPreviewPath()) {
        filteredNotifications = filteredNotifications.filter(
          (notification) => !notification.isPreview
        );

        // Filter out notifications with title "test" if not on preview path
        filteredNotifications = filteredNotifications.filter(
          (notification) => notification.title?.toLowerCase() !== "test"
        );

        // Filter out welcome messages if not on preview path
        filteredNotifications = filteredNotifications.filter(
          (notification) =>
            !notification.title?.toLowerCase().includes("welcome") &&
            !notification.message?.toLowerCase().includes("welcome!")
        );
      }

      // Remove duplicates by ID, keeping the first occurrence
      const idSeen = new Set<string>();
      const uniqueByIdNotifications = filteredNotifications.filter(
        (notification) => {
          if (idSeen.has(notification.id)) {
            return false;
          }
          idSeen.add(notification.id);
          return true;
        }
      );

      // Then remove duplicates by content, keeping only the first occurrence of each unique content
      const uniqueNotifications: Notification[] = [];
      const seenContentKeys = new Set<string>();

      for (const notification of uniqueByIdNotifications) {
        const contentKey = createContentKey(
          notification.title,
          notification.message
        );
        if (!seenContentKeys.has(contentKey)) {
          seenContentKeys.add(contentKey);
          uniqueNotifications.push(notification);
        }
      }

      return uniqueNotifications;
    },
    [isPreviewPath]
  );

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      try {
        // Create a new audio context for each notification
        const audioContext = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Set frequency pattern for notification sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(
          600,
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.setValueAtTime(
          1000,
          audioContext.currentTime + 0.2
        );

        // Set volume envelope
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3
        );

        // Start and stop oscillator
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        console.log("Could not play notification sound:", error);
      }
    }
  }, [soundEnabled]);

  // Initialize audio reference
  useEffect(() => {
    audioRef.current = { play: () => {} } as HTMLAudioElement;
  }, []);

  // Enable audio context on user interaction
  useEffect(() => {
    let audioContext: AudioContext | null = null;

    const enableAudio = () => {
      if (!audioContext) {
        try {
          audioContext = new (window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext)();
          console.log("Audio context enabled for notifications");
        } catch (error) {
          console.log("Could not initialize audio context:", error);
        }
      }
    };

    // Add event listeners for user interaction
    document.addEventListener("click", enableAudio, { once: true });
    document.addEventListener("keydown", enableAudio, { once: true });
    document.addEventListener("touchstart", enableAudio, { once: true });

    return () => {
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("keydown", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
    };
  }, []);

  // Detect new notifications and play sound
  useEffect(() => {
    if (!isDataLoaded || isLoading) return;

    const validNotifications = getValidNotifications(notifications);
    const currentCount = validNotifications.length;

    console.log(
      `Current notification count: ${currentCount}, Last count: ${lastNotificationCount}`
    );

    // If we have more notifications than before, play sound
    if (currentCount > lastNotificationCount && lastNotificationCount > 0) {
      console.log("New notification detected, playing sound");
      playNotificationSound();
    }

    setLastNotificationCount(currentCount);
  }, [
    notifications,
    isDataLoaded,
    isLoading,
    getValidNotifications,
    lastNotificationCount,
    playNotificationSound,
  ]);

  // Helper function to dismiss notification
  const dismissNotification = (_notificationId: string) => {
    // Simply invalidate query to refetch notifications
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  // Helper function to delete/discard notification
  const deleteNotification = async (notificationId: string) => {
    try {
      // Delete from server
      const response = await fetch(
        `/api/notifications/recent?id=${notificationId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete notification: ${response.status}`);
      }

      // Invalidate query to refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      toast.success("Notification deleted successfully");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  // Helper function to expand notifications
  const expandNotifications = () => {
    setIsExpanded(true);
  };

  // Helper function to collapse notifications
  const collapseNotifications = () => {
    setIsExpanded(false);
  };

  // Get filtered notifications
  const validNotifications = getValidNotifications(notifications);

  return {
    notifications: validNotifications,
    isLoading,
    error,
    isExpanded,
    expandNotifications,
    collapseNotifications,
    dismiss: (notificationId: string) => dismissNotification(notificationId),
    delete: (notificationId: string) => deleteNotification(notificationId),
    clear: (notificationId: string) => deleteNotification(notificationId), // Keep for backward compatibility
    clearAll: () => {
      // Loop through notifications and dismiss each one
      validNotifications.forEach((notification) => {
        dismissNotification(notification.id);
      });
    },
    resetDismissed: () => {
      // Simply refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    clearWelcomeNotifications: () => {
      // Clear welcome notifications by dismissing them
      validNotifications.forEach((notification) => {
        if (
          notification.title?.toLowerCase().includes("welcome") ||
          notification.message?.toLowerCase().includes("welcome")
        ) {
          dismissNotification(notification.id);
        }
      });
    },
    soundEnabled,
    setSoundEnabled,
    refetch, // Expose refetch for manual refresh
  };
}
