/* eslint-disable */
import * as React from 'react';
import { Button, Card, Table, Select, Tag, Image, Row, Col, Tooltip, Upload } from 'antd';
import type { UploadProps } from 'antd';

import { inject, observer } from 'mobx-react';
import {
  EyeOutlined,
  CheckSquareOutlined,
  PlusOutlined,
  StopOutlined,
  StarOutlined,
  StarFilled,
  EditOutlined,
  UpOutlined,
  DownOutlined,
  UploadOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import ProductStore from '../../stores/productStore';
import { ProductDto, CreateProductDto, UpdateProductDto, CreateBulkProductsDto } from '../../services/products/dto';
import { popupConfirm } from '../../lib/popupMessages';
import utils from '../../utils/utils';
import { EntityDto } from '../../services/dto/entityDto';
import ThousandSeparator from '../../components/ThousandSeparator';
import SearchComponent from '../../components/SearchComponent';
import { LiteEntityDto } from '../../services/locations/dto/liteEntityDto';
import categoriesService from '../../services/categories/categoriesService';
import classificationsService from '../../services/classifications/classificationsService';
import shopsService from '../../services/shops/shopsService';
import FilterationBox from '../../components/FilterationBox';
import SizeService from '../../services/size/sizeService';
import ColorService from '../../services/color/colorService';
import CreateOrUpdateProducts from './components/CreateOrUpdateProducts';
import timingHelper from '../../lib/timingHelper';
import ProductDetails from './components/ProductDetails';
import './index.less';
import { read, utils as UT } from 'xlsx';
import ExcellentExport from 'excellentexport';
import localization from '../../lib/localization';
import { ShopDto } from '../../services/shops/dto/shopDto';



export interface IProductsProps {
  productStore: ProductStore;
}

const filterationColLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 7 },
  xl: { span: 7 },
  xxl: { span: 7 },
};

const filterationColLayout2 = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 9, offset: 2 },
  lg: { span: 7, offset: 1 },
  xl: { span: 7, offset: 1 },
  xxl: { span: 7, offset: 1 },
};
export interface IProductsState {
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  productDetailsModalVisible: boolean;
  permissionsGranted: {
    activation: boolean;
    create: boolean;
    update: boolean;
  };

  keyword?: string;
  classificationFilter?: number;
  categoryFilter?: number;
  shopFilter?: number;
  type?: number;
  isActiveFilter?: boolean;
  featuredFilter?: boolean;
  hasOfferFilter?: boolean;
  productModalVisible: boolean;
  productModalId: number;
  productModalType: string;
  openSortProductsModal: boolean;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.ProductStore)
@observer
export class Products extends AppComponentBase<IProductsProps, IProductsState> {
  categories: LiteEntityDto[] = [];

  classifications: LiteEntityDto[] = [];

  colors: LiteEntityDto[] = [];

  sizes: LiteEntityDto[] = [];

  shops: LiteEntityDto[] = [];

  sizesColor: LiteEntityDto[] = [];

  shopsData: ShopDto[] = [];
  // state object
  state = {
    productModalVisible: false,
    productModalId: 0,
    productModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    productDetailsModalVisible: false,
    permissionsGranted: {
      activation: false,
      create: false,
      update: false,
    },
    keyword: undefined,
    classificationFilter: undefined,
    categoryFilter: undefined,
    shopFilter: undefined,
    isActiveFilter: undefined,
    featuredFilter: undefined,
    hasOfferFilter: undefined,
    type: undefined,
    openSortProductsModal: false,
  };

  

