/* eslint-disable */
import * as React from 'react';
import { Form, Button, Input, Card, Switch } from 'antd';
import { inject, observer } from 'mobx-react';

import FormItem from 'antd/lib/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import AboutUsStore from '../../stores/aboutUsStore';
import localization from '../../lib/localization';
import { L } from '../../i18next';
import Stores from '../../stores/storeIdentifier';
import { SaveOutlined } from '@ant-design/icons';
import { isGranted } from '../../lib/abpUtility';
import { AboutUsDto, UpdateAboutUsDto } from '../../services/aboutUs/dto/AboutUsDto';
import { CKEditor } from 'ckeditor4-react';

const config = {
  format_tags: 'p;h1;h2;h3;h4;h5;h6',
};
export interface ICreateOrUpdateAboutUsProps {
  aboutUsStore?: AboutUsStore;
}

export interface ICreateOrUpdateAboutUsState {
    editMode: boolean;
    permisssionsGranted: {
      update: boolean;
    },
    isActive: boolean;
    aboutUsId: number;
    arTitle: { value: string; validateStatus?: string; errorMsg: string | null };
    enTitle: { value: string; validateStatus?: string; errorMsg: string | null };
    arContent: { value: string; validateStatus?: string; errorMsg: string | null };
    enContent: { value: string; validateStatus?: string; errorMsg: string | null };
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

@inject(Stores.AboutUsStore)
@observer
class AboutUs extends React.Component<ICreateOrUpdateAboutUsProps, ICreateOrUpdateAboutUsState> {
  formRef = React.createRef<FormInstance>();
  state = {
    editMode: false,
    isActive: false,
    aboutUsId: 0,
    arTitle: { value: '', validateStatus: undefined, errorMsg: null },
    enTitle: { value: '', validateStatus: undefined, errorMsg: null },
    arContent: { value: '', validateStatus: undefined, errorMsg: null },
    enContent: { value: '', validateStatus: undefined, errorMsg: null },
    permisssionsGranted: {
        update: false,
    },
  };

  data?: AboutUsDto = undefined;

  async componentDidMount() {
    this.setState({
      permisssionsGranted: {
        update: isGranted('Locations.Update'),
      },
    });
    await this.getAboutUs(1);
  }

  async getAboutUs(id: number) {
    await this.props.aboutUsStore!.getAboutUs({id,});
    this.setState({ 
      editMode: true, 
      isActive: this.props.aboutUsStore?.aboutUsModel?.isActive!,
      aboutUsId: this.props.aboutUsStore?.aboutUsId!,
    });
  }

  handleSubmit = async () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      console.log(values);
      const updateProfileObj: UpdateAboutUsDto = {
        id: this.state.aboutUsId,
        arTitle: values.arTitle,
        enTitle: values.enTitle,
        arContent: this.state.arContent.value,
        enContent: this.state.enContent.value,
        isActive: values.isActive,
      };
      console.log(updateProfileObj);
      try {
        await this.props.aboutUsStore!.updateAboutUs(updateProfileObj);
        window.location.reload();
      } catch {
        // this.setState({ isSubmitting: false });
        console.log("There is something an error in code. please contact our developer!");
      }
    });
  };


  onArContentChange = (value: any) => {
    this.setState({ arContent: { validateStatus: undefined, errorMsg: null, value } });
  };
  
  onEnContentChange = (value: any) => {
    this.setState({ enContent: { validateStatus: undefined, errorMsg: null, value } });
  };

  render() {
    const { aboutUsModel } = this.props.aboutUsStore!;
    return (
        <Card
        style={{ minHeight: '70vh' }}
        title={
          <div>
            <span>{L('AboutUs')}</span>
            <Button
              type="primary"
              style={{ float: localization.getFloat() }}
              disabled={this.props.aboutUsStore?.isSubmittingAbout}
              icon={<SaveOutlined />}
              loading={this.props.aboutUsStore?.isSubmittingAbout}
              onClick={this.handleSubmit}
            >
              {L('Save')}
            </Button>
          </div>
        }
      >
        {aboutUsModel && (<Form ref={this.formRef}>
          <>
          <Input type='hidden' name="id" defaultValue={aboutUsModel?.id} />
          <FormItem
              label={L('ArTitle')}
              name="arTitle"
              {...formItemLayout}
              validateStatus={this.state.arTitle.validateStatus}
              help={this.state.arTitle.errorMsg}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              initialValue={aboutUsModel !== undefined ? aboutUsModel.arTitle : undefined}
            >
              <Input />
            </FormItem>
            <FormItem
              label={L('EnTitle')}
              name="enTitle"
              {...formItemLayout}
              validateStatus={this.state.enTitle.validateStatus}
              help={this.state.enTitle.errorMsg}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              initialValue={aboutUsModel !== undefined ? aboutUsModel.enTitle : undefined}
            >
              <Input onChange={() => {}} />
            </FormItem>

            <FormItem
              label={L('ArContent')}
              name="arContent"
              {...formItemLayout}
              validateStatus={this.state.arContent.validateStatus}
              help={this.state.arContent.errorMsg}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              initialValue={aboutUsModel !== undefined ? aboutUsModel.arContent : undefined}
            >
              {/* <Input.TextArea dir="auto" rows={5} /> */}
              <CKEditor
                    onInstanceReady={({ editor }) => {
                      this.setState({ arContent: { validateStatus: undefined, errorMsg: null, value: editor } });
                    }}
                    config={config}
                    initData={
                      aboutUsModel !== undefined && aboutUsModel.arContent
                        ? aboutUsModel.arContent
                        : undefined
                    }
                    onChange={(event) => {
                      this.onArContentChange(event.editor.getData());
                    }}
                  />
            </FormItem>
            <FormItem
              label={L('EnContent')}
              name="enContent"
              {...formItemLayout}
              validateStatus={this.state.enContent.validateStatus}
              help={this.state.enContent.errorMsg}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              initialValue={aboutUsModel !== undefined ? aboutUsModel.enContent : undefined}
            >
              {/* <Input.TextArea dir="auto" rows={5} /> */}
              <CKEditor
                    onInstanceReady={({ editor }) => {
                      this.setState({ enContent: { validateStatus: undefined, errorMsg: null, value: editor } });
                    }}
                    config={config}
                    initData={
                      aboutUsModel !== undefined && aboutUsModel.enContent
                        ? aboutUsModel.enContent
                        : undefined
                    }
                    onChange={(event) => {
                      this.onEnContentChange(event.editor.getData());
                    }}
                  />
            </FormItem>
            <FormItem
              label={L('IsActive')}
              name="isActive"
              {...formItemLayout}
              initialValue={aboutUsModel !== undefined ? aboutUsModel.isActive : undefined}
            >
              <Switch
                checked={this.state.isActive}
                onChange={() => {
                  this.setState((state) => ({ isActive: !state.isActive }));
                }}
              />
            </FormItem>
          </>
        </Form>)}
      </Card>
    );
  }
}

export default AboutUs;
