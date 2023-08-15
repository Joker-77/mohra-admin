export interface UpdateBannerDto {
  id: number;
  arTitle: string;
  enTitle: string;
  arDescriptions: string;
  enDescriptions: string;
  image: string;
  target: number;
  externalLink: string;
  targetId: string;
  disabled: boolean;
  displayOrder: number;
}
