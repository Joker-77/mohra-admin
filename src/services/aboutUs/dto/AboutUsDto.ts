
export interface AboutUsDto {
    id: number;
    arTitle: string;
    enTitle: string;
    arContent: string;
    enContent: string;
    isActive: boolean;
}

export interface AboutUsRequestDto {
    arTitle: string;
    enTitle: string;
    arContent: string;
    enContent: string;
    isActive: boolean;
}

export interface UpdateAboutUsDto {
    id: number;
    arTitle: string;
    enTitle: string;
    arContent: string;
    enContent: string;
    isActive: boolean;
}