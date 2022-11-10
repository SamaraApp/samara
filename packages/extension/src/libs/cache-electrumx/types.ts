export interface RequestOptions {
  url: string;
  post?: Record<string, any>;
}
export interface StoredData {
  timestamp: number;
  data: string;
}

export interface RequestElectrumOptions {
  method: string;
  params: any[];
  endpoint: string;
}
