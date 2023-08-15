/* eslint-disable */
import * as React from 'react';
import { Button, Card, Table, Tag, Tooltip, Input, Space, Avatar } from 'antd';
import { inject, observer } from 'mobx-react';
import Highlighter from 'react-highlight-words';
import { FormInstance } from 'antd/lib/form';
import {
  EditOutlined,
  PlusOutlined,
  CheckSquareOutlined,
  SearchOutlined,
  StopOutlined,
  DownOutlined,
  UpOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import CreateOrUpdateBanner from './components/createOrUpdateBanner';
import localization from '../../lib/localization';
import BannerStore from '../../stores/bannerStore';
import { BannerDto } from '../../services/banner/dto/bannerDto';
import { CreateBannerDto } from '../../services/banner/dto/createBannerDto';
import { UpdateBannerDto } from '../../services/banner/dto/updateBannerDto';
import { popupConfirm } from '../../lib/popupMessages';
import { IsActive } from './IsActive';
import ImageModel from '../../components/ImageModal';
import moment from 'moment';
import timingHelper from '../../lib/timingHelper';
export const fallBackImage =
  'data:image/png;base64,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';


export interface IBannersProps {
  bannerStore?: BannerStore;
}

export interface IBannersState {
  changeStatusModalVisible: boolean;
  bannerModalVisible: boolean;
  bannersModalId: number;
  bannerModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
    delete: boolean;
  };
  statusFilter?: number;
  keyword?: string;
  openSortBannersModal: boolean;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  bannerModalId: number;
  bannerModalOldStatus: number;
  searchedColumns: string[];
}


const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

declare let abp: any;
@inject(Stores.BannerStore)
@observer
export class Banner extends AppComponentBase<IBannersProps, IBannersState> {
  formRef = React.createRef<FormInstance>();

  currentUser: any = undefined;

  searchInput: any = null;

  state = {
    bannerModalVisible: false,
    bannersModalId: 0,
    bannerDetailsModalVisible: false,
    bannerModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    permisssionsGranted: {
      update: false,
      create: false,
      activation: false,
      delete: false,
    },
    statusFilter: undefined,
    keyword: '',
    openSortBannersModal: false,
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    changeStatusModalVisible: false,
    bannerModalId: 0,
    bannerModalOldStatus: 0,
    searchedColumns: [],
  };

  async componentDidMount(): Promise<void> {
    this.setState({
      permisssionsGranted: {
        update: this.isGranted('Challenges.Update'),
        create: this.isGranted('Challenges.Create'),
        activation: this.isGranted('Challenges.Activation'),
        delete: this.isGranted('Challenges.Delete'),
      },
    });
    await this.props.bannerStore?.getBanners();
  }

  async openBannerModal(entityDto: EntityDto): Promise<void> {
    if (entityDto.id === 0) {
      this.props.bannerStore!.bannerModel = undefined;
      this.setState({ bannerModalType: 'create' });
    } else {
      await this.props.bannerStore?.getBanner(entityDto);
      this.setState({ bannerModalType: 'edit' });
    }
    this.setState({
      bannerModalVisible: !this.state.bannerModalVisible,
      bannersModalId: entityDto.id,
    });
  }

  compare = (a: any, b: any) => {
    if (a.order < b.order) {
      return -1;
    }
    if (a.order > b.order) {
      return 1;
    }
    return 0;
  };


