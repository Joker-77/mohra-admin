import { OrderType, PaymentMethod } from '../../../lib/types';
import { SimpleClientDto } from '../../clients/dto/simpleClientDto';
// import { LiteEntityDto } from '../../locations/dto/liteEntityDto';
import { OrderItemDto } from './orderItemDto';
import { shippingAddressDto } from './shippingAddressDto';

export interface shopDto {
  id: number;
  name: string;
  logoUrl: string;
  coverUrl: string;
  shopManagerEmail: string;
  description: string;
  followersCount: string;
  isFollowed: boolean
}

export default interface OrderDto {
  id: number;
  number: string;
  shop: shopDto;
  client: SimpleClientDto;
  paymentMethod: PaymentMethod;
  fees: number;
  status: OrderType;
  creationTime: string;
  items: Array<OrderItemDto>;
  totalOrderFee: number;
  invoice: string;
  taxFee: number;
  shippingAddress: shippingAddressDto;
  shippingFee: number;
  pickupDate: number;
  couponDiscount: number;
  couponCode: string;
}
