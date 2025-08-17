import jwt from "jsonwebtoken";

export function signToken(payload, secret, expiresIn) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function sendAuthCookie(res, token) {
  // HTTP-only cookie to mitigate XSS
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true in production with HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export function clearAuthCookie(res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });
}
