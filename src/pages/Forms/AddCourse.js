import React, { Component } from 'react';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Popover,
} from 'antd';
import router from 'umi/router';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// @connect(({ loading }) => ({
//   submitting: loading.effects['form/submitRegularForm'],
// }))
@Form.create()
export default class AddCourse extends Component {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // dispatch({
        //   type: 'form/submitRegularForm',
        //   payload: values,
        // });
        console.log(values);
        router.push('/result/success');
      }
    });
  };
  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper title="添加课程" wrapperClassName={styles.advancedForm}>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="课程标题">
              {getFieldDecorator('course_name', {
                rules: [
                  {
                    required: true,
                    message: '请输入课程名',
                  },
                ],
              })(<Input placeholder="给课程起个名字" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="课程内容">
              {getFieldDecorator('course_content', {
                rules: [
                  {
                    required: true,
                    message: '请输入课程内容',
                  },
                ],
              })(<Input.TextArea placeholder="请输入课程内容描述" autosize />)}
            </FormItem>
            <FormItem {...formItemLayout} label="选课密码">
              {getFieldDecorator('course_password', {
                rules: [
                  {
                    required: true,
                    message: '请输入选课密码',
                  },
                ],
              })(<Input placeholder="给课程设置一个选课密码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="开课学期">
              {getFieldDecorator('term', {
                rules: [
                  {
                    required: true,
                    message: '请选择开课学期',
                  },
                ],
              })(
                <Select placeholder="开课学期">
                  <Option value="20172">2017秋季学期</Option>
                  <Option value="20181">2018春季学期</Option>
                  <Option value="20182">2018秋季学期</Option>
                  <Option value="20191">2019春季学期</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>保存</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
