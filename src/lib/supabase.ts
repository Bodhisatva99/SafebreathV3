import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = "https://fleiawoctghecndjesdn.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_9ZA0tXff6puyy-HarkhEVA_Hl_osXjO";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export interface SensorLogRow {
  id: number;
  created_at: string;
  co_ppm: number;
  voc_ppm: number;
  lpg_ppm: number;
  temp: number;
  hum: number;
  alert_flag: boolean;
  system_alarm: boolean;
  system_fault: boolean;
  system_degraded: boolean;
  thermal_latched: boolean;
  co_valid: boolean;
  voc_valid: boolean;
  lpg_valid: boolean;
  dht_valid: boolean;
  state_co: number; // 0 = SAFE, 1 = WARNING, 2 = DANGER
  state_voc: number;
  state_lpg: number;
  trend_co?: number;
  trend_voc?: number;
  trend_lpg?: number;
  session_id: number;
  nano_session_id?: number;
  uptime_ms: number;
  seq_id: number;
  dev_seq_id?: number;
  data_age_ms: number;
  nano_online: boolean;
  ze07_online: boolean;
  reset_reason?: number;
  ev_loss?: boolean;
  dropped_events?: number;
}

export const APP_DOWNLOAD_URL = "https://github.com/Bodhisatva99/SafebreathV3/releases/latest/download/SafeBreathV3.apk";
