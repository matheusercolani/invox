export interface WaConnection {
  id: string;
  user_id: string;
  phone_number_id: string;
  display_phone_number: string | null;
  business_account_id: string | null;
  access_token_enc: string;
  status: string;
  connected_at: number;
}

export interface WaConversation {
  id: string;
  user_id: string;
  contact_wa_id: string;
  contact_name: string | null;
  contact_phone: string;
  last_message_text: string | null;
  last_message_at: number | null;
  unread_count: number;
  created_at: number;
}

export interface WaMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  direction: "inbound" | "outbound";
  type: string;
  body: string | null;
  status: string;
  wa_timestamp: number;
  created_at: number;
}
