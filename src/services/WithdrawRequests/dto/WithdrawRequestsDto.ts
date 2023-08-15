import { EventDto } from "../../events/dto/eventDto";

export interface WithdrawRequestsDto {
    eventId: number;
    event: EventDto;
    tickets: any[];
    creationDate: Date;
    clientId: number;
    client: null;
    totalAmount: number;
    ticketsCount: number;
    isActive: boolean;
    isApproved: boolean;
    id: number;
    isLive: boolean;
}