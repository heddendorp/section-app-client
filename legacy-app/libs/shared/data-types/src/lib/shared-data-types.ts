export function sharedDataTypes(): string {
  return 'shared-data-types';
}

export interface Price {
  amount: number;
  esnCardRequired: boolean;
  allowedStatusList: string[];
  defaultPrice: boolean;
}
