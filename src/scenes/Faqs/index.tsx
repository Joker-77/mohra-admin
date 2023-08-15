/* eslint-disable */
import * as React from 'react';
import { Button, Card, Table, Tag, Select, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import {
  EditOutlined,
  PlusOutlined,
  FilterOutlined,
  CheckSquareOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import Stores from '../../stores/storeIdentifier';
import SearchComponent from '../../components/SearchComponent';
import AppComponentBase from '../../components/AppComponentBase';
import { L, getCurrentLanguageISOCode } from '../../i18next';
import localization from '../../lib/localization';
import { EntityDto } from '../../services/dto/entityDto';
import { popupConfirm } from '../../lib/popupMessages';
import { isGranted } from '../../lib/abpUtility';
import { FaqType } from '../../lib/types';
import FaqStore from '../../stores/faqStore';
import { CreateFaqDto, FaqDto, UpdateFaqDto } from '../../services/faqs/dto/FaqDto';
import CreateOrUpdateFaq from './components/createOrUpdateFaq';

export interface IFaqsProps {
  faqStore?: FaqStore;
}

export interface IFaqsState {
  lang: string,
  faqModalVisible: boolean;
  faqModalId: number;
  faqModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    skipCount: number;
    total: number;
  };
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
  };
  isActiveFilter?: boolean;
  keyword?: string;
}

declare let abp: any;
const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.FaqStore)
@observer
export class Faqs extends AppComponentBase<IFaqsProps, IFaqsState> {
  formRef = React.createRef<FormInstance>();

  state = {
    lang: getCurrentLanguageISOCode(),
    faqModalVisible: false,
    faqModalId: 0,
    faqModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      skipCount: 0,
      total: 0,
    },
    permisssionsGranted: {
      update: false,
      create: false,
      activation: false,
    },
    isActiveFilter: undefined,
    keyword: undefined,
  };

  async componentDidMount() {
    this.setState({
      permisssionsGranted: {
        update: isGranted('Indices.Update'),
        create: isGranted('Indices.Create'),
        activation: isGranted('Indices.Activation'),
      },
    });
    this.updateFaqsList(this.state.meta.pageSize, 0);
  }

  async updateFaqsList(maxResultCount: number, skipCount: number) {
    this.props.faqStore!.maxResultCount = maxResultCount;
    this.props.faqStore!.skipCount = skipCount;
    this.props.faqStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.faqStore!.keyword = this.state.keyword;
    this.props.faqStore!.getAll(FaqType.None);
  }

  async openFaqModal(input: EntityDto) {
    if (input.id === 0) {
      this.props.faqStore!.faqModel = undefined;
      this.setState({ faqModalType: 'create', faqModalId: input.id });
    } else {
      await this.props.faqStore!.getFaq({ id: input.id });
      this.setState({ faqModalType: 'edit', faqModalId: input.id });
    }
    this.setState({ faqModalVisible: !this.state.faqModalVisible });
  }

  getColumnStatusSearchProps = () => ({
    filterDropdown: ({ confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Select
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          showSearch
          optionFilterProp="children"
          onChange={(value: any) => {
            this.setState({ isActiveFilter: value === 3 ? undefined : value === 1 });
          }}
          value={this.state.isActiveFilter === undefined ? 3 : !this.state.isActiveFilter ? 0 : 1}
        >
          <Select.Option key={1} value={1}>
            {L('Activated')}
          </Select.Option>
          <Select.Option key={0} value={0}>
            {L('Deactivated')}
          </Select.Option>
          <Select.Option key={3} value={3}>
            {L('All')}
          </Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={async () => {
            confirm();
            this.updateFaqsList(this.state.meta.pageSize, this.state.meta.skipCount);
          }}
          size="small"
          style={{ width: 90, marginRight: 4, marginLeft: 4 }}
        >
          {L('Filter')}
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            this.setState({ isActiveFilter: undefined }, () => {
              this.updateFaqsList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
          size="small"
          style={{ width: 90 }}
        >
          {L('ResetFilter')}
        </Button>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  });

  onSwitchFaqActivation = async (data: FaqDto) => {
    popupConfirm(
      async () => {
        if (data.isActive) await this.props.faqStore!.faqDeactivation({ id: data.id });
        else await this.props.faqStore!.faqActivation({ id: data.id });
        await this.updateFaqsList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      data.isActive
        ? L('AreYouSureYouWantToDeactivateThisFaq')
        : L('AreYouSureYouWantToActivateThisFaq')
    );
  };

  createOrUpdateFaq = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      if (this.state.faqModalId === 0) {
        await this.props.faqStore!.createFaq(values as CreateFaqDto);
      } else {
        values.id = this.state.faqModalId;
        await this.props.faqStore!.updateFaq(values as UpdateFaqDto);
      }
      await this.updateFaqsList(this.state.meta.pageSize, this.state.meta.skipCount);
      this.setState({ faqModalVisible: false });
      form!.resetFields();
    });
  };

  

  faqsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Question'),
      dataIndex: `${this.state.lang}Question`,
      key: `${this.state.lang}Question`,
    },
    {
      title: L('Answer'),
      dataIndex: `${this.state.lang}Answer`,
      key: `${this.state.lang}Answer`,
    },
    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => {
        return (
          <Tag color={isActive ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
            {isActive ? L('Active') : L('Inactive')}
          </Tag>
        );
      },
      ...this.getColumnStatusSearchProps(),
    },
    {
      title: L('Action'),
      key: 'action',
      width: '10%',
      render: (text: string, item: FaqDto) => (
        <div>
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon "
                onClick={() => this.openFaqModal({ id: item.id })}
              />
            </Tooltip>
          ) : null}
          {item.isActive ? (
            this.state.permisssionsGranted.activation ? (
              <Tooltip title={L('Block')}>
                <StopOutlined
                  className="action-icon  red-text"
                  onClick={() => this.onSwitchFaqActivation(item)}
                />
              </Tooltip>
            ) : null
          ) : this.state.permisssionsGranted.activation ? (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchFaqActivation(item)}
              />
            </Tooltip>
          ) : null}
        </div>
      ),
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateFaqsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateFaqsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const { faqs } = this.props.faqStore!;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.faqStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    
    return (
      <Card
        title={
          <div>
            <span>{L('Faqs')}</span>
            {this.state.permisssionsGranted.create ? (
              <Button
                type="primary"
                style={{ float: localization.getFloat(), margin: '0 5px' }}
                icon={<PlusOutlined />}
                onClick={() => this.openFaqModal({ id: 0 })}
              >
                {L('AddFaq')}
              </Button>
            ) : null}
          </div>
        }
      >
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateFaqsList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />

        <Table
          pagination={pagination}
          rowKey={(record) => `${record.id}`}
          style={{ marginTop: '12px' }}
          loading={this.props.faqStore!.loadingFaqs}
          dataSource={faqs === undefined ? [] : faqs}
          columns={this.faqsTableColumns}
        />

        <CreateOrUpdateFaq
          formRef={this.formRef}
          visible={this.state.faqModalVisible}
          onCancel={() =>
            this.setState({
              faqModalVisible: false,
            })
          }
          faqType={FaqType.None}
          modalType={this.state.faqModalType}
          onOk={this.createOrUpdateFaq}
          isSubmittingFaq={this.props.faqStore!.isSubmittingFaq}
          faqStore={this.props.faqStore}
        />
      </Card>
    );
  }
}

export default Faqs;
