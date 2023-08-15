
export interface FaqDto {
    id: number;
    arQuestion: string;
    enQuestion: string;
    arAnswer: string;
    enAnswer: string;
    order: number;
    isActive: boolean;
}

export interface CreateFaqDto {
    arQuestion: string;
    enQuestion: string;
    arAnswer: string;
    enAnswer: string;
    order: number;
    isActive: boolean;
}

export interface UpdateFaqDto {
    id: number;
    arQuestion: string;
    enQuestion: string;
    arAnswer: string;
    enAnswer: string;
    order: number;
    isActive: boolean;
}

export interface FaqPagedFilterAndSortedRequest {
    maxResultCount?: number;
    skipCount?: number;
    keyword?: string;
    isActive?: boolean;
    type?: number;
    sorting?: string;
    advancedSearchKeyword?: string;
}