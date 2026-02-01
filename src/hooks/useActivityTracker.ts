import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface TrackActivityParams {
  sectionName: string;
  sectionType: "lesson" | "practice" | "quiz" | "record" | "voice-generator" | "profile";
  languageId?: string;
  lessonId?: string;
}

export function useActivityTracker() {
  const { user } = useAuth();
  const startTimeRef = useRef<number | null>(null);
  const currentActivityRef = useRef<TrackActivityParams | null>(null);
  const activityIdRef = useRef<string | null>(null);

  // Track when user enters a section
  const trackActivity = useCallback(
    async ({ sectionName, sectionType, languageId, lessonId }: TrackActivityParams) => {
      if (!user) return;

      // Save the start time for time tracking
      startTimeRef.current = Date.now();
      currentActivityRef.current = { sectionName, sectionType, languageId, lessonId };

      try {
        const { data, error } = await supabase
          .from("user_activity_logs")
          .insert({
            user_id: user.id,
            section_name: sectionName,
            section_type: sectionType,
            language_id: languageId || null,
            lesson_id: lessonId || null,
            time_spent_seconds: 0,
          })
          .select("id")
          .single();

        if (error) {
          console.error("Error tracking activity:", error);
          return;
        }

        activityIdRef.current = data.id;
      } catch (err) {
        console.error("Error tracking activity:", err);
      }
    },
    [user]
  );

  // Update time spent when leaving a section
  const endActivity = useCallback(async () => {
    if (!activityIdRef.current || !startTimeRef.current || !user) return;

    const timeSpentSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      await supabase
        .from("user_activity_logs")
        .update({ time_spent_seconds: timeSpentSeconds })
        .eq("id", activityIdRef.current);
    } catch (err) {
      console.error("Error updating activity time:", err);
    }

    // Reset refs
    startTimeRef.current = null;
    currentActivityRef.current = null;
    activityIdRef.current = null;
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (activityIdRef.current) {
        endActivity();
      }
    };
  }, [endActivity]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && activityIdRef.current) {
        endActivity();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [endActivity]);

  return { trackActivity, endActivity };
}
