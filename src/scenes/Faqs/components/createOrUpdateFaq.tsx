/* eslint-disable */
import * as React from 'react';
import { Form, Modal, Button, Input } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import localization from '../../../lib/localization';
import { FaqType } from '../../../lib/types';
import FaqStore from '../../../stores/faqStore';

export interface ICreateOrUpdateFaqProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  faqStore?: FaqStore;
  onOk: () => void;
  faqType: FaqType;
  isSubmittingFaq: boolean;
  formRef: React.RefObject<FormInstance>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 6 },
    xl: { span: 6 },
    xxl: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 18 },
    xl: { span: 18 },
    xxl: { span: 18 },
  },
};

@inject(Stores.FaqStore)
@observer
class CreateOrUpdateFaq extends React.Component<ICreateOrUpdateFaqProps, any> {
  state = {
    isActive: false,
    arQuestion: { value: '', validateStatus: undefined, errorMsg: null },
    enQuestion: { value: '', validateStatus: undefined, errorMsg: null },
    arAnswer: { value: '', validateStatus: undefined, errorMsg: null },
    enAnswer: { value: '', validateStatus: undefined, errorMsg: null },
  };

  
  handleSubmit = async () => {
    await this.props.onOk();
  };

  validateArQuestionOrAnswer = (value: string) => {
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

  validateEnQuestionOrAnswer = (value: string) => {
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

  onArChange = (e: any) => {
    let value = e.target.value;
    this.setState({ arQuestion: { ...this.validateArQuestionOrAnswer(value), value } });
  };

  onEnChange = (e: any) => {
    let value = e.target.value;
    this.setState({ enQuestion: { ...this.validateEnQuestionOrAnswer(value), value } });
  };

  handleCancel = () => {
    this.props.onCancel();
    this.props.faqStore!.faqModel = undefined;
  };

  render() {
    const { visible, modalType, faqType } = this.props;
    const { faqModel } = this.props.faqStore!;
    
    return (
      <Modal
        visible={visible}
        title={
          modalType === 'create'
            ? faqType === FaqType.None
              ? L('CreateFaq')
              : null
            : faqType === FaqType.Item
            ? L('EditFaq')
            : null
        }
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingFaq}
            onClick={this.handleSubmit}
          >
            {modalType === 'create' ? L('Create') : L('Save')}
          </Button>,
        ]}
      >
        <Form ref={this.props.formRef}>
          <>
            <FormItem
              label={L('ArQuestion')}
              name="arQuestion"
              {...formItemLayout}
              validateStatus={this.state.arQuestion.validateStatus}
              help={this.state.arQuestion.errorMsg}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              initialValue={faqModel !== undefined ? faqModel.arQuestion : undefined}
            >
              <Input onChange={this.onArChange} />
            </FormItem>
            <FormItem
              label={L('EnQuestion')}
              name="enQuestion"
              {...formItemLayout}
              validateStatus={this.state.enQuestion.validateStatus}
              help={this.state.enQuestion.errorMsg}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              initialValue={faqModel !== undefined ? faqModel.enQuestion : undefined}
            >
              <Input onChange={this.onEnChange} />
            </FormItem>

            <FormItem
              label={L('ArAnswer')}
              name="arAnswer"
              {...formItemLayout}
              validateStatus={this.state.arAnswer.validateStatus}
              help={this.state.arAnswer.errorMsg}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              initialValue={faqModel !== undefined ? faqModel.arAnswer : undefined}
            >
              <Input onChange={this.onArChange} />
            </FormItem>
            <FormItem
              label={L('EnAnswer')}
              name="enAnswer"
              {...formItemLayout}
              validateStatus={this.state.enAnswer.validateStatus}
              help={this.state.enAnswer.errorMsg}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              initialValue={faqModel !== undefined ? faqModel.enAnswer : undefined}
            >
              <Input onChange={this.onEnChange} />
            </FormItem>
            <FormItem
              label={L('Order')}
              name="order"
              {...formItemLayout}
              initialValue={faqModel !== undefined ? faqModel.order : undefined}
            >
              <Input />
            </FormItem>
          </>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateFaq;
