import { useEffect, useState, useRef } from "react";
import { Notification } from "@/app/types";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [voiceGender, setVoiceGender] = useState<"male" | "female" | "auto">(
    "auto"
  );
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [readMessageIds, setReadMessageIds] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load dismissed notification IDs and read message IDs from localStorage
  useEffect(() => {
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

      // Mark data as loaded
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error loading notification data:", error);
      // Still mark as loaded even if there's an error
      setIsDataLoaded(true);
    }
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

  // Helper function to check if notification is expired
  const isNotificationExpired = (notification: Notification): boolean => {
    if (!notification.expiresAt) return false;
    return new Date(notification.expiresAt) < new Date();
  };

  // Helper function to check if notification is dismissed by ID
  const isNotificationDismissed = (notification: Notification): boolean => {
    return dismissedIds.has(notification.id);
  };

  // Helper function to check if notification message ID has been read
  const isNotificationRead = (notification: Notification): boolean => {
    return readMessageIds.has(notification.id);
  };

  // Helper function to create content key for deduplication
  const createContentKey = (title: string, message: string): string => {
    return `${title.trim().toLowerCase()}|${message.trim().toLowerCase()}`;
  };

  // Helper function to check if notification content is duplicate
  //   const isNotificationDuplicate = (
  //     notification: Notification,
  //     allNotifications: Notification[]
  //   ): boolean => {
  //     const currentContentKey = createContentKey(
  //       notification.title,
  //       notification.message
  //     );

  //     // Check if any other notification has the same content
  //     return allNotifications.some((otherNotification) => {
  //       if (otherNotification.id === notification.id) return false; // Don't compare with itself
  //       const otherContentKey = createContentKey(
  //         otherNotification.title,
  //         otherNotification.message
  //       );
  //       return currentContentKey === otherContentKey;
  //     });
  //   };

  // Helper function to check if we're on the preview path
  const isPreviewPath = (): boolean => {
    if (typeof window === "undefined") return false;
    return window.location.pathname === "/preview";
  };

  // Helper function to filter valid notifications (not expired, not dismissed, not read, and not duplicate)
  const getValidNotifications = (
    notifications: Notification[]
  ): Notification[] => {
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
    }

    // Then remove duplicates, keeping only the first occurrence of each unique content
    const uniqueNotifications: Notification[] = [];
    const seenContentKeys = new Set<string>();

    for (const notification of filteredNotifications) {
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
  };

  // Helper function to add notification
  const addNotification = (notification: Notification) => {
    setNotifications((prev) => {
      // Check if this notification is a duplicate of any existing notification
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
        return prev;
      }

      // Filter out preview notifications if not on preview path
      if (!isPreviewPath() && notification.isPreview) {
        return prev;
      }

      // Otherwise, add the notification and filter valid ones
      const newNotifications = [...prev, notification];
      return getValidNotifications(newNotifications);
    });
  };

  // Helper function to remove notification
  const removeNotification = (notificationId: string) => {
    // Add to dismissed set
    setDismissedIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(notificationId);
      saveDismissedIds(newSet);
      return newSet;
    });

    // Mark message ID as read
    setReadMessageIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(notificationId);
      saveReadMessageIds(newSet);
      return newSet;
    });

    // Remove from current notifications
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
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
            (window as any).webkitAudioContext)();
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
  const playNotificationSound = () => {
    if (soundEnabled && audioRef.current) {
      try {
        // Create a new audio context for each notification
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
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
  };

  // Speak notification text
  const speakNotification = (text: string) => {
    if (ttsEnabled && "speechSynthesis" in window) {
      // Cancel any ongoing speech
      if (speechSynthesisRef.current) {
        speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      // Get available voices
      const voices = speechSynthesis.getVoices();

      let selectedVoice = null;

      if (voiceGender === "male") {
        // Look for male voices
        selectedVoice = voices.find(
          (voice) =>
            voice.lang.startsWith("en") &&
            (voice.name.toLowerCase().includes("male") ||
              voice.name.toLowerCase().includes("man") ||
              voice.name.toLowerCase().includes("david") ||
              voice.name.toLowerCase().includes("daniel") ||
              voice.name.toLowerCase().includes("alex") ||
              voice.name.toLowerCase().includes("google male") ||
              voice.name.toLowerCase().includes("microsoft male"))
        );
      } else if (voiceGender === "female") {
        // Look for female voices first
        selectedVoice = voices.find(
          (voice) =>
            voice.lang.startsWith("en") &&
            (voice.name.toLowerCase().includes("female") ||
              voice.name.toLowerCase().includes("woman") ||
              voice.name.toLowerCase().includes("samantha") ||
              voice.name.toLowerCase().includes("susan") ||
              voice.name.toLowerCase().includes("karen") ||
              voice.name.toLowerCase().includes("google female") ||
              voice.name.toLowerCase().includes("microsoft female") ||
              voice.name.toLowerCase().includes("zira"))
        );

        // If no female voice found, fall back to auto mode
        if (!selectedVoice) {
          selectedVoice = voices.find(
            (voice) =>
              voice.lang.startsWith("en") &&
              (voice.name.includes("Google") ||
                voice.name.includes("Microsoft") ||
                voice.name.includes("Alex") ||
                voice.name.includes("Samantha"))
          );
        }
      } else {
        // Auto mode - try to find the best available voice
        selectedVoice = voices.find(
          (voice) =>
            voice.lang.startsWith("en") &&
            (voice.name.includes("Google") ||
              voice.name.includes("Microsoft") ||
              voice.name.includes("Alex") ||
              voice.name.includes("Samantha"))
        );
      }

      // Final fallback to any English voice if specific gender not found
      if (!selectedVoice) {
        selectedVoice = voices.find((voice) => voice.lang.startsWith("en"));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      speechSynthesisRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  // Fetch recent notifications when user first connects and data is loaded
  useEffect(() => {
    if (!isDataLoaded) return; // Wait for localStorage data to be loaded

    const fetchRecentNotifications = async () => {
      try {
        const response = await fetch("/api/notifications/recent");
        if (response.ok) {
          const data = await response.json();
          if (data.notifications && data.notifications.length > 0) {
            // Filter out expired and dismissed notifications
            const validNotifications = getValidNotifications(
              data.notifications
            );
            setNotifications(validNotifications);

            // Play sound and speak notification for the most recent notification
            if (validNotifications.length > 0) {
              const latestNotification = validNotifications[0];
              playNotificationSound();
              speakNotification(latestNotification.title);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching recent notifications:", error);
      }
    };

    // Fetch recent notifications on first load
    fetchRecentNotifications();
  }, [isDataLoaded]); // Only depend on isDataLoaded

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

        // Play sound and speak notification
        playNotificationSound();
        speakNotification(data.title);
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
      // Cancel any ongoing speech when component unmounts
      if (speechSynthesisRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [soundEnabled, ttsEnabled]);

  return {
    notifications,
    isExpanded,
    expandNotifications,
    collapseNotifications,
    clear: (notificationId: string) => removeNotification(notificationId),
    clearAll: () => {
      setNotifications([]);
      // Also clear all dismissed IDs and read message IDs
      setDismissedIds(new Set());
      setReadMessageIds(new Set());
      saveDismissedIds(new Set());
      saveReadMessageIds(new Set());
    },
    resetDismissed: () => {
      setDismissedIds(new Set());
      setReadMessageIds(new Set());
      saveDismissedIds(new Set());
      saveReadMessageIds(new Set());
    },
    soundEnabled,
    setSoundEnabled,
    ttsEnabled,
    setTtsEnabled,
    voiceGender,
    setVoiceGender,
  };
}
