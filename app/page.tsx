"use client";
import { LandingPageContent } from "@/components/landing-page-content";
import { useSectionVisibility } from "@/lib/visibility-provider";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getConferenceSchedule, getDraft } from "./actions/timeline";

export default function Home() {
  const query = useSearchParams();
  const preview = query.get("preview") === "true";

  const { data: liveData, isLoading: isLiveLoading } = useQuery({
    queryKey: ["conference-schedules"],
    queryFn: async () => await getConferenceSchedule(),
    refetchInterval: 120000,
  });

  const { data: draftData } = useQuery({
    queryKey: ["conference-schedules", "draft"],
    queryFn: getDraft,
    enabled: preview,
    staleTime: 1000 * 60,
  });

  const data = preview ? (draftData ?? liveData) : liveData;
  const isLoading =
    preview
      ? draftData === undefined || (draftData === null && isLiveLoading)
      : isLiveLoading;

  useEffect(() => {
    if (query.get("q") === "programme") {
      const program = document.getElementById("programme");
      setTimeout(() => {
        program?.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 620);
    }
  }, [query]);

  const vc = {
    quickLinks: useSectionVisibility("quickLinks"),
    countdown: useSectionVisibility("countdown"),
    programme: useSectionVisibility("programme"),
    speakers: useSectionVisibility("speakers"),
    accommodation: useSectionVisibility("accommodation"),
    flights: useSectionVisibility("flights"),
    postFlights: useSectionVisibility("postFlights"),
    travelRequirements: useSectionVisibility("travelRequirements"),
    weatherAndPack: useSectionVisibility("weatherAndPack"),
    completeRegistration: useSectionVisibility("completeRegistration"),
  } as const;

  return (
    <LandingPageContent
      data={data ?? undefined}
      visibilityConfig={vc}
      isLoading={isLoading}
    />
  );
}
