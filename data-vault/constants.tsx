
import { AppRule, ManualStep, SpeedTier } from './types';

export const APP_RULES: AppRule[] = [
  {
    title: "1. Simulated Environment",
    content: "Data Vault is a simulation tool. It does not physically store data on remote servers or within the app's internal memory beyond basic tracking metrics."
  },
  {
    title: "2. Data Deduction",
    content: "By confirming a storage operation, you acknowledge that the app will record a deduction from your theoretical mobile balance to be 'reserved' for future simulated use."
  },
  {
    title: "3. Speed Limitations",
    content: "The selectable speed tiers (80, 100, 120 Mbps) are simulated. Actual network speeds depend entirely on your hardware and carrier conditions."
  },
  {
    title: "4. Battery & Resources",
    content: "Active simulation sessions may consume more battery due to continuous calculations and UI updates."
  },
  {
    title: "5. Privacy",
    content: "No personal data or browsing history is transmitted. Data usage metrics are strictly used for your local simulation display."
  }
];

export const MANUAL_STEPS: ManualStep[] = [
  {
    title: "Store Data",
    description: "Navigate to the Store tab. Enter the amount of 4G or 5G data you wish to set aside. Select MB or GB units and confirm the prompt."
  },
  {
    title: "Select Profile",
    description: "Go to the Use tab. Choose your network type (4G/5G) and select a simulated speed tier (80Mbps, 100Mbps, or 120Mbps)."
  },
  {
    title: "Activate Session",
    description: "Click 'Activate Vault' to start consuming your stored data. The app will calculate consumption based on the chosen speed tier in real-time."
  },
  {
    title: "Stop & Save",
    description: "You can stop the session at any time. Your remaining balance is saved automatically to the local database."
  }
];

export const SPEED_TIERS: SpeedTier[] = [80, 100, 120];

export const STORAGE_KEYS = {
  PROFILES: 'data_vault_profiles_v2',
  ACTIVE_PROFILE_ID: 'data_vault_active_profile_id',
  CONSENT: 'data_vault_consent_given'
};
