import { useEffect, useState, useRef, useCallback } from "react";
import { Notification } from "@/app/types";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export function useNotifications() {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [readMessageIds, setReadMessageIds] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load dismissed notification IDs, read message IDs, and notifications from localStorage
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const storedIds = localStorage.getItem("dismissedNotifications");
        if (storedIds) {
          const dismissedArray = JSON.parse(storedIds);
          setDismissedIds(new Set(dismissedArray));
        }

        const storedReadIds = localStorage.getItem("readMessageIds");
        if (storedReadIds) {
          const readIdsArray = JSON.parse(storedReadIds);
          setReadMessageIds(new Set(readIdsArray));
        }

        // Load persisted notifications
        const storedNotifications = localStorage.getItem(
          "persistedNotifications"
        );
        if (storedNotifications) {
          const notificationsArray = JSON.parse(storedNotifications);

          // Filter out test notifications and welcome messages if not on preview path
          let filteredNotifications = notificationsArray;
          if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/preview"
          ) {
            filteredNotifications = notificationsArray.filter(
              (notification: Notification) => {
                const title = notification.title?.toLowerCase() || "";
                // const message = notification.message?.toLowerCase() || "";
                return (
                  title !== "test" && !title.includes("welcome!")
                  // !message.includes("welcome")
                );
              }
            );
          }

          // Note: Removed server validation to allow late-joining users to see notifications
          // that were sent before they joined. The server validation was preventing users
          // from seeing notifications that were no longer in the recent notifications list.

          setNotifications(filteredNotifications);
        }

        // Mark data as loaded
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error loading notification data:", error);
        // Still mark as loaded even if there's an error
        setIsDataLoaded(true);
      }
    };

    loadNotifications();
  }, []);

  // Save dismissed notification IDs to localStorage
  const saveDismissedIds = (ids: Set<string>) => {
    try {
      localStorage.setItem(
        "dismissedNotifications",
        JSON.stringify(Array.from(ids))
      );
    } catch (error) {
      console.error("Error saving dismissed notifications:", error);
    }
  };

  // Save read message IDs to localStorage
  const saveReadMessageIds = (ids: Set<string>) => {
    try {
      localStorage.setItem("readMessageIds", JSON.stringify(Array.from(ids)));
    } catch (error) {
      console.error("Error saving read message IDs:", error);
    }
  };

  // Save notifications to localStorage
  const saveNotifications = (notifications: Notification[]) => {
    try {
      localStorage.setItem(
        "persistedNotifications",
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error("Error saving notifications:", error);
    }
  };

  // Helper function to check if notification is expired
  const isNotificationExpired = (notification: Notification): boolean => {
    if (!notification.expiresAt) return false;
    return new Date(notification.expiresAt) < new Date();
  };

  // Helper function to check if notification is dismissed by ID
  const isNotificationDismissed = useCallback(
    (notification: Notification): boolean => {
      return dismissedIds.has(notification.id);
    },
    [dismissedIds]
  );

  // Helper function to check if notification message ID has been read
  const isNotificationRead = useCallback(
    (notification: Notification): boolean => {
      return readMessageIds.has(notification.id);
    },
    [readMessageIds]
  );

  // Helper function to create content key for deduplication
  const createContentKey = (title: string, message: string): string => {
    return `${title.trim().toLowerCase()}|${message.trim().toLowerCase()}`;
  };

  // Helper function to check if we're on the preview path
  const isPreviewPath = useCallback((): boolean => {
    return pathname === "/preview";
  }, [pathname]);

  // Helper function to filter valid notifications (not expired, not dismissed, not read, and not duplicate)
  const getValidNotifications = useCallback(
    (notifications: Notification[]): Notification[] => {
      // First filter out expired, dismissed, and read notifications
      let filteredNotifications = notifications.filter(
        (notification) =>
          !isNotificationExpired(notification) &&
          !isNotificationDismissed(notification) &&
          !isNotificationRead(notification)
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

      // First remove duplicates by ID, keeping the first occurrence
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
    [isNotificationDismissed, isNotificationRead, isPreviewPath]
  );

  // Helper function to add notification
  const addNotification = useCallback(
    (notification: Notification) => {
      setNotifications((prev) => {
        // First check if notification with same ID already exists
        const existingById = prev.find(
          (existingNotification) => existingNotification.id === notification.id
        );

        if (existingById) {
          console.log(
            "Notification with ID already exists, skipping duplicate:",
            notification.id
          );
          return prev;
        }

        // Check if this notification is a duplicate of any existing notification by content
        const isDuplicate = prev.some((existingNotification) => {
          const existingContentKey = createContentKey(
            existingNotification.title,
            existingNotification.message
          );
          const newContentKey = createContentKey(
            notification.title,
            notification.message
          );
          return existingContentKey === newContentKey;
        });

        // If it's a duplicate, don't add it
        if (isDuplicate) {
          console.log(
            "Notification with same content already exists, skipping duplicate"
          );
          return prev;
        }

        // Filter out preview notifications if not on preview path
        if (!isPreviewPath() && notification.isPreview) {
          return prev;
        }

        // Filter out notifications with title "test" if not on preview path
        if (!isPreviewPath() && notification.title?.toLowerCase() === "test") {
          return prev;
        }

        // Filter out welcome messages if not on preview path
        if (
          !isPreviewPath() &&
          (notification.title?.toLowerCase().includes("welcome") ||
            notification.message?.toLowerCase().includes("welcome"))
        ) {
          return prev;
        }

        // Otherwise, add the notification and filter valid ones
        const newNotifications = [...prev, notification];
        const validNotifications = getValidNotifications(newNotifications);

        // Save to localStorage
        saveNotifications(validNotifications);

        return validNotifications;
      });
    },
    [getValidNotifications, isPreviewPath]
  );

  // Helper function to dismiss notification (hide but keep unread)
  const dismissNotification = (notificationId: string) => {
    // Add to dismissed set
    setDismissedIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(notificationId);
      saveDismissedIds(newSet);
      return newSet;
    });

    // Remove from current notifications
    setNotifications((prev) => {
      const newNotifications = prev.filter((n) => n.id !== notificationId);
      saveNotifications(newNotifications);
      return newNotifications;
    });
  };

  // Helper function to delete/discard notification (mark as read and remove)
  const deleteNotification = async (notificationId: string) => {
    try {
      // Delete from server (both admin_notifications and recent_notifications)
      const [adminResponse, recentResponse] = await Promise.allSettled([
        fetch(`/api/notifications/admin?id=${notificationId}`, {
          method: "DELETE",
        }),
        fetch(`/api/notifications/recent?id=${notificationId}`, {
          method: "DELETE",
        }),
      ]);

      // Check if admin deletion was successful
      if (adminResponse.status === "fulfilled" && adminResponse.value.ok) {
        console.log(
          "Successfully deleted notification from admin_notifications"
        );
      } else {
        console.error("Failed to delete notification from admin_notifications");
      }

      // Check if recent deletion was successful
      if (recentResponse.status === "fulfilled" && recentResponse.value.ok) {
        console.log(
          "Successfully deleted notification from recent_notifications"
        );
      } else {
        console.error(
          "Failed to delete notification from recent_notifications"
        );
      }

      // Show success toast
      toast.success("Notification deleted successfully");
    } catch (error) {
      console.error("Error deleting notification from server:", error);
      toast.error("Failed to delete notification from server");
    }

    // Mark message ID as read
    setReadMessageIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(notificationId);
      saveReadMessageIds(newSet);
      return newSet;
    });

    // Add to dismissed set as well
    setDismissedIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(notificationId);
      saveDismissedIds(newSet);
      return newSet;
    });

    // Remove from current notifications
    setNotifications((prev) => {
      const newNotifications = prev.filter((n) => n.id !== notificationId);
      saveNotifications(newNotifications);
      return newNotifications;
    });
  };

  // Helper function to expand notifications
  const expandNotifications = () => {
    setIsExpanded(true);
  };

  // Helper function to collapse notifications
  const collapseNotifications = () => {
    setIsExpanded(false);
  };

  // Initialize audio reference (no longer needed for the old approach)
  useEffect(() => {
    audioRef.current = { play: () => {} } as HTMLAudioElement;
  }, []);

  // Enable audio context on user interaction
  useEffect(() => {
    let audioContext: AudioContext | null = null;

    const enableAudio = () => {
      // Just initialize the audio context, don't play sound
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

  // Fetch recent notifications when user first connects and data is loaded
  useEffect(() => {
    if (!isDataLoaded) return; // Wait for localStorage data to be loaded

    const fetchRecentNotifications = async () => {
      try {
        const response = await fetch("/api/notifications/recent");
        if (response.ok) {
          const data = await response.json();
          if (data.notifications && data.notifications.length > 0) {
            // Get current persisted notifications from state
            setNotifications((currentNotifications) => {
              // Merge with new notifications from server
              const allNotifications = [
                ...currentNotifications,
                ...data.notifications,
              ];

              // Filter out expired and dismissed notifications
              const validNotifications =
                getValidNotifications(allNotifications);

              // Save to localStorage
              saveNotifications(validNotifications);

              // Play sound for the most recent notification if there are notifications
              if (validNotifications.length > 0) {
                playNotificationSound();
              }

              return validNotifications;
            });
          }
        } else {
          console.error(
            "Failed to fetch recent notifications:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching recent notifications:", error);
      }
    };

    // Fetch recent notifications on first load
    fetchRecentNotifications();

    // Set up periodic cleanup to remove expired notifications
    const cleanupInterval = setInterval(() => {
      setNotifications((prevNotifications) => {
        const validNotifications = prevNotifications.filter(
          (notification) => !isNotificationExpired(notification)
        );

        // Only update if there are changes
        if (validNotifications.length !== prevNotifications.length) {
          saveNotifications(validNotifications);
          return validNotifications;
        }

        return prevNotifications;
      });
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(cleanupInterval);
    };
  }, [isDataLoaded, getValidNotifications, playNotificationSound]); // Removed notifications from dependencies to prevent infinite loop

  useEffect(() => {
    const ev = new EventSource("/api/notifications");

    ev.onopen = () => {
      console.log("SSE connection opened");
    };

    ev.onmessage = (e) => {
      console.log("SSE message received:", e.data);
      try {
        const data: Notification = JSON.parse(e.data);
        console.log("Parsed notification:", data);

        // Add notification with ID and timestamp if not present
        const notificationWithId = {
          ...data,
          id: data.id || Date.now().toString(),
          timestamp: data.timestamp || new Date().toISOString(),
        };

        addNotification(notificationWithId);

        // Play sound
        playNotificationSound();
      } catch (error) {
        console.error("Error parsing notification data:", error);
      }
    };

    ev.onerror = (error) => {
      console.error("SSE error:", error);
    };

    return () => {
      console.log("Closing SSE connection");
      ev.close();
    };
  }, [soundEnabled, addNotification, playNotificationSound]);

  return {
    notifications,
    isExpanded,
    expandNotifications,
    collapseNotifications,
    dismiss: (notificationId: string) => dismissNotification(notificationId),
    delete: (notificationId: string) => deleteNotification(notificationId),
    clear: (notificationId: string) => deleteNotification(notificationId), // Keep for backward compatibility
    clearAll: () => {
      // loop through notifications and delete each one
      notifications.forEach((notification) => {
        dismissNotification(notification.id);
      });
    },
    resetDismissed: () => {
      setDismissedIds(new Set());
      setReadMessageIds(new Set());
      saveDismissedIds(new Set());
      saveReadMessageIds(new Set());
      // Also clear notifications from localStorage
      localStorage.removeItem("persistedNotifications");
    },
    clearWelcomeNotifications: () => {
      // Clear welcome notifications from localStorage
      setNotifications((prev) => {
        const filtered = prev.filter(
          (notification) =>
            !notification.title?.toLowerCase().includes("welcome") &&
            !notification.message?.toLowerCase().includes("welcome")
        );
        saveNotifications(filtered);
        return filtered;
      });
    },
    soundEnabled,
    setSoundEnabled,
  };
}
