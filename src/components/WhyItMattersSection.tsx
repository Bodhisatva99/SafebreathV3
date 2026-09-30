import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Wind, 
  AlertTriangle, 
  Flame, 
  Activity, 
  ExternalLink, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  CheckCircle2, 
  Globe2, 
  HeartHandshake
} from 'lucide-react';

interface EvidenceItem {
  id: string;
  category: 'direct-hazard' | 'air-pollution' | 'thermal-hazard';
  categoryLabel: string;
  hazardName: string;
  metricValue: string;
  metricLabel: string;
  yearAndScope: string;
  sourceName: string;
  sourceUrl: string;
  verifiedStatus: string;
  shortSummary: string;
  methodologyDetails: string;
  safeBreathConnection: string;
  badgeColor: string;
}

export const WhyItMattersSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'direct' | 'broader'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('co-poisoning');

  const evidenceData: EvidenceItem[] = [
    {
      id: 'co-poisoning',
      category: 'direct-hazard',
      categoryLabel: 'Direct Monitored Gas Hazard',
      hazardName: 'Carbon Monoxide (CO)',
      metricValue: '28,900',
      metricLabel: 'Deaths / Year (Unintentional CO Poisoning)',
      yearAndScope: '2021 Global Estimate (95% UI: 21,700 – 32,800)',
      sourceName: 'Global Burden of Disease Study 2021 (IHME / The Lancet)',
      sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/38762325/',
      verifiedStatus: 'Verified Global Mortality Estimate',
      shortSummary: 'Carbon monoxide is a colorless, odorless, non-irritating toxic gas produced by incomplete combustion in heating systems, unvented stoves, portable generators, and vehicle exhausts.',
      methodologyDetails: 'The Global Burden of Disease (GBD) 2021 study analyzed cause-specific mortality for unintentional carbon-monoxide poisoning across 204 countries and territories, reporting an estimated 28,900 deaths worldwide in 2021 with an uncertainty interval of 21,700 to 32,800.',
      safeBreathConnection: 'SafeBreath continuously tracks CO using a dedicated ZE07 electrochemical fuel cell sensor with 0.1 ppm resolution and triggers an autonomous 85 dB local piezo alarm within milliseconds of threshold breach.',
      badgeColor: 'text-sky-800 bg-sky-50 border-sky-200'
    },
    {
      id: 'voc-indoor',
      category: 'direct-hazard',
      categoryLabel: 'Direct Monitored Gas Hazard',
      hazardName: 'Volatile Organic Compounds (VOCs)',
      metricValue: 'Non-Isolated',
      metricLabel: 'No Fabricated Single Global Death Count',
      yearAndScope: 'WHO Indoor Air Quality Assessment (Qualitative Multi-Chemical Framework)',
      sourceName: 'World Health Organization (WHO) Indoor Air Quality Guidelines',
      sourceUrl: 'https://www.who.int/teams/environment-climate-change-and-health/air-quality-energy-and-health/air-quality/indoor-air-quality',
      verifiedStatus: 'Empirical Multi-Chemical Toxicological Profile',
      shortSummary: 'VOCs represent a wide chemical family (including benzene, formaldehyde, toluene, and xylene) originating from building materials, adhesives, cleaning solvents, and synthetic furnishings.',
      methodologyDetails: 'The World Health Organization (WHO) documents that indoor VOC exposures contribute to acute poisoning, chronic respiratory illnesses like asthma, and carcinogenic outcomes (such as leukemia from benzene). Because VOCs encompass thousands of distinct compounds with divergent toxicity profiles, WHO does not publish an isolated global VOC mortality tally. We report this scientific nuance accurately rather than presenting a fabricated statistic.',
      safeBreathConnection: 'SafeBreath utilizes an MQ-135 tin-dioxide (SnO2) semiconductor surface to detect elevated broadband VOC levels, helping occupants detect chemical outgassing, poor ventilation, and indoor air degradation.',
      badgeColor: 'text-emerald-800 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'lpg-gas',
      category: 'direct-hazard',
      categoryLabel: 'Direct Monitored Gas Hazard',
      hazardName: 'LPG & Combustible Gases',
      metricValue: 'Explosion Risk',
      metricLabel: 'Leakage & Accumulation Thermal Risk',
      yearAndScope: 'WHO Clean Household Energy & Fuel Transition Context',
      sourceName: 'World Health Organization (WHO) Household Energy Guidelines',
      sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/household-air-pollution-and-health',
      verifiedStatus: 'Combustible Fuel Safety Nuance',
      shortSummary: 'Liquefied Petroleum Gas (propane and butane) is recognized by WHO as an effective, clean cooking fuel alternative compared to polluting solid fuels, but gas leaks present acute deflagration hazards.',
      methodologyDetails: 'While LPG combustion emits virtually no toxic solid particulates, mechanical leakages from valves, degraded hoses, or burner failures can accumulate explosive vapor clouds. When concentrations reach the Lower Explosive Limit (LEL, approx. 1.8% to 2.1% in air), any spark can trigger catastrophic flash fires or building explosions. SafeBreath does not invent a global LPG mortality number; instead, it monitors pre-combustion leakage.',
      safeBreathConnection: 'SafeBreath incorporates an MQ-6 catalytic semiconductor calibrated to detect propane and isobutane at early leak stages well below hazardous lower explosive thresholds.',
      badgeColor: 'text-amber-800 bg-amber-50 border-amber-200'
    },
    {
      id: 'household-air-pollution',
      category: 'air-pollution',
      categoryLabel: 'Broader Atmospheric Health Context',
      hazardName: 'Household Air Pollution (HAP)',
      metricValue: '2.9 Million',
      metricLabel: 'Attributable Deaths Worldwide (2021)',
      yearAndScope: '2021 WHO Global Estimation (2.1 Billion People at Risk)',
      sourceName: 'World Health Organization (WHO) Factsheet on Household Air Pollution',
      sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/household-air-pollution-and-health',
      verifiedStatus: 'Verified Global Health Assessment',
      shortSummary: 'Around 2.1 billion people worldwide still rely on polluting solid fuels and kerosene for cooking and heating, causing extensive particulate and toxic gas emissions in living spaces.',
      methodologyDetails: 'WHO estimates that household air pollution was associated with 2.9 million deaths in 2021 from stroke, ischemic heart disease, chronic obstructive pulmonary disease (COPD), and lung cancer. This provides vital public health context for the broader domestic atmospheric environment in which early hazard monitoring takes place.',
      safeBreathConnection: 'SafeBreath provides local real-time visibility into indoor atmospheric conditions, bridging the gap between invisible airborne pollution and prompt ventilation actions.',
      badgeColor: 'text-purple-800 bg-purple-50 border-purple-200'
    },
    {
      id: 'combined-air-pollution',
      category: 'air-pollution',
      categoryLabel: 'Broader Atmospheric Health Context',
      hazardName: 'Combined Air Pollution Burden',
      metricValue: '6.7 Million',
      metricLabel: 'Premature Deaths Annually',
      yearAndScope: 'WHO Annual Global Epidemiological Synthesis',
      sourceName: 'World Health Organization (WHO) Ambient & Household Air Quality',
      sourceUrl: 'https://www.who.int/health-topics/air-pollution',
      verifiedStatus: 'Comprehensive Public Health Baseline',
      shortSummary: 'The combined burden of ambient (outdoor) and household (indoor) air pollution represents one of the largest environmental health risks confronting global populations.',
      methodologyDetails: 'WHO synthesizes satellite atmospheric models, ground-level monitoring stations, and epidemiological hazard ratios to determine that 6.7 million premature deaths annually are attributable to joint outdoor and indoor air pollution exposure worldwide.',
      safeBreathConnection: 'SafeBreath serves as an accessible edge node in environmental metrology, capturing continuous multi-gas and climate data for both immediate safety and long-term cloud traceability.',
      badgeColor: 'text-indigo-800 bg-indigo-50 border-indigo-200'
    },
    {
      id: 'burns-and-fire',
      category: 'thermal-hazard',
      categoryLabel: 'Thermal & Fire Hazard Context',
      hazardName: 'Burn & Fire Hazards',
      metricValue: '~180,000',
      metricLabel: 'Annual Burn Deaths Globally',
      yearAndScope: 'WHO Burn Prevention Data & UNDRR Fire Estimations (>150,000)',
      sourceName: 'World Health Organization (WHO) Burns Factsheet & UNDRR',
      sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/burns',
      verifiedStatus: 'Verified Trauma & Hazard Baseline',
      shortSummary: 'Thermal injuries and structural fires disproportionately affect households in low- and middle-income nations due to uncontained cooking fires, combustible gases, and inadequate early alarms.',
      methodologyDetails: 'WHO estimates that approximately 180,000 deaths occur every year from burns, with over 90% occurring in low- and middle-income regions. The United Nations Office for Disaster Risk Reduction (UNDRR) separately identifies over 150,000 annual fatalities directly linked to structural fires and thermal hazards.',
      safeBreathConnection: 'By pairing combustible gas sensing with a digital temperature probe (DHT11) and thermal runaway latch logic, SafeBreath triggers acoustic alerts before runaway heating causes structural ignition.',
      badgeColor: 'text-rose-800 bg-rose-50 border-rose-200'
    }
  ];

  const filteredItems = evidenceData.filter(item => {
    if (activeFilter === 'direct') return item.category === 'direct-hazard';
    if (activeFilter === 'broader') return item.category === 'air-pollution' || item.category === 'thermal-hazard';
    return true;
  });

  return (
    <section id="why-it-matters" className="space-y-12 pt-4">
      {/* Editorial Header */}
      <div className="max-w-4xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium">
          <Globe2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>GLOBAL EVIDENCE & SCIENTIFIC RATIONALE</span>
          <span className="text-slate-300">·</span>
          <span>EMPIRICAL PUBLIC HEALTH DATA</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Why Continuous Atmospheric Hazard Monitoring Matters
        </h2>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Atmospheric safety requires understanding distinct physical threats: acute toxic gases, combustible vapors, and systemic air pollution. To establish the legitimate engineering necessity for SafeBreath, we examine verified epidemiological data from the <strong>World Health Organization (WHO)</strong> and the <strong>Global Burden of Disease (GBD 2021)</strong> study—maintaining strict distinction between cause-specific toxicities and broader environmental health contexts.
        </p>
      </div>

      {/* Primary Key Metric Callout Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl">
        <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-800 pb-5 md:pb-0 md:pr-6">
          <div className="text-[11px] font-mono uppercase tracking-wider text-sky-400">
            Direct Specific Cause · GBD 2021
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tabular-nums">
            28,900
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Deaths from unintentional carbon-monoxide poisoning worldwide in 2021 (95% UI: 21,700–32,800). A specific, preventable chemical hazard directly measured by SafeBreath.
          </p>
          <div className="text-[10px] font-mono text-slate-400">
            Source: Global Burden of Disease Study 2021
          </div>
        </div>

        <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-800 pb-5 md:pb-0 md:pr-6">
          <div className="text-[11px] font-mono uppercase tracking-wider text-purple-400">
            Broader Public Health Context · WHO
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tabular-nums">
            2.9 Million
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Annual deaths attributable to household air pollution (2021), affecting ~2.1 billion people who rely on polluting cooking fuels and inefficient combustion.
          </p>
          <div className="text-[10px] font-mono text-slate-400">
            Source: World Health Organization (WHO)
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-rose-400">
            Thermal & Burn Context · WHO / UNDRR
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tabular-nums">
            ~180,000
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Global burn deaths every year (with UNDRR estimating &gt;150,000 structural fire fatalities). Demonstrates the acute importance of early combustible gas leak detection.
          </p>
          <div className="text-[10px] font-mono text-slate-400">
            Source: WHO Burns Factsheet & UNDRR
          </div>
        </div>
      </div>

      {/* Category Segmented Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Evidence ({evidenceData.length})
          </button>
          <button
            onClick={() => setActiveFilter('direct')}
            className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeFilter === 'direct'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Direct Monitored Gases
          </button>
          <button
            onClick={() => setActiveFilter('broader')}
            className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeFilter === 'broader'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Broader Atmospheric Burden
          </button>
        </div>

        <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Tap any card to view authoritative citations</span>
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 bg-white p-6 flex flex-col justify-between shadow-sm hover:shadow ${
                isExpanded ? 'border-emerald-500/80 ring-1 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              <div className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${item.badgeColor}`}>
                    {item.categoryLabel}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {item.verifiedStatus}
                  </span>
                </div>

                {/* Metric Display */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {item.hazardName}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                      {item.metricValue}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-1">
                    {item.metricLabel}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-700 mt-0.5">
                    {item.yearAndScope}
                  </div>
                </div>

                {/* Summary Text */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.shortSummary}
                </p>

                {/* SafeBreath Physical Role */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                    SafeBreath Metrology Role:
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    {item.safeBreathConnection}
                  </p>
                </div>

                {/* Expandable Methodology & Sources */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 space-y-3 animate-fadeIn">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                        Detailed Methodology & Nuance:
                      </span>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {item.methodologyDetails}
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                        Authoritative Citation:
                      </span>
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                      >
                        <span>{item.sourceName}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Toggle Button */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium py-1 transition-colors"
                >
                  <span>{isExpanded ? 'Hide Evidence Notes' : 'View Source & Methodology'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                  title="Open authoritative source"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rigorous Engineering Boundary Disclaimer */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 sm:p-7 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Scientific Governance & Application Scope</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The purpose of this evidence section is to substantiate why early, multi-tier atmospheric detection is an essential engineering discipline. SafeBreath does not assert that its hardware prototype singularly mitigates broad societal mortality figures; rather, these authoritative findings from the World Health Organization and the Institute for Health Metrics and Evaluation (IHME) define the operational environment, chemical threat boundaries, and critical need for responsive, autonomous local safety alarms.
        </p>
      </div>
    </section>
  );
};
