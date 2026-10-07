const MOBILE_UA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

export const useIsMobile = () => {
  const userAgent = import.meta.server
    ? (useRequestHeaders(["user-agent"])["user-agent"] ?? "")
    : navigator.userAgent;

  return MOBILE_UA.test(userAgent);
};
