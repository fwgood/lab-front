import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Icon,
  Avatar,
  Tag,
  Divider,
  List,
  Modal,
  Form,
  Input,
  Upload,
  Radio,
  message,
} from 'antd';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import moment from 'moment';
import MarkDown from 'react-markdown';
import styles from './Center.less';
import stylesArticles from '../../List/Articles.less';

const normFile = e => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
@connect(({ loading, user, project, login, list, blog }) => ({
  list,
  login,
  blog,
  listLoading: loading.effects['list/fetch'],
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  project,
  projectLoading: loading.effects['project/fetchNotice'],
}))
@Form.create()
class Center extends PureComponent {
  state = {
    newTags: [],
    inputVisible: false,
    inputValue: '',
    qiniu: {
      token:
        'rcHe5WjHZQ9cfbxNWlPao4zNFgLGPZijSJei264R:kc6D4ZiSzdT3EdPxPanibrI2KU4=:eyJzY29wZSI6ImV0bXMiLCJkZWFkbGluZSI6MTYwNjc1MjAwMH0=',
      file: {},
    },
    imgUrl: '',
  };

  componentDidMount() {
    console.log(this.props.login);
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'blog/queryMyBlog',
      payload: {
        page: 1,
        pageSize: 20,
      },
    });
    dispatch({
      type: 'project/fetchNotice',
    });
  }

  renderMyDiscuss() {
    const {
      list: { list },
      blog: { blogs },
    } = this.props;
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    const ListContent = ({ data: { content, blogTime, avatar, owner, href, userNickname } }) => (
      <div className={styles.listContent}>
        <div className={styles.description}>{content}</div>
        <div className={styles.extra}>
          <Avatar size="small">{userNickname}</Avatar>
          {userNickname} 发布于 {blogTime}
          <em>{}</em>
        </div>
      </div>
    );
    return (
      <List
        size="large"
        className={styles.articleList}
        rowKey="id"
        itemLayout="vertical"
        dataSource={blogs}
        renderItem={item => (
          <List.Item
            key={item.id}
            actions={[
              // <IconText type="star-o" text={item.star} />,
              <IconText type="like-o" text={item.blogCount} />,
              // <IconText type="message" text={item.message} />,
            ]}
          >
            <List.Item.Meta
              title={
                <a className={stylesArticles.listItemMetaTitle} href={item.href}>
                  {item.title}
                </a>
              }
              description={
                <span>
                  {JSON.parse(item.blogTag).map(e => (
                    <Tag>{e.label}</Tag>
                  ))}
                </span>
              }
            />
            <MarkDown source={item.blogContent} />
            <ListContent data={item} />
          </List.Item>
        )}
      />
    );
  }

  saveInputRef = input => {
    this.input = input;
  };

  handleSubmit = e => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!values.upload) {
        message.error('请上传文件');
        return false;
      }
      const data = {};
      if (values.userPhone) {
        data.userPhone = values.userPhone;
      }
      if (values.userCollege) {
        data.userCollege = values.userCollege;
      }
      if (values.userMajor) {
        data.userMajor = values.userMajor;
      }
      if (values.userGrade) {
        data.userGrade = values.userGrade;
      }
      if (values.userNickname) {
        data.userNickname = values.userNickname;
      }
      if (values.userSex) {
        data.userSex = values.userSex;
      }
      if (values.upload && values.upload[0]) {
        data.userAvatar = `http://file.lli.fun/${
          values.upload[values.upload.length - 1].response.key
        }`;
      }
      this.props.dispatch({
        type: 'user/update',
        payload: data,
      });
      this.setState({
        inputVisible: false,
      });
    });
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }
    this.setState({
      newTags,
      inputVisible: false,
      inputValue: '',
    });
  };

  editProfile = user => {
    this.setState({
      inputVisible: true,
    });
  };

  handleFile = f => {
    this.setState({
      qiniu: {
        ...this.state.qiniu,
        file: f,
      },
    });
  };

  handleFileChange = e => {
    if (e.file.response) {
      this.setState({
        imgUrl: `http://file.lli.fun/${e.file.response.key}`,
      });
    }
  };

  onChange = e => {
    this.props.form.setFieldsValue({
      userSex: e,
    });
  };

  render() {
    const {
      listLoading,
      currentUser,
      currentUserLoading,
      project: { notice },
    } = this.props;
    const FormItem = Form.Item;
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
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imgUrl } = this.state;
    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 10 }} loading={currentUserLoading}>
              <div>
                <div className={styles.avatarHolder}>
                  <img
                    alt=""
                    src={
                      currentUser.userAvatar ||
                      'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
                    }
                  />
                  <div className={styles.name}>{currentUser.userNickname}</div>
                  <a onClick={() => this.editProfile(currentUser)}>
                    <Icon type="edit" theme="outlined" />
                  </a>
                  <div>该用户很懒，暂时没有签名</div>
                </div>
                <div className={styles.detail}>
                  <p>
                    <i className={styles.title} />
                    {currentUser.userGrade}
                  </p>
                  <p>
                    <i className={styles.group} />
                    {`${currentUser.userCollege} - ${currentUser.userMajor}`}
                  </p>
                  <p>
                    <i className={styles.address} />
                    云南省昆明市
                  </p>
                </div>

                <Divider style={{ marginTop: 16 }} dashed />
                {/* <div className={styles.tags}>
                    <div className={styles.tagsTitle}>标签</div>
                    {currentUser.tags.concat(newTags).map(item => (
                      <Tag key={item.key}>{item.label}</Tag>
                    ))}
                    {inputVisible && (
                      <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                      />
                    )}
                    {!inputVisible && (
                      <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                      >
                        <Icon type="plus" />
                      </Tag>
                    )}
                  </div> */}
              </div>
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              loading={listLoading}
              title={<strong>我的简介</strong>}
            >
              <p>
                电话：
                {currentUser.userPhone}
                <Divider>萌萌哒的分割线</Divider>
                性别：
                {currentUser.userSex}
              </p>
            </Card>
            <Card style={{ marginTop: 10 }}>{this.renderMyDiscuss()}</Card>
          </Col>
        </Row>
        <Modal
          visible={this.state.inputVisible}
          title="修改信息"
          onCancel={() => {
            this.setState({
              inputVisible: false,
            });
          }}
          onOk={this.handleSubmit}
        >
          <Form>
            <FormItem {...formItemLayout} label="头像">
              {getFieldDecorator('upload', {
                valuePropName: 'fileList',
                getValueFromEvent: normFile,
              })(
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  beforeUpload={this.handleFile}
                  data={this.state.qiniu}
                  onChange={this.handleFileChange}
                  showUploadList={false}
                  action="http://upload-z2.qiniu.com"
                >
                  {imgUrl ? (
                    <img src={imgUrl} alt="avatar" width="100" height="100" />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="电话号码">
              {getFieldDecorator('userPhone', {})(
                <Input.TextArea placeholder="请输入学院名" autosize />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="学院名">
              {getFieldDecorator('userCollege', {})(
                <Input.TextArea placeholder="请输入学院名" autosize />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="昵称">
              {getFieldDecorator('userNickname', {})(
                <Input.TextArea placeholder="请输入昵称" autosize />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="年级">
              {getFieldDecorator('userGrade', {})(
                <Input.TextArea placeholder="请输入年级" autosize />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="专业">
              {getFieldDecorator('userMajor', {})(
                <Input.TextArea placeholder="请输入专业" autosize />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="性别">
              {getFieldDecorator('userSex', {})(
                <Radio.Group onChange={this.onChange}>
                  <Radio value="男">男</Radio>
                  <Radio value="女">女</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="密码">
              {getFieldDecorator('password', {})(<Input placeholder="设置新的密码" />)}
            </FormItem>
          </Form>
        </Modal>
      </GridContent>
    );
  }
}

export default Center;
