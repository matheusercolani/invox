export interface DBUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  plan: "free" | "pro" | "business";
  created_at: number;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro" | "business";
  created_at: number;
}

export interface JWTPayload {
  sub: string;     // user id
  name: string;
  email: string;
  plan: string;
  iat: number;
  exp: number;
}
