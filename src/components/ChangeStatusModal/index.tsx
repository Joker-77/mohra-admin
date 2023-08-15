/* eslint-disable */
import * as React from 'react';
import { Component } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Form, Modal, Button, Input, Select } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { L } from '../../i18next';

import localization from '../../lib/localization';
import categoryService from '../../services/categories/categoriesService';
import classificationService from '../../services/classifications/classificationsService';
import eventService from '../../services/events/eventsService';
import { notifySuccess } from '../../lib/notifications';
import ChangeStatusDto from './ChangeStatusDto';
import EventStore from '../../stores/eventStore';
import Stores from '../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';

enum IsActiveStatus {
  Inactive = 0,
  Active = 1,
  Closed = 2,
  Rejected = 3
}
export interface IChangeStatusModalProps {
  isOpen: boolean;
  onDone: () => void;
  onClose: () => void;
  formRef: React.RefObject<FormInstance>;
  options: Array<{ value: number; text: string }>;
  service: string;
  oldStatus: number;
  id: number;
  from?: string;
  eventStore?: EventStore;
}
@inject(Stores.EventStore)
@observer
class ChangeStatusModal extends Component<IChangeStatusModalProps, any> {
  state = {
    isSubmitting: false,
    reason:"",
    status:0
  };

  handleSubmit = async () => {
    const { formRef, service, onClose, onDone, from } = this.props || {};
    const form = formRef.current;
    form!.validateFields().then(async (values: any) => {
      const changeStatusObj: ChangeStatusDto = {
        status: values.status,
        id: values.id,
        reason: values.reason,
      };

      try {
        this.setState({ isSubmitting: true });
        switch (service) {
          case 'Category':
            await categoryService.changeStatus(changeStatusObj);
            break;
          case 'Classification':
            await classificationService.changeStatus(changeStatusObj);
            break;
          case 'Event':
            await eventService.changeStatus(changeStatusObj);
            break;
          default:
            break;
        }
        form!.resetFields();
        if (from === 'eventDetails') await this.props.eventStore!.getEvent({ id: this.props.id });

        onClose();
        notifySuccess();
        this.setState({ isSubmitting: false});
        onDone();
      } catch {
        this.setState({ isSubmitting: false });
      }
    });
  };

  handleCancel = () => {
    const { onClose } = this.props || {};
    this.setState({status:0});
    onClose();
  };

  render() {
    const { isSubmitting, status, reason } = this.state;
    const { isOpen, onClose, formRef, options, oldStatus, id,service } = this.props!;
    return (
      <Modal
        visible={isOpen}
        title={L('ChangeStatus')}
        onCancel={onClose}
        centered
        maskClosable={false}
        destroyOnClose
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button key="submit" type="primary" loading={isSubmitting} onClick={this.handleSubmit}>
            {L('Save')}
          </Button>,
        ]}
      >
        <Form ref={formRef}>
          <FormItem
            label={L('Status')}
            colon={false}
            initialValue={oldStatus}
            rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
            name="status"
          >
            <Select 
            defaultValue={oldStatus} 
            optionFilterProp="children"
            onChange={(val: number) => this.setState({status:val})}
            >
              {options &&
                options.map((option) => {
                  return (
                    <Select.Option key={option.value} value={option.value}>
                      {option.text}
                    </Select.Option>
                  );
                })}
            </Select>
          </FormItem>

          {service === "Event"  && status == IsActiveStatus.Rejected?
          <FormItem
            label={L('Reason')}
            colon={false}
            rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
            initialValue={reason}
            name="reason"
          >
            <Input.TextArea dir="auto" value={reason} />
          </FormItem>
          : null}

          <FormItem
            label={L('Id')}
            colon={false}
            hidden
            rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
            initialValue={id}
            name="id"
          >
            <Input type="hidden" value={id} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default ChangeStatusModal;
