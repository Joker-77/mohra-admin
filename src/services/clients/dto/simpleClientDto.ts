export interface SimpleClientDto {
  id: number;
  name: string;
  fullName?:string;
  surname?:string;
  phoneNumber: string;
  imageUrl?: string;
  points?:number;
  emailAddress?: string;
  point?: number;
  isEmailConfirmed?:boolean;
  isPhoneNumberConfirmed?:boolean;
  isFriend?: boolean;
  countryCode:string;
}
