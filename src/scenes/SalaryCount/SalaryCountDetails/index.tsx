/* eslint-disable */
import * as React from 'react';
import { Tag, Avatar, Tabs } from 'antd';
import {
  InfoCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import ImageModel from '../../../components/ImageModal';
import { L } from '../../../i18next';
import AppComponentBase from '../../../components/AppComponentBase';
import './index.css';
import localization from '../../../lib/localization';
import { BannerDto } from '../../../services/banner/dto/bannerDto';

const { TabPane } = Tabs;

export interface IBannerDetailsModalState {
  bannerModel: BannerDto;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  shopsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  productsTotalCount: number;
  productsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  classificationsTotalCount: number;
  classificationsMeta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  shopsTotalCount: number;

}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

export class BannerDetails extends AppComponentBase<any, IBannerDetailsModalState> {
  state = {
    bannerModel: {} as BannerDto,
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    shops: [],
    products: [],
    classifications: [],
    classificationsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    classificationsTotalCount: 0,
    productsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    productsTotalCount: 0,
    shopsMeta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    shopsTotalCount: 0,
  };


  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }


  render() {
    const { bannerModel } = this.state;

    return (
      <div className="banner-page">
        <span className="back-button">
          {localization.isRTL() ? (
            <ArrowRightOutlined onClick={() => (window.location.href = '/banner')} />
          ) : (
            <ArrowLeftOutlined onClick={() => (window.location.href = '/banner')} />
          )}
        </span>

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
                <span className="detail-label">{L('ArName')}:</span>
                <span className="detail-value">
                  {bannerModel !== undefined ? bannerModel.arTitle : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('EnName')}:</span>
                <span className="detail-value">
                  {bannerModel !== undefined ? bannerModel.enTitle : undefined}
                </span>
              </div>

              <div className="detail-wrapper">
                <span className="detail-label">{L('Status')}:</span>
                <span className="detail-value">
                  {bannerModel !== undefined && bannerModel.isActive ? (
                    <Tag color="green">{L('Active')}</Tag>
                  ) : (
                    <Tag color="red">{L('Inactive')}</Tag>
                  )}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Image')}:</span>
                <span className="detail-value image">
                  {bannerModel !== undefined ? (
                    <div
                      onClick={() =>
                        this.openImageModal(bannerModel.image!, bannerModel.enTitle)
                      }
                      style={{ display: 'inline-block', cursor: 'zoom-in' }}
                    >
                      <Avatar shape="square" size={50} src={bannerModel.image} />
                    </div>
                  ) : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('arDescriptions')}:</span>
                <span className="detail-value">
                  {bannerModel !== undefined ? bannerModel.arDescriptions : undefined}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('enDescriptions')}:</span>
                <span className="detail-value">
                  {bannerModel !== undefined ? bannerModel.enDescriptions : undefined}
                </span>
              </div>
            </div>
          </TabPane>
        </Tabs>

        <ImageModel
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => {
            this.closeImageModal();
          }}
        />
      </div>
    );
  }
}

export default BannerDetails;
