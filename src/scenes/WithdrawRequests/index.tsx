/* eslint-disable */
import * as React from 'react';
import { Card, Table, Tag, Tooltip, Button, Select, Row, Col, DatePicker, Space } from 'antd';
import { observer } from 'mobx-react';
import moment, { Moment } from 'moment';
import Text from 'antd/lib/typography/Text';
import { FormInstance } from 'antd/lib/form';
import {
  EyeOutlined,
  UpOutlined,
  DownOutlined,
  FileExcelOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
//import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
//import { popupConfirm } from '../../lib/popupMessages';
import EventOrganizerStore from '../../stores/eventOrganizerStore';
//import {EventOrganizerDto,} from '../../services/eventOrganizer/dto';
import ResetPasswordModal from '../../components/ResetPasswordModal';
import timingHelper from '../../lib/timingHelper';
import { isGranted } from '../../lib/abpUtility';
import FiltrationBox from '../../components/FilterationBox';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import indexesService from '../../services/indexes/indexesService';
import WithdrawRequestsService from '../../services/WithdrawRequests/WithdrawRequestsService';
import { IndexType } from '../../lib/types';
import localization from '../../lib/localization';
import ExcellentExport from 'excellentexport';
import SearchComponent from '../../components/SearchComponent';
import { WithdrawRequestsDto } from '../../services/WithdrawRequests/dto/WithdrawRequestsDto';
import { WithdrawPagedFilterRequest } from '../../services/WithdrawRequests/dto/WithdrawPagedFilterRequest';
import { popupConfirm } from '../../lib/popupMessages';
import WithdrawRequestDetails from './Components/WithdrawRequestDetails';
import { changeWithdrawToApprovedDto } from '../../services/WithdrawRequests/dto/changeWithdrawToApprovedDto';
import EventsService from '../../services/events/eventsService';
import { notifySuccess } from '../../lib/notifications';

const { RangePicker } = DatePicker;

export interface IWithdrawRequestsProps {
  eventOrganizerStore?: EventOrganizerStore;
}

export interface IWithdrawRequestsState {
  withdrawModalVisible: boolean;
  resetPasswordModalVisible: boolean;
  withdrawModelItem: any;
  eventOrganizerId: number;
  eventId: number;
  meta: {
    page: number;
    pageSize: number | undefined;
    skipCount: number;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
  };
  permissionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
    resetPassword: boolean;
  };
  keyword?: string;
  isActiveFilter?: boolean;
  eventOrganizerCreateOrUpdateModalVisible: boolean;
  eventOrganizerCreateOrUpdateModalId: number;
  eventOrganizerCreateOrUpdateModalType: string;
  banks: LiteEntityDto[];
  events: LiteEntityDto[];

  withdrawRequests: WithdrawRequestsDto[];

  filterChosenDate?: number;
  filterFromDate?: string;
  filterToDate?: string;
}

enum IsActiveStatus {
  Inactive = 0,
  Active = 1,
  Closed = 2,
  Rejected = 3,
}

const INDEX_PAGE_SIZE_DEFAULT = 12;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

//@inject(Stores.EventOrganizerStore)
@observer
export class WithdrawRequestsTickets extends AppComponentBase<
  IWithdrawRequestsProps,
  IWithdrawRequestsState
