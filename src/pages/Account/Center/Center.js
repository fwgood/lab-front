import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, List } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import moment from 'moment';
import MarkDown from 'react-markdown';
import styles from './Center.less';
import stylesArticles from '../../List/Articles.less';

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
class Center extends PureComponent {
  state = {
    newTags: [],
    inputVisible: false,
    inputValue: '',
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
              <IconText type="star-o" text={item.star} />,
              <IconText type="like-o" text={item.like} />,
              <IconText type="message" text={item.message} />,
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
                  <Tag>machine learning</Tag>
                  <Tag>julia</Tag>
                  <Tag>班级2</Tag>
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
  editProfile=(user)=>{
    console.log(user)
  }

  render() {
    const {
      listLoading,
      currentUser,
      currentUserLoading,
      project: { notice },
    } = this.props;

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
                  <a onClick={()=>this.editProfile(currentUser)}><Icon type="edit" theme="outlined" /></a>
                  <div >该用户很懒，暂时没有签名</div>
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
              title={<strong>我的动态</strong>}
            >
              <p>今天是个好日子</p>
            </Card>
            <Card style={{ marginTop: 10 }}>{this.renderMyDiscuss()}</Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
