import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Button, Form, DatePicker, Input, Select, Row, Col } from 'antd';
import { connect } from 'dva';
import axios from 'axios';
import styles from './style.less';
import request from '@/utils/request';

const FormItem = Form.Item;
const { Option } = Select;

export default class Compiler extends Component {
  state = {
    code: '',
    result: '',
    errors: '',
    language: {
      key: '7',
      label: 'c',
    },
  };

  handleChange = e => {
    this.setState({
      code: e.target.value,
    });
  };

  runCode = async () => {
    const data = new FormData();
    console.log(this.state.language);
    data.append('code', this.state.code);
    data.append('language', this.state.language.key);
    data.append('fileext', this.state.language.label);
    const result = await axios.post('http://lab.lli.fun/compile', data);

    this.setState({
      result: result.data.output,
      errors: result.data.errors,
    });
  };

  handleLanguage = e => {
    console.log(this.state.language);
    this.setState({
      language: e,
    });
  };

  render() {
    return (
      <PageHeaderWrapper title="在线编译" wrapperClassName={styles.advancedForm}>
        <Card>
          <Row>
            <Select
              style={{ width: 120 }}
              value={this.state.language}
              onChange={this.handleLanguage}
              labelInValue
            >
              <Select.Option value="7">c</Select.Option>
              <Select.Option value="8">java</Select.Option>
              <Select.Option value="4">node.js</Select.Option>
            </Select>
            <Button onClick={this.runCode}>运行</Button>
          </Row>
          <Row gutter={64}>
            <Col xs={24} md={12}>
              <Input.TextArea
                className={styles.area}
                placeholder="请在此处键入代码"
                autosize={{ minRows: 15 }}
                onChange={this.handleChange}
                value={this.state.code}
              />
            </Col>
            <Col xs={24} md={12}>
              <Input.TextArea
                value={this.state.result}
                className={styles.area}
                placeholder="此处用于展示结果"
                rows={8}
                disabled
              />
              <Input.TextArea
                className={styles.area}
                placeholder="此处用于显示标准错误信息"
                disabled
                rows={7}
                value={this.state.errors}
              />
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
