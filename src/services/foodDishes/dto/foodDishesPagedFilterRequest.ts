export interface FoodDishesPagedFilterRequest {
  maxResultCount?: number;
  skipCount?: number;
  status?: number;
  keyword?: string;
  advancedSearchKeyword?: string;
  sorting?: string;
}