  // get all catagories and classifications and shops and permissions
  async componentDidMount(): Promise<void> {
    const [catagories, classifications, shops, activation, create, update, sizes, colors, shopsData] =
      await Promise.all([
        categoriesService.getAllLite(),
        classificationsService.getAllLite(),
        shopsService.getAllLite({ isActive: true, maxResultCount: 1000 }),
        utils.checkIfGrantedPermission('Products.Activation'),
        utils.checkIfGrantedPermission('Products.Create'),
        utils.checkIfGrantedPermission('Products.Update'),
        SizeService.getAllLite(),
        ColorService.getAllLite(),
        shopsService.getAll({ maxResultCount: 1000 }),
      ]);

    this.categories = catagories?.items;
    this.classifications = classifications?.items;
    this.shops = shops?.items;
    this.colors = colors?.items;
    this.sizes = sizes?.items;
    this.sizesColor = [...sizes?.items, ...colors?.items];
    this.shopsData = shopsData?.items;
    
    this.setState({
      permissionsGranted: {
        activation: activation.valueOf(),
        create: create.valueOf(),
        update: update.valueOf(),
      },
    });
    this.updateProductsList(this.state.meta.pageSize, 0);
  }

  // open Product Details Modal
  async openProductDetailsModal(entityDto: EntityDto): Promise<void> {
    await this.props.productStore!.getProduct(entityDto);
    this.setState({ productDetailsModalVisible: true });
  }

  // open Product create or update Modal
  async openProductModal(input: EntityDto): Promise<void> {
    if (input.id === 0) {
      this.props.productStore!.productModel = undefined;
      this.setState({ productModalType: 'create', productModalId: input.id });
    } else {
      await this.props.productStore!.getProduct({ id: input.id });
      this.setState({ productModalType: 'update', productModalId: input.id });
    }
    this.setState({ productModalVisible: !this.state.productModalVisible });
  }

  async uploadListProducts(input: Array<CreateBulkProductsDto>): Promise<void> {
    this.props.productStore!.createBulkProducts(input);
    // let result = this.props.productStore!.createBulkProducts(input);
    // await this.updateProductsList(this.props.productStore!.maxResultCount, this.props.productStore!.skipCount);
  }


  // update products list
  async updateProductsList(
    maxResultCount: number,
    skipCount: number,
    sorting?: string
  ): Promise<void> {
    const {
      keyword,
      shopFilter,
      isActiveFilter,
      categoryFilter,
      classificationFilter,
      featuredFilter,
      hasOfferFilter,
    } = this.state;
    this.props.productStore!.maxResultCount = maxResultCount;
    this.props.productStore!.skipCount = skipCount;
    this.props.productStore!.keyword = keyword;
    this.props.productStore!.shopFilter = shopFilter;
    this.props.productStore!.categoryFilter = categoryFilter;
    this.props.productStore!.classificationFilter = classificationFilter;
    this.props.productStore!.featuredFilter = featuredFilter;
    this.props.productStore!.hasOfferFilter = hasOfferFilter;
    this.props.productStore!.isActiveFilter = isActiveFilter;
    this.props.productStore!.sorting = sorting;
    this.props.productStore!.getProducts();
  }


  importExcel: UploadProps = {
    beforeUpload: (file) => {

      console.log('before Upload');
      const reader = new FileReader();
      reader.onload = (e) => {
        //console.log('onload');
        const alldata = e.target?.result;
        const wb = read(alldata);
        const data = UT.sheet_to_json<CreateBulkProductsDto>(wb.Sheets[wb.SheetNames[0]]);
        //console.log(data);
        this.uploadListProducts(data);
      };

      reader.onerror = (err) => {
        console.log(err);
      };

      reader.readAsArrayBuffer(file);
    },
    accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    onChange: (info) => {

      // if (info.file.status !== 'uploading') {
      //   console.log(info.file, info.fileList);
      // }

      // if (info.file.status === 'done') {
      //   message.success(`${info.file.name} file uploaded successfully`);
      // } else if (info.file.status === 'error') {
      //   message.error(`${info.file.name} file upload failed.`);
      // }
    }
  };

  // handle product activation
  onSwitchProductActivation = async (product: ProductDto): Promise<void> => {
    popupConfirm(
      async () => {
        if (product.isActive) {
          await this.props.productStore!.productDeactivation({ id: product.id });
        } else await this.props.productStore!.productActivation({ id: product.id });
        await this.updateProductsList(this.state.meta.pageSize, 0);
      },
      product.isActive
        ? L('AreYouSureYouWantToDeactivateThisProduct')
        : L('AreYouSureYouWantToActivateThisProduct')
    );
  };

