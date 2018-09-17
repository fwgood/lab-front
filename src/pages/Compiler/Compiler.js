import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Button, Form, DatePicker, Input, Select, Row, Col } from 'antd';
import { connect } from 'dva';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

export default class Compiler extends Component {
  render() {
    return (
      <PageHeaderWrapper title="在线编译" wrapperClassName={styles.advancedForm}>
        <Card>
          <Row>
            <Select style={{ width: 120 }}>
              <Select.Option value="C">C</Select.Option>
              <Select.Option value="JAVA">JAVA</Select.Option>
              <Select.Option value="JAVASCRIPT">JAVASCRIPT</Select.Option>
            </Select>
            <Button>运行</Button>
          </Row>
          <Row gutter={64}>
            <Col xs={24} md={12}>
              <Input.TextArea
                className={styles.area}
                placeholder="请在此处键入代码"
                autosize={{ minRows: 15 }}
              />
            </Col>
            <Col xs={24} md={12}>
              <Input.TextArea
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
              />
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
