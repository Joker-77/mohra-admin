/* eslint-disable */
import { Modal, Spin, Table, Tabs, Tag } from 'antd';
import React from 'react';
import localization from '../../../lib/localization';
import { L } from '../../../i18next';
import { DollarCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import timingHelper from '../../../lib/timingHelper';
import { WithdrawRequestsDto } from '../../../services/WithdrawRequests/dto/WithdrawRequestsDto';
const { TabPane } = Tabs;

// import moment from 'moment';
// import timingHelper from '../../../lib/timingHelper';

interface OrganizerDetailsProps {
  visible: boolean;
  onCancel: () => void;
  withdrawData?: any;
  isGettingData?: boolean;
}

const WithdrawRequestDetails: React.FC<OrganizerDetailsProps> = ({
  visible,
  onCancel,
  withdrawData = {},
  isGettingData = false,
}) => {
  enum TicketType {
    Silver = 0,
    Golden = 1,
    Platinum = 2,
    VIP = 3,
    Free = 4,
    Default = 5,
  }

  const TicketTypeStatus = {
    0: {
      value: TicketType.Silver,
      text: 'Silver',
      color: 'red',
    },
    1: {
      value: TicketType.Golden,
      text: 'Golden',
      color: 'green',
    },
    2: {
      value: TicketType.Platinum,
      text: 'Platinum',
      color: 'red',
    },
    3: {
      value: TicketType.VIP,
      text: 'VIP',
      color: 'red',
    },
    4: {
      value: TicketType.Free,
      text: 'Free',
      color: 'red',
    },
    5: {
      value: TicketType.Default,
      text: 'Default',
      color: 'red',
    },
  };

  const bookingTableColumns = [
    {
      title: L('bookingNumber'),
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: L('TicketType'),
      dataIndex: 'ticketType',
      key: 'ticketType',
    },
    {
      title: L('bookingDate'),
      dataIndex: 'bookingDate',
      key: 'bookingDate',
    },
    {
      title: L('bookingStatus'),
      dataIndex: 'bookingStatus',
      key: 'bookingStatus',
    },
    {
      title: L('PayingStatus'),
      dataIndex: 'PayingStatus',
      key: 'PayingStatus',
    },
  ];

  const eventsTableColumns = [
    {
      title: L('TicketNumber'),
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: L('TicketType'),
      dataIndex: 'type',
      key: 'ticketType',
    },
    {
      title: L('CreationTime'),
      dataIndex: 'date',
      key: 'date',
      render: (_Date: Date, item: WithdrawRequestsDto): string => {
        return moment(item.creationDate).format(timingHelper.defaultTimeFormat);
      },
    },
    {
      title: L('type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => {
        return (
          TicketTypeStatus[type as keyof typeof TicketTypeStatus] && (
            <Tag
              color={TicketTypeStatus[type as keyof typeof TicketTypeStatus].color}
              className="ant-tag-disable-pointer"
            >
              {TicketTypeStatus[type as keyof typeof TicketTypeStatus].text}
            </Tag>
          )
        );
      },
    },
    {
      title: L('phoneNumber'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: L('emailAddress'),
      dataIndex: 'emailAddress',
      key: 'emailAddress',
    },
    {
      title: L('bookingId'),
      dataIndex: 'bookingId',
      key: 'bookingId',
    },
    {
      title: L('scanned'),
      dataIndex: 'scanned',
      key: 'scanned',
      render: (scanned: boolean) => {
        return (
          <Tag color={scanned ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
            {scanned ? L('Yes') : L('No')}
          </Tag>
        );
      },
    },
    {
      title: L('Withdrawn'),
      dataIndex: 'isWithdrawn',
      key: 'isWithdrawn',
      render: (Withdrawn: boolean) => {
        return (
          <Tag color={Withdrawn ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
            {Withdrawn ? L('Yes') : L('No')}
          </Tag>
        );
      },
    },
  ];

  enum IsActiveStatus {
    Inactive = 0,
    Active = 1,
    Closed = 2,
    Rejected = 3,
  }

  const eventStatus: {
    [key: string]: { value: IsActiveStatus; text: string; color: string };
  } = {
    '0': {
      value: IsActiveStatus.Inactive,
      text: 'Inactive',
      color: 'red',
    },
    '1': {
      value: IsActiveStatus.Active,
      text: 'Active',
      color: 'green',
    },
    '3': {
      value: IsActiveStatus.Rejected,
      text: 'Rejected',
      color: 'red',
    },
  };

  // const TicketTypeStatus = {
  //   0: {
  //     value: TicketType.Silver,
  //     text: L('silver'),
  //     color: 'red',
  //   },
  //   1: {
  //     value: TicketType.Golden,
  //     text: L('Golden'),
  //     color: 'green',
  //   },
  //   2: {
  //     value: TicketType.Platinum,
  //     text: L('Platinum'),
  //     color: 'red',
  //   },
  //   3: {
  //     value: TicketType.VIP,
  //     text: L('VIP'),
  //     color: 'red',
  //   },
  //   4: {
  //     value: TicketType.Free,
  //     text: L('Free'),
  //     color: 'red',
  //   },
  //   5: {
  //     value: TicketType.Default,
  //     text: L('Default'),
  //     color: 'red',
  //   },
  // };

  return (
    <Modal
      width="80%"
      style={{ padding: '20px' }}
      visible={visible}
      title={L('eventDetails')}
      onCancel={onCancel}
      centered
      destroyOnClose
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={false}
    >
      <div className="scrollable-modal">
        {isGettingData ? (
          <div className="loading-comp">
            <Spin size="large" />
          </div>
        ) : (
          <div>
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    <InfoCircleOutlined />
                    {L('General')}
                  </span>
                }
                key="1"
              >
                <div className="details-wrapper">
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('ID')}:</span>
                    <span className="detail-value">{withdrawData.id}</span>
                  </div>

                  <div className="detail-wrapper">
                    <span className="detail-label">{L('ClientID')}:</span>
                    <span className="detail-value">{withdrawData.clientId}</span>
                  </div>

                  <div className="detail-wrapper">
                    <span className="detail-label">{L('totalAmount')}:</span>
                    <span className="detail-value">{withdrawData.totalAmount}</span>
                  </div>

                  <div className="detail-wrapper">
                    <span className="detail-label">{L('ticketsCount')}:</span>
                    <span className="detail-value">{withdrawData.ticketsCount}</span>
                  </div>
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <InfoCircleOutlined />
                    {L('Event')}
                  </span>
                }
                key="2"
              >
                <div className="details-wrapper">
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('EventId')}:</span>
                    <span className="detail-value">{withdrawData.eventId}</span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('Category')}:</span>
                    <span className="detail-value">{withdrawData.event?.categoryName ?? ''}</span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('ArName')}:</span>
                    <span className="detail-value">{withdrawData.event?.arTitle ?? ''}</span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('EnName')}:</span>
                    <span className="detail-value">{withdrawData.event?.enTitle ?? ''}</span>
                  </div>

                  <div className="detail-wrapper">
                    <span className="detail-label">{L('CountOfComments')}:</span>
                    <span className="detail-value">{withdrawData.event?.commentsCount ?? ''}</span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('CountOfLikes')}:</span>
                    <span className="detail-value">{withdrawData.event?.likesCount}</span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('ArAboutOfEvent')}:</span>
                    <span className="detail-value">{withdrawData.event?.arAbout ?? ''}</span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('EnAboutOfEvent')}:</span>
                    <span className="detail-value">{withdrawData.event?.enAbout ?? ''}</span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('ArDescription')}:</span>
                    <span
                      className="detail-value"
                      dangerouslySetInnerHTML={{ __html: withdrawData.event?.arDescription ?? '' }}
                    />
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('EnDescription')}:</span>
                    <span
                      className="detail-value"
                      dangerouslySetInnerHTML={{ __html: withdrawData.event?.enDescription ?? '' }}
                    />
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('FromDate')}:</span>
                    <span className="detail-value">
                      {moment(withdrawData.event?.startDate).format(timingHelper.defaultDateFormat)}
                    </span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('ToDate')}:</span>
                    <span className="detail-value">
                      {moment(withdrawData.event?.endDate).format(timingHelper.defaultDateFormat)}
                    </span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('IsActive')}:</span>
                    <span className="detail-value">
                      {eventStatus[String(status)] && (
                        <Tag
                          color={eventStatus[String(status)].color}
                          className="ant-tag-disable-pointer"
                        >
                          {eventStatus[String(status)].text}
                        </Tag>
                      )}
                    </span>
                  </div>

                  <div className="detail-wrapper">
                    <span className="detail-label">{L('CreatedBy')}</span>
                    <span className="detail-value">{withdrawData.event?.createdBy}</span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('CreationDate')}</span>
                    <span className="detail-value">
                      {withdrawData.creationTime &&
                        moment(withdrawData.event?.creationTime).format(
                          timingHelper.defaultDateTimeFormat
                        )}
                    </span>
                  </div>
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <DollarCircleOutlined />
                    {L('BookingInfo')}
                  </span>
                }
                key="4"
              >
                <div className="details-wrapper">
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('BuyingMethod')}:</span>
                    <span className="detail-value">
                      {withdrawData.buyingMethod === 0
                        ? L('OnTheApp')
                        : withdrawData.buyingMethod === 1
                        ? L('InOfficialWebsite')
                        : ''}
                    </span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('bookedSeats')}:</span>
                    <span className="detail-value">
                      {withdrawData?.bookedSeats}/{withdrawData?.totalSeats}
                    </span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('AvailableSeats')}:</span>
                    <span className="detail-value">{withdrawData.event?.availableSeats}</span>
                  </div>
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('isRefundable')}:</span>
                    <span className="detail-value">
                      {withdrawData.event?.isRefundable ? L('Yes') : L('No')}
                    </span>
                  </div>

                  {withdrawData.event?.silverTicketPrice !== null && (
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('silverTicketPrice')}:</span>
                      <span className="detail-value">{withdrawData.event?.silverTicketPrice}</span>
                    </div>
                  )}
                  {withdrawData.event?.goldenTicketPrice !== null && (
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('goldenTicketPrice')}:</span>
                      <span className="detail-value">{withdrawData.event?.goldenTicketPrice}</span>
                    </div>
                  )}
                  {withdrawData.event?.platinumTicketPrice !== null && (
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('platinumTicketPrice')}:</span>
                      <span className="detail-value">
                        {withdrawData.event?.platinumTicketPrice}
                      </span>
                    </div>
                  )}
                  {withdrawData.event?.vipTicketPrice !== null && (
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('vipTicketPrice')}:</span>
                      <span className="detail-value">{withdrawData.event?.vipTicketPrice}</span>
                    </div>
                  )}

                  <div className="detail-wrapper">
                    <span className="detail-label">{L('TicketPrice')}:</span>
                    <span className="detail-value">{withdrawData.event?.price}</span>
                  </div>

                  {withdrawData.arSilverTicketDescription !== null && (
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('ArSilverTicketDescription')}:</span>
                      <span className="detail-value">
                        {withdrawData.event?.arSilverTicketDescription}
                      </span>
                    </div>
                  )}
                  {withdrawData.event?.enSilverTicketDescription !== null && (
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('EnSilverTicketDescription')}:</span>
                      <span className="detail-value">
                        {withdrawData.event?.enSilverTicketDescription}
                      </span>
                    </div>
                  )}
                  {withdrawData.event?.arPlatinumTicketDescription !== null && (
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('ArPlatinumTicketDescription')}:</span>
                      <span className="detail-value">
                        {withdrawData.event?.arPlatinumTicketDescription}
                      </span>
                    </div>
                  )}
                  {withdrawData.event?.enPlatinumTicketDescription !== null && (
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('EnPlatinumTicketDescription')}:</span>
                      <span className="detail-value">
                        {withdrawData.event?.enPlatinumTicketDescription}
                      </span>
                    </div>
                  )}
                  {withdrawData.event?.arVIPTicketDescription !== null && (
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('ArVIPTicketDescription')}:</span>
                      <span className="detail-value">
                        {withdrawData.event?.arVIPTicketDescription}
                      </span>
                    </div>
                  )}
                  {withdrawData.event?.enVIPTicketDescription !== null && (
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('EnVIPTicketDescription')}:</span>
                      <span className="detail-value">
                        {withdrawData.event?.enVIPTicketDescription}
                      </span>
                    </div>
                  )}
                  {withdrawData.event?.arGoldenTicketDescription !== null && (
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('ArGoldenTicketDescription')}:</span>
                      <span className="detail-value">
                        {withdrawData.event?.arGoldenTicketDescription}
                      </span>
                    </div>
                  )}
                  {withdrawData.event?.enGoldenTicketDescription !== null && (
                    <div className="detail-wrapper">
                      <span className="detail-label">{L('EnGoldenTicketDescription')}:</span>
                      <span className="detail-value">
                        {withdrawData.event?.enGoldenTicketDescription}
                      </span>
                    </div>
                  )}
                  <div className="detail-wrapper booking-list">
                    <span className="detail-label">{L('BookingRequestsList')}:</span>
                    {/* TODO: THIS TABLE NEED TO BE MODIFIED WHEN TICKETS DATA IS DONE FROM BE SIDE */}
                    <Table
                      className="event-table"
                      rowKey={(record) => `${record.id}`}
                      dataSource={withdrawData.tickets}
                      columns={bookingTableColumns}
                    />
                  </div>
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <DollarCircleOutlined />
                    {L('Tickets')}
                  </span>
                }
                key="6"
              >
                <div className="details-wrapper">
                  <div className="detail-wrapper">
                    <span className="detail-label">{L('TicketsCount')}:</span>
                    <span className="detail-value">{withdrawData.ticketsCount}</span>
                  </div>

                  <div className="detail-wrapper">
                    <span className="detail-label">{L('silverTicketPrice')}:</span>
                    <span className="detail-value">{withdrawData.event?.silverTicketPrice}</span>
                  </div>

                  <div className="detail-wrapper">
                    <span className="detail-label">{L('goldenTicketPrice')}:</span>
                    <span className="detail-value">{withdrawData.event?.goldenTicketPrice}</span>
                  </div>

                  <div className="detail-wrapper">
                    <span className="detail-label">{L('platinumTicketPrice')}:</span>
                    <span className="detail-value">{withdrawData.event?.platinumTicketPrice}</span>
                  </div>

                  <div className="detail-wrapper">
                    <span className="detail-label">{L('vipTicketPrice')}:</span>
                    <span className="detail-value">{withdrawData.event?.vipTicketPrice}</span>
                  </div>

                  <div className="detail-wrapper">
                    <span className="detail-label">{L('goldenTotalSeats')}:</span>
                    <span className="detail-value">{withdrawData.event?.goldenTotalSeats}</span>
                  </div>

                  <div className="detail-wrapper">
                    <span className="detail-label">{L('silverTotalSeats')}:</span>
                    <span className="detail-value">{withdrawData.event?.silverTotalSeats}</span>
                  </div>

                  <div className="detail-wrapper">
                    <span className="detail-label">{L('platinumTotalSeats')}:</span>
                    <span className="detail-value">{withdrawData.event?.platinumTotalSeats}</span>
                  </div>

                  <div className="detail-wrapper">
                    <span className="detail-label">{L('vipTotalSeats')}:</span>
                    <span className="detail-value">{withdrawData.event?.vipTotalSeats}</span>
                  </div>

                  <div className="detail-wrapper booking-list">
                    <span className="detail-label">{L('BookingRequestsList')}:</span>
                    {/* TODO: THIS TABLE NEED TO BE MODIFIED WHEN TICKETS DATA IS DONE FROM BE SIDE */}
                    <Table
                      className="event-table"
                      rowKey={(record) => `${record.id}`}
                      dataSource={withdrawData.tickets}
                      columns={eventsTableColumns}
                    />
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default WithdrawRequestDetails;
