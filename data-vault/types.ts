
export type NetworkType = '4G' | '5G';
export type DataUnit = 'MB' | 'GB';
export type SpeedTier = 80 | 100 | 120;

export interface DataBalances {
  fourG: number; // in MB
  fiveG: number; // in MB
}

export interface UserProfile {
  id: string;
  name: string;
  balances: DataBalances;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface AppRule {
  title: string;
  content: string;
}

export interface ManualStep {
  title: string;
  description: string;
}
