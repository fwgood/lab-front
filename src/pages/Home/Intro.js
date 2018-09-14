import React, { PureComponent } from 'react';
import { Card, Row, Col, Tag, Divider, Button, Modal, Input, Form } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Intro.less';
import logo from '@/assets/logo.png';
import {connect } from 'dva';
import{getAuth} from "@/utils/auth"
const FormItem = Form.Item;
const { TextArea } = Input
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};
@connect(({ login, loading }) => ({
  login,
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
    newsList: [
      {
        title: '先富带后富，脱贫致富路-软件学院三下乡团队汇报',
        content: `2018年8月20日，云南大学的三下乡团队就澄江县"改革开放四十周年"主题调研继续进行，所有成员要了解澄江的本土企业发展状况，体味改革开放对于一个整体区域经济发展的作用，感受新时代的发展风貌。因此我们联系到云南大型综合型企业云南再峰集团，以再峰集团在澄江的发展为例映射澄江县经济的发展。`,
        key: 1,
      },
      {
        title: '先富带后富，脱贫致富路-软件学院三下乡团队汇报',
        content: `2018年8月20日，云南大学的三下乡团队就澄江县"改革开放四十周年"主题调研继续进行，所有成员要了解澄江的本土企业发展状况，体味改革开放对于一个整体区域经济发展的作用，感受新时代的发展风貌。因此我们联系到云南大型综合型企业云南再峰集团，以再峰集团在澄江的发展为例映射澄江县经济的发展。`,
        key: 2,
      },
      {
        title: '先富带后富，脱贫致富路-软件学院三下乡团队汇报',
        content: `2018年8月20日，云南大学的三下乡团队就澄江县"改革开放四十周年"主题调研继续进行，所有成员要了解澄江的本土企业发展状况，体味改革开放对于一个整体区域经济发展的作用，感受新时代的发展风貌。因此我们联系到云南大型综合型企业云南再峰集团，以再峰集团在澄江的发展为例映射澄江县经济的发展。`,
        key: 3,
      },
      {
        title: '先富带后富，脱贫致富路-软件学院三下乡团队汇报',
        content: `2018年8月20日，云南大学的三下乡团队就澄江县"改革开放四十周年"主题调研继续进行，所有成员要了解澄江的本土企业发展状况，体味改革开放对于一个整体区域经济发展的作用，感受新时代的发展风貌。因此我们联系到云南大型综合型企业云南再峰集团，以再峰集团在澄江的发展为例映射澄江县经济的发展。`,
        key: 4,
      },
    ],
  };
  showModal = () => {
    this.setState({
      infoVisible: true,
    });
  }

  handleInfoOk = () => {
    console.log(this.state.infoObj)
    this.setState({
      confirmLoading: true,
    });

    setTimeout(() => {
      this.setState({
        infoVisible: false,
        confirmLoading: false,
      });
    }, 2000);
  }

  handleInfoCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      infoVisible: false,
    });
  }

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
        <Modal title="公告"
          visible={this.state.infoVisible}
          onOk={this.handleInfoOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleInfoCancel}
        >
          <Form  onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="标题"
            >
              {getFieldDecorator('title', {
                rules: [{
                  type: 'email', message: '请输入标题',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="公告内容"
            >
              {getFieldDecorator('content', {
                rules: [{
                  type: 'email', message: '请输入内容',
                }],
              })(
                <TextArea />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
  render() {

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
            <Card title="最近新闻" className={styles.tabsCard} bordered={false} extra={<a style={getAuth().role=='2'?{visibility:"hidden"}:{}} onClick={() => this.showModal()}>发布公告</a>}>
              {this.renderInfo()}
              <span>

                <Row>
                  {this.state.newsList.map(n => (
                    <Col lg={24} md={24} key={n.key}>
                      <Card
                        title={n.title}
                        extra={
                          <Button onClick={this.handleMore(n)} type="dashed">
                            More
                          </Button>
                        }
                        style={{ width: '100%', marginTop: 20 }}
                        hoverable
                      >
                        <p>{n.content}</p>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </span>
            </Card>
          </Col>
          <Modal
            title={this.state.currentNews.title}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancle}
          >
            <p>{this.state.currentNews.content}</p>
          </Modal>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
