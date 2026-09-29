export type NavSection = 
  | 'product'
  | 'technology' 
  | 'system' 
  | 'safety' 
  | 'data' 
  | 'app'
  | 'simulator';

export type PageTab = 
  | NavSection
  | 'overview' 
  | 'architecture' 
  | 'safety-logic' 
  | 'cloud-app' 
  | 'calibration';

export type GasType = 'CO' | 'VOC' | 'LPG';

export type SafetyState = 'SAFE' | 'WARNING' | 'DANGER';

export interface HardwareComponentInfo {
  id: string;
  name: string;
  category: 'sensor' | 'controller' | 'gateway' | 'actuator' | 'storage';
  role: string;
  dataProduced: string;
  dataDestination: string;
  busType: string;
  specs: string;
}

export interface GasReading {
  ppm: number;
  state: SafetyState;
  thresholdWarn: number;
  thresholdDanger: number;
  unit: string;
  sensorModel: string;
  valid: boolean;
}

export interface EnvironmentalData {
  temperature: number; // Celsius
  humidity: number; // %
  tempAlarm: boolean;
}

export interface SystemTelemetry {
  sequenceId: number;
  timestamp: string;
  co: GasReading;
  voc: GasReading;
  lpg: GasReading;
  env: EnvironmentalData;
  overallState: SafetyState;
  buzzerActive: boolean;
  buzzerPattern: 'OFF' | 'INTERMITTENT' | 'CONTINUOUS_ALARM';
  sensorFaults: {
    coFault: boolean;
    vocFault: boolean;
    lpgFault: boolean;
    dhtFault: boolean;
  };
  commHealth: 'OPTIMAL' | 'DEGRADED' | 'DISCONNECTED';
  dataAgeMs: number;
  wifiConnected: boolean;
  sdLogging: boolean;
}

export interface BOMItem {
  component: string;
  subsystem: 'Sensors' | 'Processing' | 'Gateway & Display' | 'Power & Passive';
  partNumber: string;
  estimatedCostUsd: number;
  purpose: string;
}
