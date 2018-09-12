import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Button, Form, DatePicker, Input, Select } from 'antd';
import { connect } from 'dva';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ loading }) => ({
  submitting: loading.effects['course/addCourse'],
}))
@Form.create()
export default class AddCourse extends Component {
  handleSubmit = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'course/addCourse',
          payload: values,
        });
      }
    });
  };
  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
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
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
