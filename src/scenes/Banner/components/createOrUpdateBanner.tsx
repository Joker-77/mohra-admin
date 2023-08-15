/* eslint-disable */
import * as React from 'react';
import { Form, Modal, Button, Input, Row, Col, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import { inject, observer } from 'mobx-react';
import Stores from '../../../stores/storeIdentifier';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import BannerStore from '../../../stores/bannerStore';
import { ImageAttr } from '../../../services/dto/imageAttr';
import EditableImage from '../../../components/EditableImage';
import { BannerType } from '../../../lib/types';


export interface ICreateOrUpdateBannerProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  bannerStore?: BannerStore;
  onOk: () => void;
  isSubmittingBanner: boolean;
  formRef: React.RefObject<FormInstance>;
}

export interface ICreateOrUpdateBannerState {
  arName: { value: string; validateStatus?: string; errorMsg: string | null };
  enTitle: { value: string; validateStatus?: string; errorMsg: string | null };
  enDescriptions: { value: string; validateStatus?: string; errorMsg: string | null };
  arDescriptions: { value: string; validateStatus?: string; errorMsg: string | null };
  image: Array<ImageAttr>;
  displayOrder: { value: number };
  target: { value: number };
  targetId: {value: string};
  externalLink: {value: string};
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 8 },
    xl: { span: 8 },
    xxl: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 16 },
  },
};

const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};

@inject(Stores.BannerStore)
@observer
class CreateOrUpdateBanner extends React.Component<
  ICreateOrUpdateBannerProps,
  ICreateOrUpdateBannerState
