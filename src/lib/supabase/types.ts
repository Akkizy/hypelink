export type Plan = "free" | "pro";

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  avatar_shape: string;
  avatar_size: string;
  banner_url: string | null;
  banner_size: string;
  banner_fade: boolean;
  theme: string;
  font: string;
  custom_bg_color: string;
  custom_card_color: string;
  custom_text_color: string;
  layout_style: string;
  plan: Plan;
  youtube_channel_id: string | null;
  youtube_channel_title: string | null;
  created_at: string;
  updated_at: string;
};

export type Link = {
  id: string;
  profile_id: string;
  category_id: string | null;
  title: string;
  url: string;
  position: number;
  is_active: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
};

export type LinkCategory = {
  id: string;
  profile_id: string;
  title: string;
  position: number;
  created_at: string;
  updated_at: string;
};

export type LinkClick = {
  id: number;
  link_id: string;
  profile_id: string;
  created_at: string;
  referrer: string | null;
  device_type: string | null;
  country: string | null;
};

export type SubscriptionStatus = "inactive" | "pending" | "authorized" | "cancelled";

export type Subscription = {
  id: string;
  profile_id: string;
  mp_subscription_id: string | null;
  status: SubscriptionStatus;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

export type PixBlockType = "donation" | "product";

export type PixBlock = {
  id: string;
  profile_id: string;
  type: PixBlockType;
  title: string;
  description: string | null;
  amount: number | null;
  is_active: boolean;
  position: number;
  created_at: string;
  updated_at: string;
};

export type PixTransactionStatus = "pending" | "approved" | "rejected" | "cancelled";

export type PixTransaction = {
  id: string;
  pix_block_id: string;
  profile_id: string;
  mp_payment_id: string | null;
  status: PixTransactionStatus;
  amount: number;
  payer_name: string | null;
  payer_email: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; username: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      links: {
        Row: Link;
        Insert: Partial<Link> & { profile_id: string; title: string; url: string };
        Update: Partial<Link>;
        Relationships: [];
      };
      link_categories: {
        Row: LinkCategory;
        Insert: Partial<LinkCategory> & { profile_id: string; title: string };
        Update: Partial<LinkCategory>;
        Relationships: [];
      };
      link_clicks: {
        Row: LinkClick;
        Insert: Partial<LinkClick> & { link_id: string; profile_id: string };
        Update: Partial<LinkClick>;
        Relationships: [];
      };
      subscriptions: {
        Row: Subscription;
        Insert: Partial<Subscription> & { profile_id: string };
        Update: Partial<Subscription>;
        Relationships: [];
      };
      pix_blocks: {
        Row: PixBlock;
        Insert: Partial<PixBlock> & { profile_id: string; type: PixBlockType; title: string };
        Update: Partial<PixBlock>;
        Relationships: [];
      };
      pix_transactions: {
        Row: PixTransaction;
        Insert: Partial<PixTransaction> & { pix_block_id: string; profile_id: string; amount: number };
        Update: Partial<PixTransaction>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
