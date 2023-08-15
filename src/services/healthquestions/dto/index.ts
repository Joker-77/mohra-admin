import { HealthQuestionType } from '../../../lib/types';

export interface HealthQuestionChoiceDto {
  arContent: string;
  enContent: string;
}

export interface CreateOrUpdateHealthQuestionDto {
  type: HealthQuestionType;
  arContent: string;
  enContent: string;
  order: number;
  isActive: boolean;
  healthProfileQuestionChoices: Array<HealthQuestionChoiceDto>;
  id?: number;
}

export interface HealthQuestionDto {
  type: HealthQuestionType;
  arContent: string;
  enContent: string;
  content: string;
  order: number;
  healthProfileQuestionChoices: Array<HealthQuestionChoiceDto>;
  createdBy: string;
  creatorUserId: number;
  creationTime: Date;
  id: number;
  isActive: boolean;
}

export interface HealthQuestionPagedResultDto {
  maxResultCount?: number;
  skipCount?: number;
  IsActive?: boolean;
  Sorting?: string;
  keyword?: string;
}