  createOrUpdateBanner = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.imageUrl = document.getElementById('banner-image')!.getAttribute('value')
        ? document.getElementById('banner-image')!.getAttribute('value')
        : this.props.bannerStore?.bannerModel?.image;
      if (this.state.bannersModalId === 0) {
        await this.props.bannerStore?.createBanner(values as CreateBannerDto);
      } else {
        values.id = this.state.bannersModalId;
        await this.props.bannerStore?.updateBanner(values as UpdateBannerDto);
      }
      this.setState({ bannerModalVisible: false });
      form!.resetFields();
    });
  };

  onSwitchBannerActivation = async (item: BannerDto): Promise<void> => {
    popupConfirm(
      async () => {
        if (item.isActive) {
          await this.props.bannerStore?.bannerDeactivation({ id: item.id });
        } else await this.props.bannerStore?.bannerActivation({ id: item.id });
      },
      item.isActive
        ? L('AreYouSureYouWantToDeactivateThisBanner')
        : L('AreYouSureYouWantToActivateThisBanner')
    );
  };

  handleSearch = (_selectedKeys: any, confirm: any, _dataIndex: any) => {
    confirm();
  };

  handleReset = (clearFilters: any) => {
    clearFilters();
    this.setState({ keyword: '' });
  };

  getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            this.setState({
              keyword: `${dataIndex} ${e.target.value};`,
              searchedColumns: [...this.state.searchedColumns, dataIndex],
            });
          }}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button> */}
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text: any) =>
      this.state.keyword.split(';').some((e) => e.split(' ')[0] === dataIndex) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[
            this.state.keyword
              .split(';')
              .filter((e) => e.split(' ')[0] === dataIndex)[0]
              .split(' ')[1],
          ]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  onDeleteBanner = async (input: EntityDto) => {

    popupConfirm(async () => {
      await this.props.bannerStore!.deleteBanner({ id: input.id });
      await this.props.bannerStore?.getBanners();
    }, L('AreYouSureYouWantToDeleteThisBanner'));
  };

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  bannersTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Order'),
      dataIndex: 'displayOrder',
      key: 'displayOrder',
    },
    {
      title: L('Target'),
      dataIndex: 'target',
      key: 'target',
    },
    {
      title: L('Title'),
      dataIndex: 'enTitle',
      key: 'enTitle',
    },
    {
      title: L('Image'),
      dataIndex: 'image',
      key: 'image',
      render: (image: any, item: BannerDto) => {
        return (
          <div
            onClick={() => this.openImageModal(item.image!, 'banner')}
            style={{ display: 'inline-block', cursor: 'zoom-in' }}
          >
            <Avatar shape="square" size={50} src={item.image} />
          </div>
        );
      },

    },

    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (status: boolean) => {
        switch (+status) {
          case IsActive.Inactive:
            return (
              <Tag color="red" className="ant-tag-disable-pointer">
                {L('Inactive')}
              </Tag>
            );
          case IsActive.Active:
            return (
              <Tag color="green" className="ant-tag-disable-pointer">
                {L('Active')}
              </Tag>
            );
        }
        return null;
      },
    },
    {
      title: L('Action'),
      key: 'action',
      render: (_text: string, item: BannerDto) => (
        <div>
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon"
                onClick={() => this.openBannerModal({ id: item.id })}
              />
            </Tooltip>
          ) : null}
          {item.isActive ? (
            this.state.permisssionsGranted.activation ? (
              <Tooltip title={L('Deactivate')}>
                <StopOutlined
                  className="action-icon  red-text"
                  onClick={() => this.onSwitchBannerActivation(item)}
                />
              </Tooltip>
            ) : null
          ) : this.state.permisssionsGranted.activation ? (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchBannerActivation(item)}
              />
            </Tooltip>
          ) : null}

          {
            this.state.permisssionsGranted.delete ? (
              <Tooltip title={L('Delete')}>
                <DeleteOutlined
                  className="action-icon  red-text"
                  onClick={() => this.onDeleteBanner({ id: item.id })}
                />
              </Tooltip>
            ) : null
          }
        </div>
      ),
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (_page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      // this.updateBannersList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      // await this.updateBannersList(
      //   this.state.meta.pageSize,
      //   (page - 1) * this.state.meta.pageSize
      // );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const newsBanners = this.props.bannerStore?.banner;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.bannerStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    console.log("newsBanners");
    console.log(newsBanners);
    return (
      <Card
        title={
          <div>
            <span>{L('Banners')}</span>
            {this.state.permisssionsGranted.create ? (
              <Button
                type="primary"
                style={{
                  float: localization.getFloat(),
                  margin: localization.getFloat() === 'left' ? '0' : '0',
                }}
                icon={<PlusOutlined />}
                onClick={() => this.openBannerModal({ id: 0 })}
              >
                {L('AddBanner')}
              </Button>
            ) : null}
          </div>
        }
      >
        <Table
          pagination={pagination}
          rowKey={(record) => `${record.id}`}
          style={{ marginTop: '12px' }}
          loading={this.props.bannerStore?.loadingbanners}
          dataSource={newsBanners || []}
          columns={this.bannersTableColumns}
          expandable={{
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <UpOutlined className="expand-icon" onClick={(e) => onExpand(record, e)} />
              ) : (
                <DownOutlined className="expand-icon" onClick={(e) => onExpand(record, e)} />
              ),
            expandedRowRender: (record) => (
              <p className="expanded-row" style={{ margin: 0 }}>
                <span>
                  <b>{L('Target')}: </b>
                  {record.target}
                </span>

                <span>
                  <b>{L('externalLink')}:</b>{' '}
                  {moment(record.externalLink).format(timingHelper.defaultDateFormat)}
                </span>
                <span>
                  <b>{L('arTitle')}:</b> {record.arTitle}
                </span>
              </p>
            ),
            rowExpandable: (record) => true,
          }}
        />

        <CreateOrUpdateBanner
          formRef={this.formRef}
          visible={this.state.bannerModalVisible}
          onCancel={() =>
            this.setState({
              bannerModalVisible: false,
            })
          }
          modalType={this.state.bannerModalType}
          onOk={this.createOrUpdateBanner}
          isSubmittingBanner={this.props.bannerStore!.isSubmittingBanner}
          bannerStore={this.props.bannerStore}
        />
        {console.log("bannerStore")}
        {console.log(this.props.bannerStore)}
        <ImageModel
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => {
            this.closeImageModal();
          }}
        />
      </Card>
    );
  }
}

export default Banner;