> {
  resetPasswordFormRef = React.createRef<FormInstance>();

  eventStatus: {
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

  state = {
    withdrawModalVisible: false,
    resetPasswordModalVisible: false,
    eventOrganizerId: 0,
    withdrawModelItem: {},
    eventId: 0,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      skipCount: 0,
      total: 0,
    },
    permissionsGranted: {
      update: false,
      create: false,
      activation: false,
      resetPassword: false,
    },
    keyword: undefined,
    isActiveFilter: undefined,
    eventOrganizerCreateOrUpdateModalVisible: false,
    eventOrganizerCreateOrUpdateModalId: 0,
    eventOrganizerCreateOrUpdateModalType: 'create',
    banks: [],
    events: [],
    withdrawRequests: [],
    filterChosenDate: 0,
    filterFromDate: undefined,
    filterToDate: undefined,
  };

  // set the state of permissions
  async componentDidMount(): Promise<void> {
    // const result = await indexesService.getAllLite({
    //   maxResultCount: 100,
    //   skipCount: 0,
    //   type: IndexType.Bank,
    // });

    const [banks, _WithdrawRequests, Events] = await Promise.all([
      await indexesService.getAllLite({
        maxResultCount: 100,
        skipCount: 0,
        type: IndexType.Bank,
      }),
      WithdrawRequestsService.getAll({
        maxResultCount: 100,
        skipCount: 0,
      }),
      EventsService.getAllLite({ maxResultCount: 1000, skipCount: 0 }),
    ]);

    this.setState({
      banks: banks.items,
      events: Events.items,
      withdrawRequests: _WithdrawRequests.items,
      permissionsGranted: {
        update: isGranted('EventOrganizers.Update'),
        create: isGranted('EventOrganizers.Create'),
        activation: isGranted('EventOrganizers.Activation'),
        resetPassword: isGranted('EventOrganizers.ResetPassword'),
      },
    });

    await this.updateWithdrawList(this.state.meta.pageSize, 0);
  }

  // update the event organizers list
  updateWithdrawList = async (maxResultCount: number, skipCount: number): Promise<void> => {
    let inp: WithdrawPagedFilterRequest = {
      maxResultCount: maxResultCount,
      skipCount: skipCount,
    };

    const [whReqs] = await Promise.all([WithdrawRequestsService.getAll(inp)]);

    console.log(whReqs);
    this.setState({
      withdrawRequests: whReqs.items,
    });
  };

  // open event organizer details modal
  openWithDrawDetailsModal = async (item: WithdrawRequestsDto): Promise<void> => {
    // const { eventOrganizerStore } = this.props!;
    //  await eventOrganizerStore!.getEventOrganizer({ id: organizerId });
    this.setState({ withdrawModalVisible: true, withdrawModelItem: item });
  };

  // event organizer activation and deactivation

  onSwitchOrganizerActivation = async (req: WithdrawRequestsDto): Promise<void> => {
    popupConfirm(
      async () => {
        if (req.isActive) {
          let inp: changeWithdrawToApprovedDto = {
            Id: req.id,
          };
          const [result] = await Promise.all([
            WithdrawRequestsService.changeWithdrawToApproved(inp),
          ]);
          console.log(result);
          notifySuccess();
        }

        await this.updateWithdrawList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      req.isActive
        ? L('AreYouSureYouWantToApproveThisWithdrawRequest')
        : L('AreYouSureYouWantToActivateThisEventOrganizer')
    );
  };

  colLayout = {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 8 },
    lg: { span: 6 },
    xl: { span: 6 },
    xxl: { span: 6 },
  };

  // eventStatus = {
  //   0: {
  //     value: IsActiveStatus.Inactive,
  //     text: L('Inactive'),
  //     color: 'red',
  //   },
  //   1: {
  //     value: IsActiveStatus.Active,
  //     text: L('Active'),
  //     color: 'green',
  //   },
  //   3: {
  //     value: IsActiveStatus.Rejected,
  //     text: L('Rejected'),
  //     color: 'red',
  //   },
  // };

  // event Organizers Table Columns
  WithdrawTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('ُEventName'),
      dataIndex: 'event',
      key: 'event',
      render: (item: any): string => {
        return localization.isRTL() ? item.event?.arTitle : item.event?.enTitle;
      },
    },
    {
      title: L('ticketsCount'),
      dataIndex: 'ticketsCount',
      key: 'ticketsCount',
    },
    {
      title: L('TotalAmount'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: L('CreationTime'),
      dataIndex: 'creationDate',
      key: 'creationDate',
      render: (_Date: Date, item: WithdrawRequestsDto): string => {
        return moment(item.creationDate).format(timingHelper.defaultDateTimeFormat);
      },
    },

    {
      title: L('Status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: number): JSX.Element => (
        <Tag color={isActive ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
          {isActive ? L('Active') : L('Inactive')}
        </Tag>
      ),
    },
    {
      title: L('Approved'),
      dataIndex: 'isApproved',
      key: 'isApproved',
      render: (isApproved: boolean): JSX.Element => (
        <Tag color={isApproved ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
          {isApproved ? L('Approved') : L('Not Approved')}
        </Tag>
      ),
    },

    {
      title: L('Action'),
      key: 'action',
      render: (_1: unknown, item: WithdrawRequestsDto): JSX.Element => {
        // const {permissionsGranted: { update }, } = this.state;
        return (
          <div>
            {/* {update && (
              <Tooltip title={L('Edit')}>
                <EditOutlined
                  className="action-icon "
                //onClick={() => this.openCreateOrUpdateModal({ id: item.id! })}
                />
              </Tooltip>
            )} */}
            {!item.isApproved && (
              <Tooltip title={L('Approve')}>
                <CheckCircleFilled
                  className=" action-icon"
                  onClick={() => this.onSwitchOrganizerActivation(item)}
                />
              </Tooltip>
            )}
            {/* {activation && !item.isActive && (
              <Tooltip title={L('Activate')}>
                <CheckSquareOutlined
                  className="action-icon  green-text"
                  onClick={() => this.onSwitchOrganizerActivation(item)}
                />
              </Tooltip>
            )} */}
            <Tooltip title={L('Details')}>
              <EyeOutlined
                className="action-icon"
                onClick={() => this.openWithDrawDetailsModal(item)}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: number, pageSize: number): Promise<void> => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateWithdrawList(pageSize, 0);
    },
    onChange: async (page: number): Promise<void> => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateWithdrawList(
        this.state.meta.pageSize,
        (page - 1) * this.state.meta.pageSize
      );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: number, range: number[]): string =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    //const {loadingOrganizers } = this.props.eventOrganizerStore!;
    // const {
    //   meta: { page, pageSize },
    //   isActiveFilter,
    // } = this.state;

    const {
      meta: { page, pageSize, total },
      isActiveFilter,
    } = this.state;
    const withdrawRequests = this.state.withdrawRequests as WithdrawRequestsDto[];

    const pagination = {
      ...this.paginationOptions,
      total: total,
      current: page,
      pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('WithdrawRequests')}</span>

            {true && (
              <a
                download="event-organizers.xlsx"
                className="ant-btn ant-btn-default export-btn"
                style={{ float: localization.getFloat(), margin: '0 5px' }}
                id="export"
                href="#"
                onClick={() => {
                  return ExcellentExport.convert(
                    {
                      anchor: document.getElementById('export') as HTMLAnchorElement,
                      filename: L('EventOrganizers'),
                      format: 'xlsx',
                    },
                    [
                      {
                        name: L('EventOrganizers'),
                        from: { table: document.getElementById('datatable') as HTMLTableElement },
                      },
                    ]
                  );
                }}
              >
                <FileExcelOutlined /> {L('ExportToExcel')}
              </a>
            )}
          </div>
        }
      >
        <table id="datatable" style={{ display: 'none' }}>
          <thead>
            <tr>
              <td>{L('ID')}</td>
              <td>{L('Name')}</td>
              <td>{L('Surname')}</td>
              <td>{L('UserName')}</td>
              <td>{L('Email')}</td>
              <td>{L('PhoneNumber')}</td>
              <td>{L('companyWebsite')}</td>
              <td>{L('BankAccountNumber')}</td>
              <td>{L('bankName')}</td>
              <td>{L('Status')}</td>
              <td>{L('RegistrationDate')}</td>
            </tr>
          </thead>
          <tbody>
            {this.state.withdrawRequests.length > 0 &&
              this.state.withdrawRequests.map(
                (eventOrganizer: WithdrawRequestsDto, index: number) => {
                  return (
                    <tr key={index}>
                      <td>{eventOrganizer.id}</td>
                      <td>{eventOrganizer.clientId}</td>
                      <td>{eventOrganizer.eventId}</td>

                      <td>{eventOrganizer.isActive ? L('Active') : L('Inactive')}</td>
                      <td>
                        {moment(eventOrganizer.creationDate).format(timingHelper.defaultDateFormat)}
                      </td>
                    </tr>
                  );
                }
              )}
          </tbody>
        </table>
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateWithdrawList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />
        <FiltrationBox>
          <Row>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
              xl={{ span: 8 }}
            >
              <label>{L('IsActive')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                optionFilterProp="children"
                onChange={(value: boolean) => {
                  this.setState({
                    isActiveFilter: value,
                  });
                }}
                placeholder={L('SelectStatus')}
                value={isActiveFilter}
              >
                <Select.Option key={0} value={true}>
                  {L('Active')}
                </Select.Option>
                <Select.Option key={1} value={false}>
                  {L('Inactive')}
                </Select.Option>
              </Select>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
              xl={{ span: 8 }}
            >
              <label>{L('Clients')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                optionFilterProp="children"
                onChange={(value: any) => {
                  this.setState({ filterChosenDate: Number(value) });
                }}
                value={this.state.filterChosenDate}
              >
                <Select.Option key={0} value={0}>
                  {L('None')}
                </Select.Option>
                <Select.Option key={1} value={1}>
                  {L('Today')}
                </Select.Option>
                <Select.Option key={2} value={2}>
                  {L('Yesterday')}
                </Select.Option>
                <Select.Option key={3} value={3}>
                  {L('ChosenDate')}
                </Select.Option>
                <Select.Option key={4} value={4}>
                  {L('RangeDate')}
                </Select.Option>
              </Select>
            </Col>

            <Col {...this.colLayout} className="category-select">
              <label>{L('Events')}</label>
              <Select
                className="filter-select"
                optionFilterProp="children"
                onChange={(value: number) => {
                  this.setState({
                    eventId: value,
                  });
                }}
                placeholder={L('ChooseEvent')}
                value={this.state.eventId == 0 ? undefined : this.state.eventId}
              >
                {this.state.events &&
                  this.state.events.length > 0 &&
                  this.state.events.map((event: any) => (
                    <Select.Option key={event.value} value={event.value}>
                      {event.text}
                    </Select.Option>
                  ))}
              </Select>
            </Col>

            {this.state.filterChosenDate === 3 && (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 12 }}
                lg={{ span: 12 }}
                xl={{ span: 8 }}
              >
                <label>&nbsp;</label>
                <Space direction="horizontal" size={2}>
                  <DatePicker
                    onChange={(date: Moment | null, dateString: string) => {
                      this.setState({ filterFromDate: dateString });
                    }}
                    defaultValue={this.state.filterFromDate}
                    format={`MM/DD/YYYY`}
                  />
                </Space>
              </Col>
            )}
            {this.state.filterChosenDate === 4 && (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 12 }}
                lg={{ span: 12 }}
                xl={{ span: 8 }}
              >
                <label>&nbsp;</label>
                <Space direction="horizontal" size={2}>
                  <RangePicker
                    onChange={(dates: any, dateStrings: [string, string]) => {
                      if (dates) {
                        this.setState({
                          filterFromDate: dateStrings[0],
                          filterToDate: dateStrings[1],
                        });
                      } else {
                        console.log('Clear');
                      }
                    }}
                    format={`MM/DD/YYYY`}
                  />
                </Space>
              </Col>
            )}
          </Row>
          <div className="btns-wrap">
            <Button
              type="primary"
              onClick={async () => {
                await this.updateWithdrawList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ isActiveFilter: undefined, filterChosenDate: 0 }, async () => {
                  await this.updateWithdrawList(
                    this.state.meta.pageSize,
                    this.state.meta.skipCount
                  );
                });
              }}
            >
              {L('ResetFilter')}
            </Button>
          </div>
        </FiltrationBox>
        <Table
          pagination={pagination}
          rowKey={(record) => `${record.id}`}
          loading={false}
          dataSource={withdrawRequests ?? []}
          columns={this.WithdrawTableColumns}
          expandable={{
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <UpOutlined className="expand-icon" onClick={(e) => onExpand(record, e)} />
              ) : (
                <DownOutlined className="expand-icon" onClick={(e) => onExpand(record, e)} />
              ),
            expandedRowRender: (record) => (
              <>
                <Row>
                  <Col className="gutter-row" span={12}>
                    <Card title={L('Event')}>
                      <Text type="secondary">{L('OrganizerID')}: </Text>
                      <Text>{record.event.organizerId}</Text>
                      <br />

                      <Text type="secondary">{L('Status')}: </Text>
                      <Text>
                        {this.eventStatus[String(record.event.status)] && (
                          <Tag
                            color={this.eventStatus[String(record.event.status)].color}
                            className="ant-tag-disable-pointer"
                          >
                            {this.eventStatus[String(record.event.status)].text}
                          </Tag>
                        )}
                      </Text>
                      <br />

                      <Text type="secondary">{L('ArTitle')}: </Text>
                      <Text>{record.event.arTitle}</Text>
                      <br />

                      <Text type="secondary">{L('EnTitle')}: </Text>
                      <Text>{record.event.enTitle}</Text>
                      <br />

                      <Text type="secondary">{L('FromDate')}: </Text>
                      <Text>
                        {moment(record.event.startDate).format(timingHelper.defaultDateFormat)}
                      </Text>
                      <br />

                      <Text type="secondary">{L('FromHour')}: </Text>
                      <Text>
                        {moment(record.event.fromHour).format(timingHelper.defaultTimeFormat)}
                      </Text>
                      <br />

                      <Text type="secondary">{L('ToDate')}: </Text>
                      <Text>
                        {moment(record.event.endDate).format(timingHelper.defaultDateFormat)}
                      </Text>
                      <br />

                      <Text type="secondary">{L('ToHour')}: </Text>
                      <Text>
                        {moment(record.event.toHour).format(timingHelper.defaultTimeFormat)}
                      </Text>
                      <br />

                      <Text type="secondary">{L('City')}: </Text>
                      <Text>{record.event.cityName}</Text>
                      <br />

                      <Text type="secondary">{L('PlaceName')}: </Text>
                      <Text>{record.event.placeName}</Text>
                      <br />

                      <Text type="secondary">{L('goldenTicketPrice')}: </Text>
                      <Text>{record.event.goldenTicketPrice}</Text>
                      <br />

                      <Text type="secondary">{L('goldenTicketPrice')}: </Text>
                      <Text>{record.event.goldenTotalSeats}</Text>
                      <br />

                      <Text type="secondary">{L('totalAmount')}: </Text>
                      <Text>{record.totalAmount}</Text>
                      <br />

                      <Text type="secondary">{L('TicketsCount')}: </Text>
                      <Text>{record.ticketsCount}</Text>
                      <br />
                    </Card>
                  </Col>
                </Row>
              </>
            ),
            rowExpandable: (record) => true,
          }}
        />

        <WithdrawRequestDetails
          visible={this.state.withdrawModalVisible}
          withdrawData={this.state.withdrawModelItem}
          isGettingData={false}
          onCancel={() => {
            this.setState({
              withdrawModalVisible: false,
            });
          }}
        ></WithdrawRequestDetails>

        <ResetPasswordModal
          formRef={this.resetPasswordFormRef}
          isOpen={this.state.resetPasswordModalVisible}
          userId={this.state.eventOrganizerId}
          onClose={() =>
            this.setState({
              resetPasswordModalVisible: false,
            })
          }
        />
      </Card>
    );
  }
}

export default WithdrawRequestsTickets;
