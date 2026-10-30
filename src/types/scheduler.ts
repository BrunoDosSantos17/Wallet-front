export const AssetPriceSchedulerAction = {
  Activate: 'ATIVAR',
  Deactivate: 'DESATIVAR',
} as const;

export type AssetPriceSchedulerAction =
  (typeof AssetPriceSchedulerAction)[keyof typeof AssetPriceSchedulerAction];
