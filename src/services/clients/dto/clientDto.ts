import {
  AppointmentReminder,
  AppointmentRepeat,
  CommentRefType,
  GenderType,
  InteractionRefType,
  InteractionType,
  LifeDreamStepStatus,
  ToDoPriority,
  UserStatus,
} from '../../../lib/types';
import { ChallengeDto } from '../../challenges/dto';
import { ExerciseDto } from '../../exercise/dto/exerciseDto';
import { LiteEntityDto } from '../../locations/dto/liteEntityDto';
import { SimpleClientDto } from './simpleClientDto';

interface AvatarDto {
  image: string;
  avatarUrl: string;
  arDescription: string;
  enDescription: string;
  description: string;
  gender: GenderType;
  isActive: boolean;
  arName: string;
  enName: string;
  name: string;
  id: number;
}

interface ClientDto {
  id: number;
  name: string;
  surname: string;
  emailAddress: string;
  status: UserStatus;
  fullName?: string;
  code: string;
  creationTime?: string;
  phoneNumber: string;
  city?: LiteEntityDto;
  countryCode: string;
  addresses: Array<AddressDto>;
  paymentsCount: number;
  gender: GenderType;
  hasAvatar: boolean;
  imageUrl: string;
  birthDate: string;
  userName: string;
  lastLoginTime: string;
  avatar: AvatarDto;
  devicedType?: number;
}
interface AddressDto {
  cityId?: number;
  city?: LiteEntityDto;
  street: string;
  description: string;
  latitude: number;
  longitude: number;
  id: number;
  cityName?: string;
  isDefault?: boolean;
}

interface HealthProfileAnswerDto {
  questioId: number;
  arQuestion: string;
  enQuestion: string;
  question: string;
  arAnswer: string;
  enAnswer: string;
  answer: string;
}

interface HealthProfileDto {
  id: number;
  gender: GenderType;
  birthDate: string;
  weight: number;
  weightGoal: number;
  caloriesToEat: number;
  caloriesToBurn: number;
  stepsToWalk: number;
  bmi: number;
  minRecommendedWeight: number;
  maxRecommendedWeight: number;
  length: number;
  healthSituation: number;
  difficulty: number;
  creatorUserId: number;
  createdBy: string;
  creationTime: Date;
  activityLevel: number;
  totalValueOfCalories: number;
}

interface HealthProfileQuestionChoiceDto {
  id: number;
  arContent: string;
  enContent: string;
  content: string;
}

interface HealthProfileInfoDto {
  healthProfile: HealthProfileDto;
  healthProfileAnswers: Array<HealthProfileQuestionChoiceDto>;
}

interface AnswerOutPutDto {
  question: string;
  choice: string;
}
interface ToDoTaskDto {
  title: string;
  date: string;
  clientId: number;
  priority: ToDoPriority;
  isAchieved: boolean;
  id: number;
}

interface ClientPagedFilterRequest {
  maxResultCount?: number;
  skipCount?: number;
  clientId?: number;
  filterFromDate?: '';
  filterToDate?: '';
}

interface AppointmentDto {
  title: string;
  allDays: boolean;
  note: string;
  startDate: string;
  endDate: string;
  fromHour: string;
  toHour: string;
  clients: Array<SimpleClientDto>;
  priority: ToDoPriority;
  repeat: AppointmentRepeat;
  reminder: AppointmentReminder;
  clientId: number;
  creatorUserId: number;
  createdBy: string;
  creationTime: string;
  isDone: boolean;
  id: number;
}

interface PositiveHabitDto {
  title: string;
  description: string;
  imageUrl: string;
  clientId: number;
  date: string;
  id: number;
}

interface LifeDreamStepDto {
  title: string;
  order: number;
  status: LifeDreamStepStatus;
  id: number;
}
interface LifeDreamDto {
  title: string;
  imageUrl: string;
  steps: Array<LifeDreamStepDto>;
  isAchieved: boolean;
  totalStepsCount: number;
  clientId: number;
  achievedStepsCount: number;
  pendingStepsCount: number;
  creatorUserId: number;
  creationTime: string;
  id: number;
}

interface TotalFriendsDto {
  id: number;
  name: string;
  email: string;
  friendTime: string;
}

interface SalaryCountsDto {
  id: number;
  enTitle: string;
  arTitle: string;
  title: string;
  creationTime: Date;
  order: number;
}
interface AuthSessionDto {
  id: number;
  userId: string;
  loginDate: string;
  logoutDate: string;
  hoursDuration: number | undefined;
  daysDuration: number | undefined;
}

interface SimpleSessionDto {
  exercises: Array<ExerciseDto>;
  arTitle: string;
  enTitle: string;
  title: string;
  imageUrl: string;
  timeInMinutes: number;
  amountOfCalories: number;
}

interface DailySessionDto {
  exerciseSessionId: number;
  clientId: number;
  creatorUserId: number;
  creationTime: string;
  trainingKcal: number;
  walkingKcal: number;
  session: SimpleSessionDto;
  id: number;
}

interface CommentDto {
  text: string;
  refId: string;
  refType: CommentRefType;
  creationTime: string;
  clientId: number;
  client: SimpleClientDto;
  id: number;
}

interface InteractionDto {
  refId: string;
  interactionType: InteractionType;
  refType: InteractionRefType;
  creationTime: string;
  clientId: number;
  client: SimpleClientDto;
  id: number;
}

interface MomentVideoDto {
  videoUrl: string;
  description: string;
}

interface MomentDto {
  commentsCount: number;
  comments: Array<CommentDto>;
  interactions: Array<InteractionDto>;
  videos: Array<MomentVideoDto>;
  tags: Array<MomentTagDto>;
  interactionsCount: number;
  feelingIconUrl: string;
  long: number;
  lat: number;
  placeName: string;
  songName: string;
  songId: string;
  caption: string;
  imageUrl: string;
  createdBy: string;
  clientId: number;
  client: SimpleClientDto;
  creatorUserId: number;
  creationTime: string;
  challengeId: number;
  challenge: ChallengeDto;
  id: number;
}

interface MomentTagDto {
  clientId: number;
  clientName: string;
}

export type {
  MomentTagDto,
  ClientPagedFilterRequest,
  ClientDto,
  InteractionDto,
  MomentVideoDto,
  MomentDto,
  CommentDto,
  DailySessionDto,
  SimpleSessionDto,
  LifeDreamDto,
  LifeDreamStepDto,
  TotalFriendsDto,
  PositiveHabitDto,
  AppointmentDto,
  ToDoTaskDto,
  AnswerOutPutDto,
  HealthProfileAnswerDto,
  AddressDto,
  AvatarDto,
  SalaryCountsDto,
  AuthSessionDto,
  HealthProfileInfoDto,
};
