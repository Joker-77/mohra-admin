/* eslint-disable */
import * as React from 'react';
import { Form, Modal, Button, Input, Row, Col, DatePicker, Radio } from 'antd';
import { FormInstance } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import { inject, observer } from 'mobx-react';
import Stores from '../../../stores/storeIdentifier';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import SalaryCountStore from '../../../stores/salaryCountStore';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';
//import { RepeatedMode } from '../../../lib/types';
import * as RULES from './validationRules';
import type { RadioChangeEvent } from 'antd';

export interface ICreateOrUpdateSalaryCountProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  salaryCountStore?: SalaryCountStore;
  onOk: () => void;
  isSubmittingBanner: boolean;
  formRef: React.RefObject<FormInstance>;
}

export interface ICreateOrUpdateSalaryCountState {
  arTitle: { value: string; validateStatus?: string; errorMsg: string | null };
  enTitle: { value: string; validateStatus?: string; errorMsg: string | null };
  order: { value: number };
  date: { value: string };
  note: { value: string };
  repeatedMode: { value: number }
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

@inject(Stores.SalaryCountStore)
@observer
class CreateOrUpdateSalaryCount extends React.Component<
  ICreateOrUpdateSalaryCountProps,
  ICreateOrUpdateSalaryCountState
> {
  formRef = React.createRef<FormInstance>();

  state = {
    arTitle: { value: '', validateStatus: undefined, errorMsg: null },
    enTitle: { value: '', validateStatus: undefined, errorMsg: null },
    order: { value: 0 },
    note: { value: '', validateStatus: undefined, errorMsg: null },
    date: { value: '', validateStatus: undefined, errorMsg: null },
    repeatedMode: { value: 0 }
  };

  componentDidUpdate() {
    const { salaryCountModel } = this.props.salaryCountStore!;
    console.log("Render = " + salaryCountModel?.repeatedMode  )
  }

  handleSubmit = async () => {
    debugger;
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


  handleCancel = () => {
    this.props.onCancel();
  };

  onArChange = (e: any) => {
    let value = e.target.value;
    this.setState({ arTitle: { ...this.validateArTitle(value), value } });
  };

  onEnChange = (e: any) => {
    let value = e.target.value;
    this.setState({ enTitle: { ...this.validateEnTitle(value), value } });
  };

  onRepeatModeChange = (e: any) => {
    debugger;

    let value = e.target.value;

    this.setState({ repeatedMode: { ...value, value } });


    // let currentState = this.state;
    // currentState.repeatedMode = { ...value, value };
   // this.setState({ repeatedMode: { ...value, value } });

  };

  onOrderChange = (e: any) => {
    let value = e.target.value;
    this.setState({ order: { ...value, value } });
  };



  handleNoteChange = (value: any) => {
    this.setState({ note: { ...value, value } });
  }

  handleDateChange = (value: any) => {
    this.setState({ date: { ...value, value } });
  }

  render() {
    debugger
    const { visible, onCancel, modalType } = this.props;
    const { salaryCountModel } = this.props.salaryCountStore!;
    console.log("Data = " + salaryCountModel?.date)
    console.log("Mode = " + salaryCountModel?.repeatedMode)

    // if (this.props.visible === false && document.getElementById('banner-image') != null)
    //   document.getElementById('banner-image')!.setAttribute('value', '');

    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateSalaryCount') : L('EditSalaryCount')}
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
                validateStatus={this.state.arTitle.validateStatus}
                help={this.state.arTitle.errorMsg}
                colon={false}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                initialValue={
                  salaryCountModel !== undefined && salaryCountModel.arTitle
                    ? salaryCountModel.arTitle
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
                  salaryCountModel !== undefined && salaryCountModel.enTitle
                    ? salaryCountModel.enTitle
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
              <Form.Item
                label={L('Date')}
                name="date"
                initialValue={
                  salaryCountModel !== undefined && salaryCountModel.date
                    ? moment(salaryCountModel.date)
                    : undefined
                }
                rules={[
                  { required: true, message: L('ThisFieldIsRequired') },

                ]}
                {...formItemLayout}
              >
                <DatePicker
                  onChange={() => this.props.formRef.current?.validateFields(['endDate'])}
                  placeholder={L('SelectDate')}
                  format={timingHelper.defaultDateFormat}
                />
              </Form.Item>
            </Col>


            <Col {...colLayout}>
              <FormItem
                label={L('Order')}
                name="order"
                colon={false}
                {...formItemLayout}
                initialValue={
                  salaryCountModel !== undefined && salaryCountModel.order
                    ? salaryCountModel.order
                    : undefined
                }
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                help={this.state.enTitle.errorMsg}
              >
                <Input type="number" onLoad={this.onOrderChange} onChange={this.onOrderChange} />
              </FormItem>
            </Col>

            <Col {...colLayout}>
              {/* <FormItem
                label={L('RepeatedMode')}
                name="repeatedMode"
                colon={false}
                {...formItemLayout}
                initialValue={
                  salaryCountModel != null && (salaryCountModel.repeatedMode == RepeatedMode.Monthly ? RepeatedMode.Monthly
                    : (salaryCountModel?.repeatedMode == RepeatedMode.Yearly ? RepeatedMode.Yearly : RepeatedMode.NotRepeated))
                  // salaryCountModel != null && salaryCountModel.repeatedMode ? salaryCountModel.repeatedMode : undefined
                }
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                help={this.state.enTitle.errorMsg}
              > */}


              {/* <Input type="radio" id='repeatedMode' name='repeatedMode' value={0} onLoad={this.onRepeatModeChange} onChange={this.onRepeatModeChange} /> {L('Monthly')} {" "}
                <Input type="radio" id='repeatedMode' name='repeatedMode' value={1} onLoad={this.onRepeatModeChange} onChange={this.onRepeatModeChange} /> {L('Yearly')} {" "}
                <Input type="radio" id='repeatedMode' name='repeatedMode' value={2} onLoad={this.onRepeatModeChange} onChange={this.onRepeatModeChange} /> {L('NotRepeated')} */}
              {/* </FormItem> */}

              <Form.Item label={L('RepeatedMode')} name="repeatedMode" rules={[RULES.required]} initialValue={salaryCountModel?.repeatedMode}>
                <Radio.Group
                  onChange={(e: RadioChangeEvent) => {

                    let value = e.target.value;
                     //this.setState({ repeatedMode: { ...value, value } });
                     let currentState = this.state;
                     currentState.repeatedMode = { ...value, value };
                     this.setState(currentState);
                  }}>
                  <Radio value={0}>{L('Monthly')}</Radio>
                  <Radio value={1}>{L('Yearly')}</Radio>
                  <Radio value={2}>{L('NotRepeated')}</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal >
    );
  }
}

export default CreateOrUpdateSalaryCount;
