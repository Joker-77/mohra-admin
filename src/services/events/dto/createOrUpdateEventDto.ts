// import EventType from '../../types/EventType';
import { EventOccoursOptions, EventTypes, FeesType } from '../../../lib/types';
import BuyingMethodDto from './buyingMethodDto';

export interface CreateOrUpdateEventDto {
  id?: number;
  arTitle: string;
  enTitle: string;
  categoryId: number;
  organizerId: number;
  arAbout: string;
  enAbout: string;
  latitude?: number;
  longitude?: number;
  arDescription: string;
  feesType: FeesType;
  enDescription: string;
  cityId?: number;
  buyingMethod: BuyingMethodDto;
  placeName: string;
  mainPicture: string;
  gallery: Array<string>;
  tags: Array<string>;
  hideComments: boolean;
  totalSeats?: number;
  defaultTicketPrice?: number;
  silverTicketPrice?: number;
  goldenTicketPrice?: number;
  platinumTicketPrice?: number;
  vipTicketPrice?: number;
  isRefundable: boolean;
  startDate?: string;

  endDate?: string;
  fromHour?: string;
  toHour?: string;
  eventType: EventTypes;
  invitationCode: string;
  enGoldenTicketDescription: string;
  enSilverTicketDescription: string;
  enPlatinumTicketDescription: string;
  enVIPTicketDescription: string;
  arGoldenTicketDescription: string;
  arSilverTicketDescription: string;
  arPlatinumTicketDescription: string;
  arVIPTicketDescription: string;
  link: string;
  value:string
  text:string
  endAfterEvents?: Array<number>;
  repeat?: EventOccoursOptions;
  parentId?: number;
  
  silverTotalSeats?: number;
  goldenTotalSeats?: number;
  platinumTotalSeats?: number;
  vipTotalSeats?: number;

  appearInAppDate?:string;
}