> {
  formRef = React.createRef<FormInstance>();

  state = {
    arName: { value: '', validateStatus: undefined, errorMsg: null },
    enTitle: { value: '', validateStatus: undefined, errorMsg: null },
    enDescriptions: { value: '', validateStatus: undefined, errorMsg: null },
    arDescriptions: { value: '', validateStatus: undefined, errorMsg: null },
    image: [],
    displayOrder: { value: 0 },
    target: { value: 0 },
    targetId : {value : ''},
    externalLink : {value : ''},
  };

  componentDidUpdate() {
    const { bannerModel } = this.props.bannerStore!;
    console.log("bannerModel");
    console.log(bannerModel);
    if (
      this.state.image.length === 0 &&
      bannerModel !== undefined &&
      bannerModel.image !== null
    ) {
      this.setState({
        image: [
          {
            uid: 1,
            name: `bannerImage.png`,
            status: 'done',
            url: bannerModel.image,
            thumbUrl: bannerModel.image,
          },
        ],
      });
    }

    if (bannerModel === undefined && this.state.image.length > 0) {
      this.setState({ image: [] });
    }
    if (
      bannerModel !== undefined &&
      bannerModel.image !== null &&
      this.state.image.length > 0 &&
      this.state.image[0]['url'] !== bannerModel.image
    ) {
      this.setState({ image: [] });
    }
  }

  handleSubmit = async () => {
    await this.props.onOk();
  };

  validateArTitle = (value: string) => {
    let reqex = /^[\u0600-\u06FF0-9\s.\-_()+]+$/;
    if (value !== '' && !reqex.test(value)) {
      return {
        validateStatus: 'warning',
        errorMsg: L('YouAreWritingEnglishSymbols'),
      };
    }
    if (value !== '') {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }

    return {
      validateStatus: 'error',
      errorMsg: L('ThisFieldIsRequired'),
    };
  };

  validateEnTitle = (value: string) => {
    let reqex = /^[A-Za-z0-9\s.\-_()+]+$/;
    if (value !== '' && !reqex.test(value)) {
      return {
        validateStatus: 'warning',
        errorMsg: L('YouAreWritingArabicSymbols'),
      };
    }
    if (value !== '') {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: L('ThisFieldIsRequired'),
    };
  };

  validateArDesc = (value: string) => {
    let reqex = /^[A-Za-z0-9\s.\-_()+]+$/;
    if (value !== '' && !reqex.test(value)) {
      return {
        validateStatus: 'warning',
        errorMsg: L('YouAreWritingArabicSymbols'),
      };
    }
    if (value !== '') {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: L('ThisFieldIsRequired'),
    };
  };

  validateEnDesc = (value: string) => {
    let reqex = /^[A-Za-z0-9\s.\-_()+]+$/;
    if (value !== '' && !reqex.test(value)) {
      return {
        validateStatus: 'warning',
        errorMsg: L('YouAreWritingArabicSymbols'),
      };
    }
    if (value !== '') {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: L('ThisFieldIsRequired'),
    };
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  onArChange = (e: any) => {
    let value = e.target.value;
    this.setState({ arName: { ...this.validateArTitle(value), value } });
  };

  onEnChange = (e: any) => {
    let value = e.target.value;
    this.setState({ enTitle: { ...this.validateEnTitle(value), value } });
  };

  onDescEnChange = (e: any) => {
    let value = e.target.value;
    this.setState({ enDescriptions: { ...this.validateEnDesc(value), value } });
  };

  onDescArChange = (e: any) => {
    let value = e.target.value;
    this.setState({ arDescriptions: { ...this.validateArDesc(value), value } });
  };

  onLinkChange = (e: any) => {
    let value = e.target.value;
    this.setState({ externalLink: { ...value, value } });
  };

  onTargetIdChange = (e: any) => {
    let value = e.target.value;
    this.setState({ targetId: {  ...value, value } });
  };

  onOrderChange = (e: any) => {
    let value = e.target.value;
    this.setState({ displayOrder: { ...value, value } });
  };

  handletargetChange = (value: any) => {
    this.setState({ target: { ...value, value } });
  }

  render() {
    const { visible, onCancel, modalType } = this.props;
    const { bannerModel } = this.props.bannerStore!;

    if (this.props.visible === false && document.getElementById('banner-image') != null)
      document.getElementById('banner-image')!.setAttribute('value', '');

    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateBanner') : L('EditBanner')}
        onCancel={onCancel}
        centered
        destroyOnClose
        maskClosable={false}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingBanner}
            onClick={this.handleSubmit}
          >
            {modalType === 'create' ? L('Create') : L('Edit')}
          </Button>,
        ]}
      >
        <Form ref={this.props.formRef}>
          <Row>
            <Col {...colLayout}>
              <FormItem
                label={L('ArTitle')}
                validateStatus={this.state.arName.validateStatus}
                help={this.state.arName.errorMsg}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                initialValue={
                  bannerModel !== undefined && bannerModel.arTitle
                    ? bannerModel.arTitle
                    : undefined
                }
                name="arTitle"
                {...formItemLayout}
              >
                <Input type="text" onLoad={this.onArChange} onChange={this.onArChange} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('EnTitle')}
                name="enTitle"
                colon={false}
                {...formItemLayout}
                initialValue={
                  bannerModel !== undefined && bannerModel.enTitle
                    ? bannerModel.enTitle
                    : undefined
                }
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                validateStatus={this.state.enTitle.validateStatus}
                help={this.state.enTitle.errorMsg}
              >
                <Input type="text" onLoad={this.onEnChange} onChange={this.onEnChange} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('EnDescriptions')}
                name="enDescriptions"
                colon={false}
                {...formItemLayout}
                initialValue={
                  bannerModel !== undefined && bannerModel.enDescriptions
                    ? bannerModel.enDescriptions
                    : undefined
                }
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                validateStatus={this.state.enDescriptions.validateStatus}
                help={this.state.enDescriptions.errorMsg}
              >
                <Input.TextArea onLoad={this.onEnChange} onChange={this.onEnChange} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('ArDescriptions')}
                name="arDescriptions"
                colon={false}
                {...formItemLayout}
                initialValue={
                  bannerModel !== undefined && bannerModel.arDescriptions
                    ? bannerModel.arDescriptions
                    : undefined
                }
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                validateStatus={this.state.arDescriptions.validateStatus}
                help={this.state.arDescriptions.errorMsg}
              >
                <Input.TextArea onLoad={this.onEnChange} onChange={this.onEnChange} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem
                label={L('displayOrder')}
                name="displayOrder"
                colon={false}
                {...formItemLayout}
                initialValue={
                  bannerModel !== undefined && bannerModel.displayOrder
                    ? bannerModel.displayOrder
                    : undefined
                }
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                help={this.state.enTitle.errorMsg}
              >
                <Input type="number" onLoad={this.onOrderChange} onChange={this.onOrderChange} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <Form.Item label={L('TargetType')} name="target"
                colon={false}
                {...formItemLayout}
              >
                <Select placeholder={L('PleaseSelectTargetType')} 
                onChange={this.handletargetChange}
                defaultValue={
                  bannerModel !== undefined && bannerModel.target
                    ? bannerModel.target
                    : undefined
                }
                >
                  <Select.Option key={BannerType.None} value={BannerType.None}>
                    {L('None')}
                  </Select.Option>
                  <Select.Option key={BannerType.Category} value={BannerType.Category}>
                    {L('Category')}
                  </Select.Option>{' '}
                  <Select.Option key={BannerType.Item} value={BannerType.Item}>
                    {L('Item')}
                  </Select.Option>{' '}
                  <Select.Option key={BannerType.externalLink} value={BannerType.externalLink}>
                    {L('externalLink')}
                  </Select.Option>{' '}
                </Select>
              </Form.Item>
            </Col>
            {(this.state.target.value == 1 || this.state.target.value == 2) && (
              <Col {...colLayout}>
                <FormItem
                  label={L('Target')}
                  name="targetId"
                  colon={false}
                  {...formItemLayout}
                  initialValue={
                    bannerModel !== undefined && bannerModel.targetId
                      ? bannerModel.targetId
                      : undefined
                  }
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                >
                  <Input type="text" onLoad={this.onTargetIdChange} onChange={this.onTargetIdChange} />
                </FormItem>
              </Col>
            )}
            {this.state.target.value == 3 && (
              <Col {...colLayout}>
                <FormItem
                  label={L('externalLink')}
                  name="externalLink"
                  colon={false}
                  {...formItemLayout}
                  initialValue={
                    bannerModel !== undefined && bannerModel.externalLink
                      ? bannerModel.externalLink
                      : undefined
                  }
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                >
                  <Input type="text" onLoad={this.onLinkChange} onChange={this.onLinkChange} />
                </FormItem>
              </Col>
            )}


            <Col {...colLayout}>
              <FormItem label={L('Image')} required colon={false} {...formItemLayout}>
                <img id="banner-image" alt="banner img" style={{ display: 'none' }} />

                <EditableImage
                  defaultFileList={
                    bannerModel !== undefined && bannerModel.image !== null
                      ? this.state.image
                      : []
                  }
                  onSuccess={(fileName) => {
                    document.getElementById('banner-image')!.setAttribute('value', fileName);
                  }}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateBanner;
