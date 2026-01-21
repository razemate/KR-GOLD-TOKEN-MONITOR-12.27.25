import React from 'react';
import { Landmark, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  symbol?: string;
  isLoading?: boolean;
}

const RedemptionTrustCard: React.FC<Props> = ({ symbol, isLoading = false }) => {
  if (isLoading || !symbol) {
    return (
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-300 animate-pulse">
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className="space-y-3">
             <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded" />
             <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
             <div className="h-3 w-5/6 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // --- Static Trust Data Logic ---
  const normalizedTicker = symbol.toUpperCase();

  type TrustData = {
    issuer: string;
    custody: string;
    redemption: string;
    freezeRisk: string;
    issuerUrl?: string;
    custodyUrl?: string;
    redemptionUrl?: string;
    freezeRiskUrl?: string;
  };

  const trustBySymbol: Record<string, TrustData> = {
    PAXG: {
      issuer: "Paxos Trust Company",
      custody: "Brink's Vaults (London)",
      redemption: "Physical (430oz bars) or Cash",
      freezeRisk: "Yes (Regulatory Compliant)",
      issuerUrl: "https://www.paxos.com/paxgold/",
      redemptionUrl: "https://www.paxos.com/paxgold/"
    },
    XAUT: {
      issuer: "Tether Gold",
      custody: "Swiss Vaults",
      redemption: "Physical (430oz+) Swiss deliv.",
      freezeRisk: "Yes (Centralized)",
      issuerUrl: "https://gold.tether.to/",
      redemptionUrl: "https://gold.tether.to/"
    },
    KAU: {
      issuer: "Kinesis",
      custody: "ABX / Audited Vaults",
      redemption: "Physical (100g min) or Cash",
      freezeRisk: "Yes (Centralized)",
      issuerUrl: "https://kinesis.money/"
    },
    XAUM: {
      issuer: "Matrixdock Gold",
      custody: "Not available",
      redemption: "Not available",
      freezeRisk: "Not available",
      issuerUrl: "https://www.matrixdock.com/xaum"
    },
    XAUT0: {
      issuer: "Tether Gold Tokens",
      custody: "Not available",
      redemption: "Not available",
      freezeRisk: "Not available",
      issuerUrl: "https://gold.usdt0.to/transfer"
    },
    CGO: {
      issuer: "Comtech Gold",
      custody: "Not available",
      redemption: "Not available",
      freezeRisk: "Not available",
      issuerUrl: "https://www.comtechgold.com/"
    },
    GOLDAO: {
      issuer: "Gold DAO",
      custody: "Not available",
      redemption: "Not available",
      freezeRisk: "Not available",
      issuerUrl: "https://www.gold-dao.org/"
    },
    DGLD: {
      issuer: "Gold Token SA",
      custody: "MKS PAMP vaults (Switzerland)",
      redemption: "Physical redemption from 1 gram",
      freezeRisk: "Not available",
      issuerUrl: "https://dgld.ch/",
      custodyUrl: "https://dgld.ch/",
      redemptionUrl: "https://dgld.ch/"
    },
    VNXAU: {
      issuer: "VNX Gold",
      custody: "Not available",
      redemption: "Not available",
      freezeRisk: "Not available",
      issuerUrl: "https://vnx.li/"
    },
    XNK: {
      issuer: "Kinka",
      custody: "Bankruptcy-remote custody (Gold Management LLC)",
      redemption: "Always redeemable: 1 XNK for 1 oz of gold",
      freezeRisk: "Not available",
      issuerUrl: "https://kinka-gold.com/",
      custodyUrl: "https://kinka-gold.com/",
      redemptionUrl: "https://kinka-gold.com/"
    },
    PMGT: {
      issuer: "Perth Mint",
      custody: "Government Guaranteed (WA)",
      redemption: "Physical & Certificates",
      freezeRisk: "Yes (Centralized)",
      issuerUrl: "https://www.perthmint.com/"
    },
    AAU: {
      issuer: "Aurus",
      custody: "Global Vault Network",
      redemption: "Physical via Partners",
      freezeRisk: "Yes",
      issuerUrl: "https://aurus.io/"
    }
  };

  const trustData = trustBySymbol[normalizedTicker] || {
    issuer: "Not available",
    custody: "Not available",
    redemption: "Not available",
    freezeRisk: "Not available"
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-300">
      <div className="flex-1">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 uppercase transition-colors duration-300">Redemption & Trust</h3>
          <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
            Checklist of key institutional risks. Not financial advice.
          </p>
        </div>

        <div className="space-y-4 text-xs md:text-[13px]">
          
          <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800/50 pb-2">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
              <Landmark className="w-4 h-4" />
              <span>Issuer</span>
            </div>
            {trustData.issuerUrl ? (
              <a
                href={trustData.issuerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-900 dark:text-slate-200 font-semibold text-right max-w-[60%] underline decoration-slate-300 hover:decoration-slate-500"
              >
                {trustData.issuer}
              </a>
            ) : (
              <span className="text-slate-900 dark:text-slate-200 font-semibold text-right max-w-[60%]">{trustData.issuer}</span>
            )}
          </div>

          <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800/50 pb-2">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Custody</span>
            </div>
            {trustData.custodyUrl ? (
              <a
                href={trustData.custodyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-900 dark:text-slate-200 font-semibold text-right max-w-[60%] underline decoration-slate-300 hover:decoration-slate-500"
              >
                {trustData.custody}
              </a>
            ) : (
              <span className="text-slate-900 dark:text-slate-200 font-semibold text-right max-w-[60%]">{trustData.custody}</span>
            )}
          </div>

          <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800/50 pb-2">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
              <RefreshCw className="w-4 h-4" />
              <span>Redemption</span>
            </div>
            {trustData.redemptionUrl ? (
              <a
                href={trustData.redemptionUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-900 dark:text-slate-200 font-semibold text-right max-w-[60%] underline decoration-slate-300 hover:decoration-slate-500"
              >
                {trustData.redemption}
              </a>
            ) : (
              <span className="text-slate-900 dark:text-slate-200 font-semibold text-right max-w-[60%]">{trustData.redemption}</span>
            )}
          </div>

           <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Freeze Risk</span>
            </div>
            {trustData.freezeRiskUrl ? (
              <a
                href={trustData.freezeRiskUrl}
                target="_blank"
                rel="noreferrer"
                className="text-rose-600 dark:text-rose-400 font-bold text-right underline decoration-rose-300 hover:decoration-rose-500"
              >
                {trustData.freezeRisk}
              </a>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 font-bold text-right">{trustData.freezeRisk}</span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default RedemptionTrustCard;