  // handle product featured
  onSwitchProductFeature = async (product: ProductDto): Promise<void> => {
    popupConfirm(
      async () => {
        if (product.isFeatured) await this.props.productStore!.productUnFeature({ id: product.id });
        else await this.props.productStore!.productFeature({ id: product.id });
        await this.updateProductsList(this.state.meta.pageSize, 0);
      },
      product.isActive
        ? L('AreYouSureYouWantToFeatureThisProduct')
        : L('AreYouSureYouWantToUnFeatureThisProduct')
    );
  };

  // handle change of sorter
  handleTableChange = (_1: any, _2: any, sorter: any): void => {
    if (sorter.order === 'ascend') {
      this.updateProductsList(this.state.meta.pageSize, 0, `${sorter.columnKey} ASC`);
    } else if (sorter.order === 'descend') {
      this.updateProductsList(this.state.meta.pageSize, 0, `${sorter.columnKey} DESC`);
    } else {
      this.updateProductsList(this.state.meta.pageSize, 0);
    }
  };



  // product table columns
  productsTableColumns = [
    {
      title: L('Number'),
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string): JSX.Element => (
        <Image
          width={50}
          height={50}
          style={{ objectFit: 'cover' }}
          src={imageUrl}
          alt={L('Image')}
        />
      ),
    },
    {
      title: `${L('Price')}(${L('SAR')})`,
      dataIndex: 'price',
      key: 'Price',
      sorter: true,
      render: (price?: number): JSX.Element | '' => {
        return price != null ? <ThousandSeparator number={price} /> : '';
      },
    },

