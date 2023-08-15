/* eslint-disable */
import * as React from 'react';
import { Button, Card, Table, Select, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import {
  EditOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import Stores from '../../stores/storeIdentifier';
import SearchComponent from '../../components/SearchComponent';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import { UpdateIndexDto } from '../../services/indexes/dto/updateIndexDto';
import { CreateIndexDto } from '../../services/indexes/dto/createIndexDto';
import { isGranted } from '../../lib/abpUtility';
import ContactStore from '../../stores/contactStore';
import { ContactDto } from '../../services/contactUs/dto/contactDto';

export interface IContactUsProps {
  contactStore?: ContactStore;
}

export interface IContactState {
  contactModalVisible: boolean;
  contactModalId: number;
  contactModalType: string;
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

@inject(Stores.ContactStore)
@observer
export class Banks extends AppComponentBase<IContactUsProps, IContactState> {
  formRef = React.createRef<FormInstance>();

  state = {
    contactModalVisible: false,
    contactModalId: 0,
    contactModalType: 'create',
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
    this.updateContactList(this.state.meta.pageSize, 0);
  }

  async updateContactList(maxResultCount: number, skipCount: number) {
    this.props.contactStore!.maxResultCount = maxResultCount;
    this.props.contactStore!.skipCount = skipCount;
    this.props.contactStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.contactStore!.keyword = this.state.keyword;
    this.props.contactStore!.getAll();
  }

  async openContactModal(input: EntityDto) {
    if (input.id === 0) {
      this.props.contactStore!.contactModel = undefined;
      this.setState({ contactModalType: 'create', contactModalId: input.id });
    } else {
      await this.props.contactStore!.getContact({ id: input.id });
      this.setState({ contactModalType: 'edit', contactModalId: input.id });
    }
    this.setState({ contactModalVisible: !this.state.contactModalVisible });
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
            this.updateContactList(this.state.meta.pageSize, this.state.meta.skipCount);
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
              this.updateContactList(this.state.meta.pageSize, this.state.meta.skipCount);
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

  
  createOrUpdateIndex = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      if (this.state.contactModalId === 0) {
        await this.props.contactStore!.createContact(values as CreateIndexDto);
      } else {
        values.id = this.state.contactModalId;
        await this.props.contactStore!.updateContact(values as UpdateIndexDto);
      }
      await this.updateContactList(this.state.meta.pageSize, this.state.meta.skipCount);
      this.setState({ contactModalVisible: false });
      form!.resetFields();
    });
  };

  indexesTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
        title: L('Name'),
        dataIndex: 'name',
        key: 'name',
    },
    {
      title: L('PhoneNumber'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
        title: L('Email'),
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: L('Message'),
        dataIndex: 'message',
        key: 'message',
    },
    {
        title: L('CreationDate'),
        dataIndex: 'creationDate',
        key: 'creationDate',
    },
    {
      title: L('Action'),
      key: 'action',
      width: '10%',
      render: (text: string, item: ContactDto) => (
        <div>
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon "
                onClick={() => this.openContactModal({ id: item.id })}
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
      this.updateContactList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateContactList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const { contacts } = this.props.contactStore!;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.contactStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Contact')}</span>
          </div>
        }
      >
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateContactList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />

        <Table
          pagination={pagination}
          rowKey={(record) => `${record.id}`}
          style={{ marginTop: '12px' }}
          loading={this.props.contactStore!.loadingContacts}
          dataSource={contacts === undefined ? [] : contacts}
          columns={this.indexesTableColumns}
        />
      </Card>
    );
  }
}

export default Banks;
