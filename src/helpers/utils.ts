import { v4 as uuidv4 } from "uuid";

export const cdnURL = "https://dev-carenest.s3.ap-south-1.amazonaws.com";

export const getTokenPayload = (userId: string) => {
  return { user: { id: userId } };
};

export const generateUniqueId = () => {
  const uuid = uuidv4();
  return uuid;
};

export const getURLPath = (url: string) => {
  if (url.startsWith("/")) {
    return url;
  }

  if (!url.includes("://")) {
    return `/${url}`;
  }

  // If it's a full URL, extract the pathname
  try {
    const urlObject = new URL(url);
    const path = urlObject.pathname;
    return path.startsWith("/") ? path : `/${path}`;
  } catch (error) {
    // Fallback: treat as relative path
    return url.startsWith("/") ? url : `/${url}`;
  }
};
