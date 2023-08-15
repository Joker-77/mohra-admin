import { ClientDto } from "../../clients/dto/clientDto";

export interface ContactDto {
    id: number;
    clientId: number;
    client?: ClientDto;
    name: string;
    phoneNumber: string;
    email: string;
    message: string;
    type: number;
    creationTime: string;
}

export interface CreateContactDto{

}

export interface UpdateContactDto{

}

export interface ContactPagedFilterRequest {
    skipCount: number;
    maxResultCount: number;
    isActive?: boolean;
    keyword?: string;
}