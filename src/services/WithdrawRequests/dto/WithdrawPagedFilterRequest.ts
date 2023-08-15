export interface WithdrawPagedFilterRequest {
    maxResultCount?: number;
    skipCount?: number;
    status?: number;
    keyword?: string;
    categoryId?: number;
    Sorting?: string;
    OnlyMyEvents?: boolean;
    organizerId?: string;
    expired?: boolean;
    running?: boolean;
    endAfterEvents?: Array<number>;
    startDate?: string;
    endDate?: string;
    parentId?: number;
}