/* eslint-disable */
import * as React from 'react';
import { Component } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Form, Modal, Button, InputNumber } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import localization from '../../../lib/localization';
import { L } from '../../../i18next';
// import { notifySuccess } from '../../../lib/notifications';
import { UserType } from '../../../lib/types';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import ClientStore from '../../../stores/clientStore';
import { Spin } from "antd";
import './changePointsModal.css';

export interface IChangePointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOk: () => void;
  formRef: React.RefObject<FormInstance>;
  clientStore?: ClientStore;
  userId: number;
  userName: string;
  userType?: UserType;
  clientPoints: number;
  isSubmittingPoints: boolean;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 9 },
    sm: { span: 9 },
    md: { span: 9 },
    lg: { span: 9 },
    xl: { span: 9 },
    xxl: { span: 9 },
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 15 },
    md: { span: 15 },
    lg: { span: 15 },
    xl: { span: 15 },
    xxl: { span: 15 },
  },
};
@inject(Stores.ClientStore)
@observer
class ChangePointsModal extends Component<IChangePointsModalProps, any> {
  state = {
    isSubmitting: false,
    points: 0,
  };

  componentDidUpdate(prevProps: IChangePointsModalProps) {
    const { changePointsModel } = this.props.clientStore!;
    if (changePointsModel !== undefined && this.state.points !== changePointsModel.points) {
      this.onChange(changePointsModel.points);
    }
  }

  handleSubmit = async () => {
    this.props.onOk();
  };

  handleCancel = () => {
    this.props.onClose();
  };
  onChange = (e: any) => {
    this.setState({ points: e })

  }
  render() {
    const { isOpen, onClose } = this.props;
    const { changePointsModel } = this.props.clientStore!;
    changePointsModel! != undefined ? console.log(changePointsModel!.points) : console.log("");
    return (
      <Modal
        visible={isOpen}
        title={`${L('ChangePointsForUser')}: ${this.props.userName}`}
        onCancel={onClose}
        centered
        maskClosable={false}
        destroyOnClose
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={!this.props.clientStore!.changePointsModalLoading ? [
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingPoints}
            onClick={this.handleSubmit}
          >
            {L('Submit')}
          </Button>,
        ] : [<Button key="back" disabled onClick={this.handleCancel}>
          {L('Cancel')}
        </Button>,
        <Button
          disabled
          key="submit"
          type="primary"
          loading={this.props.isSubmittingPoints}
          onClick={this.handleSubmit}
        >
          {L('Submit')}
        </Button>]
        }
      >
        {this.props.clientStore!.changePointsModalLoading ? (
          <div className="loading-overlay">
            <Spin />
          </div>
        ) :
          <Form ref={this.props.formRef}>
            <FormItem
              name="points"
              label={L('Points')}
              colon={false}
              {...formItemLayout}
              initialValue={changePointsModel !== undefined && changePointsModel.points}
              rules={[{
                required: true,
                type: 'number',
                min: 0,
                max: 999,
                message: 'The input is not a number, max = 999',
                // message: L('ThisFieldIsRequired')
              }]}
            >
              <InputNumber onChange={this.onChange} />
            </FormItem>
          </Form>
        }
      </Modal>
    );
  }
}

export default ChangePointsModal;
