export interface AdminPagedFilterRequest {
  maxResultCount?: number;
  Sorting?:string;
  skipCount?: number;
  isActive?: boolean;
  keyword?: string;
  filterChosenDate?: number;
  filterFromDate?: string;
  filterToDate?: string;  
}
