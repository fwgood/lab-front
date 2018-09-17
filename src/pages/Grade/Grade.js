import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Drawer, Form, Row, Col, Input, InputNumber, Button } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Document, Page } from 'react-pdf';
import styles from './Grade.less';

const FormItem = Form.Item;

@connect(({ profile, loading, grade }) => ({
  profile,
  grade,
  loading: loading.effects['profile/fetchBasic'],
}))
@Form.create()
class BasicProfile extends Component {
  state = {
    drawerVisible: false,
    numPages: null,
    pageNumber: 1,
    currentScore: {},
  };

  componentWillMount() {
    const {
      dispatch,
      location: {
        state: { labId },
      },
    } = this.props;
    dispatch({
      type: 'grade/queryAllScore',
      payload: {
        labId,
      },
    });
  }

  progressColumns = [
    {
      title: '学号',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '状态',
      dataIndex: 'score',
      render: text =>
        text ? (
          <Badge status="success" text="已评分" />
        ) : (
          <Badge status="processing" text="进行中" />
        ),
    },
    {
      title: '分数',
      dataIndex: 'score',
      render: score => score || '未评分',
    },
    {
      title: '操作',
      key: 'action',
      render: record => (
        <Fragment>
          <a onClick={() => this.handleRecord(record)} disabled={record.score}>
            评分
          </a>
        </Fragment>
      ),
    },
  ];

  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  };

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  onClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  submitScore = () => {
    console.log(this.state.currentScore);
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'grade/addScore',
          payload: {
            labId: this.state.currentScore.labId,
            score: values.score,
            userId: this.state.currentScore.userId,
          },
        });
        this.setState({
          drawerVisible: false,
        });
      }
    });
  };

  handleRecord = record => {
    console.log(record);
    this.setState({
      drawerVisible: true,
      currentScore: record,
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/fetchBasic',
    });
  }

  renderDrawer() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div>
        <Drawer
          title="小名"
          width={820}
          placement="right"
          onClose={this.onClose}
          maskClosable={false}
          visible={this.state.drawerVisible}
          style={{
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53,
          }}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <FormItem label="分数" formLayout="inline">
                {getFieldDecorator('score', {
                  rules: [
                    {
                      required: true,
                      message: '至少0分',
                    },
                  ],
                })(<InputNumber min={0} max={100} />)}
              </FormItem>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="描述">
                  {getFieldDecorator('description', {
                    initialValue: this.state.currentScore.commitContent,
                    rules: [
                      {
                        required: true,
                        message: 'please enter url description',
                      },
                    ],
                  })(<Input.TextArea disabled autosize placeholder="没有描述" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <div>
                <Document
                  file={this.state.currentScore.commitUrl}
                  onLoadSuccess={this.onDocumentLoad}
                >
                  <Page pageNumber={this.state.pageNumber} />
                </Document>
                <p>
                  Page {this.state.pageNumber} of {this.state.numPages}
                </p>
              </div>
            </Row>
            {/* <Form.Item label="评语">
              {getFieldDecorator('opinion', {
                rules: [
                  {
                    required: true,
                    message: '请至少输入一句话',
                  },
                ],
              })(<Input.TextArea autosize placeholder="请输入评语" />)}
            </Form.Item> */}
          </Form>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'left',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <Button
              style={{
                marginRight: 8,
              }}
              onClick={this.onClose}
            >
              Cancel
            </Button>
            <Button onClick={this.submitScore} type="primary">
              Submit
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }

  render() {
    const { profile, loading } = this.props;
    const { basicGoods, basicProgress } = profile;
    let goodsData = [];
    if (basicGoods.length) {
      let num = 0;
      let amount = 0;
      basicGoods.forEach(item => {
        num += Number(item.num);
        amount += Number(item.amount);
      });
      goodsData = basicGoods.concat({
        id: '总计',
        num,
        amount,
      });
    }
    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === basicGoods.length) {
        obj.props.colSpan = 0;
      }
      return obj;
    };

    return (
      <div>
        <div>{this.renderDrawer()}</div>
        <PageHeaderWrapper title="评分页">
          <Card bordered={false}>
            <div className={styles.title}>评分进度</div>
            <Table
              rowKey="commitUrl"
              style={{ marginBottom: 16 }}
              pagination={false}
              loading={loading}
              dataSource={this.props.grade.scores}
              columns={this.progressColumns}
            />
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default BasicProfile;
