export const isJwtExpired = (token) => {
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    const expiry = payload.exp;

    if (!expiry) return true;

    const now = Math.floor(Date.now() / 1000); // in seconds
    return now >= expiry;
  } catch (err) {
    // Invalid token format
    return null;
  }
};
