import { LucideIcon } from 'lucide-react';

export interface ContentBlock {
  type: 'text' | 'list' | 'grid' | 'formula' | 'table' | 'interactive-bmc' | 'interactive-swot' | 'interactive-pestle' | 'interactive-competitor' | 'interactive-business-plan' | 'interactive-marketing-plan' | 'interactive-mission-vision' | 'interactive-operations' | 'interactive-management' | 'interactive-future' | 'interactive-financial-statements' | 'interactive-break-even' | 'interactive-debtor-creditor' | 'interactive-account-types' | 'interactive-cost-types' | 'interactive-ledger' | 'interactive-cash-flow' | 'interactive-sales-plan' | 'interactive-income-statement' | 'interactive-depreciation' | 'business-plan-tips' | 'interactive-exam' | 'video';
  title?: string;
  content?: string;
  items?: string[];
  gridItems?: { title: string; description: string; icon?: LucideIcon }[];
  columns?: string[];
  rows?: string[][];
  highlight?: boolean;
  videoUrl?: string;
}

export interface Section {
  id: string;
  title: string;
  icon: LucideIcon;
  blocks: ContentBlock[];
}