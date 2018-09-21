import React, { PureComponent } from 'react';
import { Card, Row, Col, Tag, Divider, Button, Modal, Input, Form } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import logo from '@/assets/logo.png';
import { connect } from 'dva';
import { getAuth } from '@/utils/auth';
import moment from 'moment';
import styles from './Intro.less';
const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};
@connect(({ login, loading, notice,news }) => ({
  login,
  notice,
  news,
  loading: loading.models.notice,
}))
@Form.create()
class Center extends PureComponent {
  state = {
    visible: false,
    currentNews: '',
    infoVisible: false,
    confirmLoading: false,
    infoObj: {
      title: '',
      content: '',
    },
  };

  showModal = () => {
    this.setState({
      infoVisible: true,
    });
  };
componentDidMount=()=>{
  this.props.dispatch({
    type:'news/queryNews',
    payload:{
      "page": 1,
      "pageSize": 20,
      "sort": "desc"
    }
  })
}
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'news/addNews',
          payload: {
            ...values,
            newsTime:new Date().getTime(),
          },

        });
        this.setState({
          infoVisible: false,
        });
      }
    });
  };

  handleInfoOk = () => {
    console.log(this.state.infoObj);
    this.setState({
      confirmLoading: true,
    });

    setTimeout(() => {
      this.setState({
        infoVisible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  handleInfoCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      infoVisible: false,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancle = () => {
    this.handleOk();
  };

  handleMore = news => () => {
    this.setState({
      visible: true,
      currentNews: news,
    });
  };

  renderInfo() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Modal
          title="新闻"
          visible={this.state.infoVisible}
          footer={null}
          onOk={this.handleInfoOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleInfoCancel}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="新闻">
              {getFieldDecorator('newsTitle', {
                rules: [
                  {
                    message: '请输入标题',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="公告内容">
              {getFieldDecorator('newsContent', {
                rules: [
                  {
                    message: '请输入内容',
                  },
                ],
              })(<TextArea />)}
            </FormItem>
            <FormItem {...formItemLayout} label="操作">
              <Button
                loading={this.props.loading}
                onSubmit={this.handleSubmit}
                htmlType="submit"
                style={{ marginRight: 16 }}
              >
                发布
              </Button>
              <Button
                onClick={() => {
                  this.setState({
                    infoVisible: false,
                  });

                }}
              >
                取消
              </Button>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }

  render() {
    console.log(this.props.news.news)
    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }}>
              <div>
                <div className={styles.avatarHolder}>
                  <img alt="" src={logo} />
                  <div className={styles.name}>云南大学软件学院</div>
                  <div>会泽百家，至公天下</div>
                </div>
                <div className={styles.detail}>
                  <p>
                    <i className={styles.title} />
                    国家示范性软件学院
                  </p>
                  <p>
                    <i className={styles.group} />
                    云南大学-软件学院
                  </p>
                  <p>
                    <i className={styles.address} />
                    云南省昆明市
                  </p>
                </div>
                <Divider dashed />
                <div className={styles.tags}>
                  <div className={styles.tagsTitle}>标签</div>
                  <Tag>211</Tag>
                  <Tag>双一流</Tag>
                  <Tag>国家示范性软件学院</Tag>
                </div>
                <Divider style={{ marginTop: 16 }} dashed />
              </div>
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              title="最近新闻"
              className={styles.tabsCard}
              bordered={false}
              extra={
                <a
                  style={getAuth().role == '2' ? { visibility: 'hidden' } : {}}
                  onClick={() => this.showModal()}
                >
                  发布新闻
                </a>
              }
            >
              {this.renderInfo()}
              <span>
                <Row>
                  {this.props.news.news.map(n => (
                    <Col lg={24} md={24} key={n.key}>
                      <Card
                        title={"标题："+n.newsTitle}
                        // extra={
                        //   <Button onClick={this.handleMore(n)} type="dashed">
                        //     More
                        //   </Button>
                        // }
                        style={{ width: '100%', marginTop: 20 }}
                        hoverable
                      >
                        <p>{n.newsContent}</p>
                        <p style={{float:'right',marginTop:20}}>{"发布人："+n.newsSendname + "　发布日期："+moment.unix(parseInt(n.newsTime)/1000).format('YYYY-MM-DD HH:mm')　}</p>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </span>
            </Card>
          </Col>
          {/* <Modal
            title={this.state.currentNews.title}
            visible={this.state.visible}
            footer={null}
            onCancel={this.handleCancle}
          >
            <p>{this.state.currentNews.newsContent}</p>
          </Modal> */}
        </Row>
      </GridContent>
    );
  }
}

export default Center;