    {
      title: L('soldCount'),
      dataIndex: 'soldCount',
      key: 'TopSelling',
      sorter: true,
    },
    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean): JSX.Element => (
        <Tag color={isActive ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
          {isActive ? L('Active') : L('Inactive')}
        </Tag>
      ),
    },

    {
      title: L('Action'),
      key: 'action',
      render: (_: any, item: ProductDto): JSX.Element => (
        <div>
          {this.state.permissionsGranted.update && (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon"
                onClick={() => this.openProductModal({ id: item?.id })}
              />
            </Tooltip>
          )}
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon "
              onClick={() => this.openProductDetailsModal({ id: item.id })}
            />
          </Tooltip>
          {this.state.permissionsGranted.activation && item.isActive && (
            <Tooltip title={L('Deactivate')}>
              <StopOutlined
                className="action-icon  red-text"
                onClick={() => this.onSwitchProductActivation(item)}
              />
            </Tooltip>
          )}
          {this.state.permissionsGranted.activation && !item.isActive && (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchProductActivation(item)}
              />
            </Tooltip>
          )}
          {this.state.permissionsGranted.update && item.isFeatured && (
            <Tooltip title={L('SetNotFeature')}>
              <StarOutlined
                className="action-icon  red-text"
                onClick={() => this.onSwitchProductFeature(item)}
              />
            </Tooltip>
          )}
          {this.state.permissionsGranted.update && !item.isFeatured && (
            <Tooltip title={L('SetFeature')}>
              <StarFilled
                className="action-icon  green-text"
                onClick={() => this.onSwitchProductFeature(item)}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  // handle submit create or update product
  onOk = async (values: CreateProductDto | UpdateProductDto): Promise<void> => {
    const { productModalType } = this.state;
    if (productModalType === 'update') {
      await this.props.productStore!.updateProduct(values as UpdateProductDto);
    } else {
      await this.props.productStore!.createProduct(values);
    }
    this.props.productStore.productModel = undefined;
  };




  // product table pagination options
  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateProductsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateProductsList(
        this.state.meta.pageSize,
        (page - 1) * this.state.meta.pageSize
      );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const { products, isGettingData, productModel, isSubmittingProduct } = this.props.productStore!;
    const {
      productModalVisible,
      productModalType,
      permissionsGranted: { create },
      productDetailsModalVisible,
    } = this.state;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.productStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        className="product-page"
        title={
          <>
            <div className="page-head">
              <span>{L('Products')}</span>
              {create && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => this.openProductModal({ id: 0 })}
                >
                  {L('AddProduct')}
                </Button>
              )} {(

                <Upload {...this.importExcel} showUploadList={false}>
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
              )}
              {(
                <a
                  download="Proc.xlsx"
                  className="ant-btn ant-btn-default export-btn"
                  style={{ float: localization.getFloat() }}
                  id="export"
                  href="#"
                  onClick={() => {
                    return ExcellentExport.convert(
                      {
                        anchor: document.getElementById('export') as HTMLAnchorElement,
                        filename: 'Proc',
                        format: 'xlsx',
                      },
                      [
                        {
                          name: "Sheet1",
                          from: { table: document.getElementById('datatablesProduct') as HTMLTableElement },
                        },
                        {
                          name: "Sizes",
                          from: { table: document.getElementById('datatablesize') as HTMLTableElement },
                        },
                        {
                          name: "Shop",
                          from: { table: document.getElementById('datatableshop') as HTMLTableElement },
                        },
                        {
                          name: "Classification",
                          from: { table: document.getElementById('datatableclassification') as HTMLTableElement },
                        },
                        {
                          name: "Categories",
                          from: { table: document.getElementById('datatablecategories') as HTMLTableElement },
                        }
                      ]
                    );
                  }}>
                  <FileExcelOutlined /> {L('ExportSampleExcel')}
                </a>
              )}
              {/* {(
                <a
                  download="categories.xlsx"
                  className="ant-btn ant-btn-default export-btn"
                  style={{ float: localization.getFloat() }}
                  id="export"
                  href="#"
                  onClick={() => {                                      
                    const ws = UT.json_to_sheet(this.categories);
                    const wb = UT.book_new();
                    UT.book_append_sheet(wb, ws, "Data");
                    writeFile(wb, "categories.xlsx");
                  }}
                >
                  <FileExcelOutlined /> {L('ExportCategoriesToExcel')}
                </a>
              )} */}
            </div>
          </>
        }
      >
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateProductsList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />
        <table id="datatablesProduct" style={{ display: 'none' }}>
          <thead>
            <tr>
              <td>Number</td>
              <td>ArName</td>
              <td>EnName</td>
              <td>ImageUrl</td>
              <td>ShopId</td>
              <td>ArDescription</td>
              <td>EnDescription</td>
              <td>ClassificationId</td>
              <td>AvailableStock</td>
              <td>Price</td>
              <td>Quantity</td>
              <td>ColorId</td>
              <td>SizeId</td>
              <td>Attributes</td>
              <td>Gallery</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>555555</td>
              <td>تجربه</td>
              <td>test</td>
              <td>https://mohraapp.com:9090/Uploads/Images/Image-2b120ac3-59de-44de-b486-cb3f888a7d1a.jpg</td>
              <td>41</td>
              <td>الوصف</td>
              <td>Description</td>
              <td>8</td>
              <td>1</td>
              <td>23</td>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>
                address:egypt,
                name:mohamed,
              </td>
              <td>https://mohraapp.com:9090/Uploads/Images/Image-aaf6212f-4939-4d3d-b195-4a7fe61f9e88.jpg,https://mohraapp.com:9090/Uploads/Images/Image-aaf6212f-4939-4d3d-b195-4a7fe61f9e88.jpg</td>
            </tr>
          </tbody>
        </table>
        <table id="datatablesize" style={{ display: 'none' }}>
          <thead>
            <tr>
              <td>{L('ID')}</td>
              <td>EnName</td>
            </tr>
          </thead>
          <tbody>
          {this.sizesColor &&this.sizesColor.length > 0 &&
              this.sizesColor.map((element: LiteEntityDto, index: number) => {
                return (
                  <tr key={index}>
                    <td>{Number(element.value)}</td>
                    <td>{element.text}</td>
                  </tr>
                );
          })}
          </tbody>
        </table>
        <table id="datatableshop" style={{ display: 'none' }}>
          <thead>
            <tr>
              <td>{L('ID')}</td>
              <td>EnName</td>
              <td>ArName</td>
            </tr>
          </thead>
          <tbody>
          {this.shopsData &&this.shopsData.length > 0 &&
              this.shopsData.map((shop: ShopDto, index: number) => {
                return (
                  <tr key={index}>
                    <td>{shop.id}</td>
                    <td>{shop.enName}</td>
                    <td>{shop.arName}</td>
                  </tr>
                );
          })}
          </tbody>
        </table>
        <table id="datatableclassification" style={{ display: 'none' }}>
          <thead>
            <tr>
              <td>{L('ID')}</td>
              <td>EnName</td>
            </tr>
          </thead>
          <tbody>
          {this.classifications &&this.classifications.length > 0 &&
              this.classifications.map((element: LiteEntityDto, index: number) => {
                return (
                  <tr key={index}>
                    <td>{Number(element.value)}</td>
                    <td>{element.text}</td>
                  </tr>
                );
          })}
          </tbody>
        </table>
        <table id="datatablecategories" style={{ display: 'none' }}>
          <thead>
            <tr>
              <td>{L('ID')}</td>
              <td>EnName</td>
            </tr>
          </thead>
          <tbody>
          {this.categories &&this.categories.length > 0 &&
              this.categories.map((element: LiteEntityDto, index: number) => {
                return (
                  <tr key={index}>
                    <td>{Number(element.value)}</td>
                    <td>{element.text}</td>
                  </tr>
                );
          })}
          </tbody>
        </table>
        <FilterationBox>
          <Row>
            <Col {...filterationColLayout}>
              <label>{L('CategoryName')}</label>

              <Select
                style={{ display: 'block' }}
                showSearch
                allowClear
                placeholder={L('PleaseSelectCategory')}
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.categoryFilter}
                onChange={(value: any) => {
                  this.setState({ categoryFilter: value });
                }}
              >
                {this.categories.length > 0 &&
                  this.categories.map((element: LiteEntityDto) => (
                    <Select.Option key={element.value} value={element.value}>
                      {element.text}
                    </Select.Option>
                  ))}
              </Select>
            </Col>

            <Col {...filterationColLayout2}>
              <label>{L('ClassificationName')}</label>

              <Select
                style={{ display: 'block' }}
                showSearch
                allowClear
                placeholder={L('PleaseSelectClassification')}
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.classificationFilter}
                onChange={(value: any) => {
                  this.setState({ classificationFilter: value });
                }}
              >
                {this.classifications?.length > 0 &&
                  this.classifications?.map((element: LiteEntityDto) => (
                    <Select.Option key={element?.value} value={element?.value}>
                      {element?.text}
                    </Select.Option>
                  ))}
              </Select>
            </Col>

            <Col {...filterationColLayout2}>
              <label>{L('ShopName')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                allowClear
                placeholder={L('PleaseSelectShop')}
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.shopFilter}
                onChange={(value: any) => {
                  this.setState({ shopFilter: value });
                }}
              >
                {this.shops?.length > 0 &&
                  this.shops?.map((element: LiteEntityDto) => (
                    <Select.Option key={element?.value} value={element?.value}>
                      {element?.text}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
            {/* HasOffer */}
            <Col {...filterationColLayout} style={{ marginTop: '15px' }}>
              <label>{L('IsActive')}</label>

              <Select
                style={{ display: 'block' }}
                showSearch
                optionFilterProp="children"
                onChange={(value: number) => {
                  this.setState({
                    isActiveFilter: value === 3 ? undefined : value === 1,
                  });
                }}
                value={
                  this.state.isActiveFilter === undefined ? 3 : !this.state.isActiveFilter ? 0 : 1
                }
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
            </Col>
            {/* is featured filter */}
            <Col {...filterationColLayout2} style={{ marginTop: '15px' }}>
              <label>{L('isFeatured')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                optionFilterProp="children"
                onChange={(value: number) => {
                  this.setState({
                    featuredFilter: value === 3 ? undefined : value === 1,
                  });
                }}
                value={this.state.featuredFilter === undefined ? 3 : 1}
              >
                <Select.Option key={1} value={1}>
                  {L('Yes')}
                </Select.Option>
                <Select.Option key={3} value={3}>
                  {L('All')}
                </Select.Option>
              </Select>
            </Col>
            {/* has offer filter */}
            {/* <Col {...filterationColLayout2} style={{ marginTop: '15px' }}>
              <label>{L('hasOffer')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                optionFilterProp="children"
                onChange={(value: number) => {
                  this.setState({
                    hasOfferFilter: value === 3 ? undefined : value === 1,
                  });
                }}
                value={this.state.hasOfferFilter === undefined ? 3 : 1}
              >
                <Select.Option key={1} value={1}>
                  {L('Yes')}
                </Select.Option>
                <Select.Option key={3} value={3}>
                  {L('All')}
                </Select.Option>
              </Select>
            </Col> */}
          </Row>
          <Row style={{ marginTop: '15px' }}>
            <Button
              type="primary"
              onClick={async () => {
                await this.updateProductsList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
              style={{ width: 90 }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState(
                  {
                    isActiveFilter: undefined,
                    classificationFilter: undefined,
                    categoryFilter: undefined,
                    shopFilter: undefined,
                    featuredFilter: undefined,
                    hasOfferFilter: undefined,
                  },
                  async () => {
                    await this.updateProductsList(
                      this.state.meta.pageSize,
                      this.state.meta.skipCount
                    );
                  }
                );
              }}
              style={{ width: 90, marginRight: 4, marginLeft: 4 }}
            >
              {L('ResetFilter')}
            </Button>
          </Row>
        </FilterationBox>
        <Table
          onChange={this.handleTableChange}
          pagination={pagination}
          rowKey={(record) => `${record.id}`}
          style={{ marginTop: '12px' }}
          loading={this.props.productStore!.loadingProducts}
          dataSource={products === undefined ? [] : products}
          columns={this.productsTableColumns}
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
                  <b>{L('ShopName')}: </b>
                  {record.shop?.name}
                </span>

                <span>
                  <b>{L('SubCategoryName')}: </b>
                  {record.classificationName}
                </span>
                <span>
                  <b>{L('rate')}: </b>
                  {record.rate}
                </span>

                <span>
                  <b>{L('IsFeatured')}: </b>
                  <Tag
                    color={record.isFeatured ? 'green' : 'volcano'}
                    className="ant-tag-disable-pointer"
                  >
                    {record.isFeatured ? L('Featured') : L('Unfeatured')}
                  </Tag>
                </span>

                <span>
                  <b> {L('CreationDate')}: </b>
                  {moment(record.creationTime).format(timingHelper.defaultDateFormat)}
                </span>
              </p>
            ),
            rowExpandable: (record) => true,
          }}
        />

        <CreateOrUpdateProducts
          colors={this.colors}
          sizes={this.sizes}
          visible={productModalVisible}
          onCancel={() =>
            this.setState({
              productModalVisible: false,
            })
          }
          isGettingData={isGettingData}
          onOk={this.onOk}
          modalType={productModalType}
          isSubmittingProduct={isSubmittingProduct}
          classifications={this.classifications}
          shops={this.shops}
          productData={productModel}
        />

        <ProductDetails
          visible={productDetailsModalVisible}
          onCancel={() => {
            this.setState({
              productDetailsModalVisible: false,
            });
            this.props!.productStore.productModel = undefined;
          }}
          productData={productModel}
          isGettingData={isGettingData}
        />
      </Card>
    );
  }
}

export default Products;
