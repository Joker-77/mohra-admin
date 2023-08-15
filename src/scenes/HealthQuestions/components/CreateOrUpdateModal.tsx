/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { Form, Modal, Button, Input, Select, Row, Col, InputNumber, Divider } from 'antd';

import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './index.less';
import { CreateOrUpdateHealthQuestionDto, HealthQuestionDto } from '../../../services/healthquestions/dto';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
import FormItem from 'antd/lib/form/FormItem';
import { HealthQuestionType } from '../../../lib/types';

interface CreateOrUpdateHealthQuestionProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (values: CreateOrUpdateHealthQuestionDto) => void;
  isSubmittingHealthQuestion: boolean;
  healthQuestionData?: HealthQuestionDto;
}

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 8 },
    lg: { span: 8 },
    xl: { span: 8 },
    xxl: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 16 },
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 16 },
  },
};

const choiceItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 24 },
    xl: { span: 24 },
    xxl: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 24 },
    xl: { span: 24 },
    xxl: { span: 24 },
  },
};

const CreateOrUpdateHealthQuestion: React.FC<CreateOrUpdateHealthQuestionProps> = ({
  visible,
  onCancel,
  modalType,
  onOk,
  isSubmittingHealthQuestion,
  healthQuestionData,
}) => {
  const [form] = Form.useForm();
  const [choicesData, setChoicesData] = useState<
    Array<{ key: number; enContent: string; arContent: string }>
  >([]);

  useEffect(() => {
    if (healthQuestionData && modalType === 'update') {
      const { healthProfileQuestionChoices } = healthQuestionData;
      let newChoices: Array<{
        key: number;
        enContent: string;
        arContent: string;
      }> = [];
      healthProfileQuestionChoices.map((choice: any, index: number) =>
        newChoices.push({
          key: index,
          enContent: choice.enContent,
          arContent: choice.arContent,
        })
      );
      setChoicesData(newChoices);
      // setChoiceImages(imgs);
      form.setFieldsValue(healthQuestionData);
    }
  }, [healthQuestionData]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {

      values.isActive = true;
      values.healthProfileQuestionChoices = choicesData;
      onOk(modalType === 'update' ? { ...values, id: healthQuestionData!.id } : values);
    });
  };
  const required = { required: true, message: L('ThisFieldIsRequired') };

  return (
    <Modal
      width="85%"
      style={{ padding: '20px' }}
      visible={visible}
      title={modalType === 'create' ? L('AddHealthQuestion') : L('EditHealthQuestion')}
      onCancel={onCancel}
      centered
      maskClosable={false}
      destroyOnClose
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={[
        <Button key="back" onClick={onCancel}>
          {L('Cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={isSubmittingHealthQuestion} onClick={handleSubmit}>
          {modalType === 'create' ? L('Create') : L('Save')}
        </Button>,
      ]}
    >
      <Form preserve={false} form={form} {...formLayout} scrollToFirstError>
        <Row>
          <Col
            xs={{ span: 24, offset: 0 }}
            md={{ span: 20, offset: 0 }}
            lg={{ span: 11, offset: 0 }}
          >
           
            <Form.Item name={'type'}  label={L('Type')}  >
              <Select placeholder={L('PleaseSelectHealthQuestionType') } defaultValue={HealthQuestionType.health}>
                <Select.Option key={HealthQuestionType.health} value={HealthQuestionType.health}>
                  {L('Health')}
                </Select.Option>
              </Select>
            </Form.Item>
            

            <Form.Item label={L('ArContent')} name="arContent" rules={[required]}>
              <Input.TextArea dir="auto" rows={5} />
            </Form.Item>

          </Col>
          <Col
            xs={{ span: 24, offset: 0 }}
            md={{ span: 20, offset: 0 }}
            lg={{ span: 11, offset: 2 }}
          >
            <Form.Item label={L('EnContent')} name="enContent" rules={[required]}>
              <Input.TextArea dir="auto" rows={5} />
            </Form.Item>

            <Form.Item name={'order'} rules={[required]} label={L('Order')}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Divider />
          <h4>
            {L('ManageChoices')}
            <br />
            <br />
          </h4>
          <Col
            xs={{ span: 24, offset: 0 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 24, offset: 0 }}
          >
            <Form.List
              // {...formItemLayout}
              name="healthProfileQuestionChoices"
              initialValue={healthQuestionData?.healthProfileQuestionChoices}
              children={(fields: FormListFieldData[], { add, remove }: FormListOperation) => (
                <>
                  {fields.map((field: FormListFieldData, index) => (
                    <div className="main-nutritions" key={index}>
                      <Row>
                        <Col
                          xs={{ span: 24, offset: 0 }}
                          md={{ span: 24, offset: 0 }}
                          lg={{ span: 9, offset: 0 }}
                        >
                          {' '}
                          <FormItem
                            {...choiceItemLayout}
                            {...field}
                            name={[field.name, 'enContent']}
                            fieldKey={[field.key, 'enContent']}
                            rules={[required]}
                            label={L('EnContent')}
                            initialValue={
                              choicesData && choicesData.length > 0
                                ? choicesData.filter((item: any) => item.key === field.key)[0]
                                    ?.enContent
                                : undefined
                            }
                          >
                            <Input.TextArea
                              rows={4}
                              dir="auto"
                              onChange={(e) => {
                                const oldChoices = choicesData;
                                const newChoices = oldChoices.filter(
                                  (item: any) => item.key !== field.key
                                );
                                const oldChoice = oldChoices.filter(
                                  (item: any) => item.key === field.key
                                )[0];
                                setChoicesData([
                                  ...newChoices,
                                  {
                                    key: field.key,
                                    arContent: oldChoice?.arContent,
                                    enContent: e.target.value,
                                  },
                                ]);
                              }}
                            />
                          </FormItem>
                        </Col>
                        <Col
                          xs={{ span: 24, offset: 0 }}
                          md={{ span: 24, offset: 0 }}
                          lg={{ span: 9, offset: 2 }}
                        >
                          {' '}
                          <FormItem
                            {...choiceItemLayout}
                            {...field}
                            name={[field.name, 'arContent']}
                            fieldKey={[field.key, 'arContent']}
                            rules={[required]}
                            label={L('ArContent')}
                            initialValue={
                              choicesData && choicesData.length > 0
                                ? choicesData.filter((item: any) => item.key === field.key)[0]
                                    ?.arContent
                                : undefined
                            }
                          >
                            <Input.TextArea
                              rows={4}
                              dir="auto"
                              onChange={(e) => {
                                const oldChoices = choicesData;
                                const newChoices = oldChoices.filter(
                                  (item: any) => item.key !== field.key
                                );
                                const oldChoice = oldChoices.filter(
                                  (item: any) => item.key === field.key
                                )[0];
                                setChoicesData([
                                  ...newChoices,
                                  {
                                    key: field.key,
                                    arContent: e.target.value,
                                    enContent: oldChoice?.enContent,
                                  },
                                ]);
                              }}
                            />
                          </FormItem>
                        </Col>
                      </Row>

                      <Button
                        onClick={() => {
                          remove(field.name);
                          const newChoices = choicesData.filter(
                            (item: any) => item.key !== field.key
                          );
                          setChoicesData(newChoices);
                        }}
                        danger
                        className="nutritions-btn"
                      >
                        <MinusCircleOutlined />
                        {`${L('DeleteChoice')} ${index + 1}`}
                      </Button>
                      <Divider />
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()} block>
                    <PlusOutlined /> {L('AddChoice')}
                  </Button>
                </>
              )}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdateHealthQuestion;
