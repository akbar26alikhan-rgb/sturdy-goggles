export interface DBFField {
  name: string;
  type: string;
  length: number;
  decimalCount: number;
}

export interface DBFData {
  fields: DBFField[];
  records: Record<string, any>[];
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
}
