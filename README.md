# SafeBreath V3 (Hardware Revision 2.8f)

Edge-first multi-gas hazard detection, offline local acoustic alerting, MicroSD evidence logging, and real-time Supabase cloud observability.

## Architecture Summary

- **Node 1 — Arduino Nano (Acquisition Subsystem)**: Samples MQ-135 broad-response VOC indicator (`A0`), MQ-6 LPG (`A1`), and DHT11 ambient temperature/humidity (`D2`) at 100 Hz oversampled ADC. Sends the **Nano Acquisition Frame** over 5V TTL UART (`D1 -> 1kΩ/2kΩ voltage divider -> ESP32 GPIO 23`).
- **Node 2 — ESP32 DevKit V1 (Safety Master & Fusion Controller)**: Reads factory-calibrated **Winsen ZE07-CO** over Hardware UART2 (`GPIO 16 RX / GPIO 17 TX`), receives the Nano frame (`GPIO 23 / 22`), runs offline Schmitt-trigger hysteresis (`< 10 ms` MCU decision design target), updates the SSD1306 I2C OLED (`GPIO 4 SDA / GPIO 15 SCL`), and switches the 5V TMB12A05 piezo buzzer (`85 dB @ 10 cm` datasheet) via low-side NPN/MOSFET driver (`GPIO 13`). Experimental SCT-013-030 CT ports (internal sampling resistor + `1.65V` bias) are mapped to `GPIO 33 / GPIO 32`.
- **Node 3 — ESP32-CAM Gateway (Camera Disabled in Rev 2.8f)**: Receives the **Unified 16-Byte Master-to-Gateway Frame**, archives circular CSV logs via 4-bit `SD_MMC`, and streams telemetry records to Supabase `public.sensor_logs`.

## Safety Classification & Fail-Safe Design

- **Positive Verification**: A telemetry row only classifies as `NORMAL` when all mandatory sensor readings are finite, `co_valid`, `voc_valid`, `lpg_valid`, `dht_valid`, `nano_online`, and `ze07_online` are explicitly `true`, and both device and cloud timestamps are valid and within freshness bounds (`<= 15 s` device age, `<= 60 s` cloud age). Missing metadata evaluates as `UNKNOWN`; explicit invalid flags evaluate as `SENSOR FAULT`.
- **Stale Danger Preservation**: If the last recorded telemetry was `DANGER` and the heartbeat goes stale, status latches `LAST KNOWN: DANGER — DATA STALE` and never auto-resets to safe.

## Local Development

```bash
npm install
npm test      # Runs unit tests for safety classification, hysteresis, and CRC-16-CCITT
npm run lint  # TypeScript check
npm run dev   # Starts Vite dev server on port 3000
npm run build # Production build
```

Configure optional custom Supabase credentials in `.env` (see `.env.example`).
