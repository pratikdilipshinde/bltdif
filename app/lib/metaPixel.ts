export const metaPixelEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean | string[] | number[]>
) => {
  if (typeof window === "undefined") return;

  if (window.fbq) {
    window.fbq("track", eventName, params || {});
  }
};