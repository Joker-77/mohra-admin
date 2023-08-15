/* eslint-disable */
import * as React from 'react';
import { Modal, Button, Tag, Table } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './orderDetailsModal.css';
import OrderStore from '../../../stores/orderStore';
import { OrderItemDto } from '../../../services/orders/dto/orderItemDto';
import ThousandSeparator from '../../../components/ThousandSeparator';
import { OrderType, PaymentMethod } from '../../../lib/types';
import { ProductDto } from '../../../services/products/dto';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';

export interface IOrderDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  orderStore: OrderStore;
}

@inject(Stores.OrderStore)
@observer
class OrderDetailsModal extends React.Component<IOrderDetailsModalProps, any> {
  handleCancel = () => {
    this.props.onCancel();
  };

  renderOrderStatus = (status: number) => {
    switch (status) {
      case OrderType.Approved:
        return (
          <Tag color={'green'} className="ant-tag-disable-pointer">
            {L('Approved')}
          </Tag>
        );
      case OrderType.Cancelled:
        return (
          <Tag color={'red'} className="ant-tag-disable-pointer">
            {L('Cancelled')}
          </Tag>
        );
      case OrderType.Delivered:
        return (
          <Tag color={'lime'} className="ant-tag-disable-pointer">
            {L('Delivered')}
          </Tag>
        );
      case OrderType.InProgress:
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {L('InProgress')}
          </Tag>
        );
      case OrderType.OnTheWay:
        return (
          <Tag color={'purple'} className="ant-tag-disable-pointer">
            {L('OnTheWay')}
          </Tag>
        );
      case OrderType.Rejected:
        return (
          <Tag color={'error'} className="ant-tag-disable-pointer">
            {L('Rejected')}
          </Tag>
        );
      case OrderType.Waiting:
        return (
          <Tag color={'warning'} className="ant-tag-disable-pointer">
            {L('Waiting')}
          </Tag>
        );
    }
    return null;
  };

  orderItemsTableColumns = [
    {
      title: L('ProductNameEn'),
      dataIndex: 'product',
      key: 'product',
      render: (productId: ProductDto, item: OrderItemDto) => {
        return item!.product.enName;
      },
    },
    {
      title: L('ProductNameAr'),
      dataIndex: 'product',
      key: 'product',
      render: (productId: ProductDto, item: OrderItemDto) => {
        return item!.product.arName;
      },
    },
    {
      title: L('Quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: L('ScheduledDeliveryDate'),
      dataIndex: 'scheduledDeliveryDate',
      key: 'scheduledDeliveryDate',
      render: (_: any, item: OrderItemDto) => {
        return moment(item.scheduledDeliveryDate).format(timingHelper.defaultDateFormat)
      },
    },
    {
      title: L('Price'),
      dataIndex: 'price',
      key: 'price',
      render: (_: any, item: OrderItemDto) => {
        return <ThousandSeparator number={item.price} currency={L('SAR')} />;
      },
    },
    {
      title: L('TotalPrice'),
      dataIndex: 'price',
      key: 'price',
      render: (_: any, item: OrderItemDto) => {
        return <ThousandSeparator number={(item.totalPrice)} currency={L('SAR')} />;
      },
    },
  ];

  render() {
    const { visible } = this.props;
    const { orderModel } = this.props.orderStore!;
    return (
      <Modal
        visible={visible}
        title={L('Details')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        width="60%"
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Close')}
          </Button>,
        ]}
      >
        <div className="order-details-modal">
          <div className="details-wrapper">
            <div className="detail-wrapper">
              <span className="detail-label">{L('OrderNumber')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.number : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('CreationTime')}:</span>
              <span className="detail-value">
                {/* {orderModel !== undefined ? orderModel.creationTime : undefined} */}
                {
                  orderModel !== undefined ?
                    moment(orderModel.creationTime).format(timingHelper.defaultDateTimeFormat) : undefined
                }

              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('Shop')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.shop.name : undefined}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('Fees')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.taxFee : undefined}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('shippingFee')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.shippingFee : undefined}
              </span>
            </div>


            <div className="detail-wrapper">
              <span className="detail-label">{L('ClientName')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.client.name : undefined}
              </span>
            </div>
            <div className="detail-wrapper">
              <span className="detail-label">{L('CountryCode')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.client.countryCode : undefined}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('ClientPhoneNumber')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.client.phoneNumber : undefined}
              </span>
            </div>


            <div className="detail-wrapper">
              <span className="detail-label">{L('PaymentMethod')}:</span>
              <span className="detail-value">
                {/* {orderModel !== undefined ? orderModel.paymentMethod : undefined} */}

                <Tag color={'processing'} className="ant-tag-disable-pointer">
                  {orderModel !== undefined && orderModel.paymentMethod === PaymentMethod.ApplePay
                    ? L('ApplePay')
                    : orderModel !== undefined && orderModel.paymentMethod === PaymentMethod.Cash
                      ? L('Cash')
                      : orderModel !== undefined && orderModel.paymentMethod === PaymentMethod.CreditCard
                        ? L('CreditCard')
                        : orderModel !== undefined && orderModel.paymentMethod === PaymentMethod.Mada
                          ? L('Mada')
                          : L('STCPay')}
                </Tag>
                <br />
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('DeliveryName')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.shippingAddress.fullName : undefined}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('DeliverycountryCode')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.shippingAddress.countryCode : undefined}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('DeliveryphoneNumber')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.shippingAddress.phoneNumber : undefined}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('DeliveryzipCode')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.shippingAddress.zipCode : undefined}
              </span>
            </div>

            <div className="detail-wrapper">
              <span className="detail-label">{L('buildingNo')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.shippingAddress.buildingNo : undefined}
              </span>
            </div>


            <div className="detail-wrapper">
              <span className="detail-label">{L('streetAddress')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? orderModel.shippingAddress.streetAddress : undefined}
              </span>
            </div>


            <div className="detail-wrapper">
              <span className="detail-label">{L('Status')}:</span>
              <span className="detail-value">
                {orderModel !== undefined ? this.renderOrderStatus(orderModel.status) : undefined}
              </span>
            </div>

            {orderModel !== undefined && orderModel!.items.length > 0 && (
              <Table
                rowKey={(record) => record.id + ''}
                style={{ marginTop: '12px' }}
                loading={this.props.orderStore!.loadingOrders}
                dataSource={orderModel!.items}
                columns={this.orderItemsTableColumns}
              />
            )}



            {orderModel !== undefined && orderModel.couponDiscount > 0 && (
              <>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('Coupons')}: {orderModel !== undefined ? orderModel.couponDiscount : undefined}</span>
                </div>

                <div className="detail-wrapper">
                  <span className="detail-label">{L('CouponCode')}: {orderModel !== undefined ? orderModel.couponCode : undefined}</span>
                </div>
              </>

            )}

            <div className="detail-wrapper">
              <span className="detail-label">{L('TotalPrice')}: {orderModel !== undefined ? Math.round((orderModel.totalOrderFee - orderModel.couponDiscount) * 100) / 100
                : undefined}</span>
            </div>

          </div>
        </div>
      </Modal>
    );
  }
}

export default OrderDetailsModal;
