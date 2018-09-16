import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, List } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';
import moment from 'moment';
import stylesArticles from '../../List/Articles.less';
import MarkDodn from 'react-markdown'

@connect(({ loading, user, project, login,list }) => ({
  list,
  login,
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
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
    dispatch({
      type: 'project/fetchNotice',
    });
  }

  renderMyDiscuss() {
    const {
      list: { list },
    } = this.props;
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );
    const ListContent = ({ data: { content, updatedAt, avatar, owner, href } }) => (
      <div className={stylesArticles.listContent}>
        <div className={stylesArticles.description}>{content}</div>
        <div className={stylesArticles.extra}>
          <Avatar src={avatar} size="small" />
          <a href={href}>{owner}</a> 发布在
          <a href={href}>{href}</a>
          <em>{moment(updatedAt).format('YYYY-MM-DD HH:mm')}</em>
        </div>
      </div>
    );
    return (
      <List
        size="large"
        className={styles.articleList}
        rowKey="id"
        itemLayout="vertical"
        dataSource={list}
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
            <MarkDodn source={"# This is a header\n\nAnd this is a paragraph"} />
            <ListContent data={item} />
          </List.Item>
        )}
      />
    );
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
              </div>
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              loading={listLoading}
              title={<strong >我的动态</strong>}

            >
            <p>今天是个好日子</p>
            </Card>
            <Card 
            style={{marginTop:10}}
            >
            {this.renderMyDiscuss()}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
