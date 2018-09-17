import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, List, Input, Skeleton } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import moment from 'moment';
import { Button } from 'antd/lib/radio';
import reqwest from 'reqwest';
import MarkDown from 'react-markdown';
import stylesArticles from '../List/Articles.less';
import styles from './DiscussDetail.less';

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;

@connect(({ loading, user, project, login, list, blog }) => ({
  list,
  login,
  blog,
  commentloading: loading.effects['blog/getComment'],
  listLoading: loading.effects['list/fetch'],
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  project,
  projectLoading: loading.effects['project/fetchNotice'],
}))
class Center extends PureComponent {
  state = {
    currentOperation: '',
    commentOrReply: false,
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    comment: [],
    blog: {
      id: 2012282899,
      name: '楼主',
      title: '我是标题',
      time: '2018-09-14T07:45:25.244Z',
      message: 89,
      like: 33,
      star: 99,
      content:
        '少林寺觉远禅师看护《楞伽经》不力，导致经书被尹克西和潇湘子盗走。潇湘子和尹克西互相猜忌残杀，临终之前幡然醒悟，委托何足道向觉远转达经书的下落。何足道接受委托，并向少林寺发出挑战。适逢郭靖、黄蓉的女儿郭襄前往少林寺寻找杨过，从罗汉掌首座无色禅师处得知何足道挑战少林武功的消息，遂在约定日子只身前往观战。觉远禅师的弟子张君宝在与何足道一战之中暴露了偷学武功的事实，犯了寺规，受到少林寺众僧的围攻。于是觉远携张君宝、郭襄突出重围，却在途中圆寂。张君宝与郭襄分手之后，只身前往武当山修学觉远生前传授的几阳真经，并深得道家冲虚圆通之功的精髓，加以融会贯通，创出了武当一派武功，遂自号三丰。',
      messages: [
        {
          id: 20151120222,
          name: 'shuan',
          time: '2018-09-14T07:45:25.244Z',
          content: 'you problly give me a name so that i makes sounds',
        },
        {
          id: 12222222222,
          name: 'sweepingmonk',
          time: '2018-09-14T07:45:25.244Z',
          content: 'you problly give me a name so that i makes sounds',
        },
      ],
    },
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'blog/getComment',
      payload: {
        parentId: this.props.location.state.blogId,
      },
    });
    // this.getData(res => {
    //   this.setState({
    //     initLoading: false,
    //     data: res.results,
    //     list: res.results,
    //   });
    // });
  }

  onLoadMore = () => {
    this.setState({
      loading: true,
      list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
    });
    this.getData(res => {
      const data = this.state.data.concat(res.results);
      this.setState(
        {
          data,
          list: data,
          loading: false,
        },
        () => {
          // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
          // In real scene, you can using public method of react-virtualized:
          // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
          window.dispatchEvent(new Event('resize'));
        }
      );
    });
  };

  getData = callback => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: res => {
        callback(res);
      },
    });
  };

  replay = item => {
    this.setState({
      commentOrReply: true,
      currentOperation: `回复${item.name.last}`,
    });
    console.log(this.state.currentOperation);
  };

  renderComment() {
    const { initLoading, loading, list } = this.state;
    const loadMore =
      !initLoading && !loading ? (
        <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
          <Button onClick={this.onLoadMore}>loading more</Button>
        </div>
      ) : null;
    console.log(this.props.blog.blogs);
    return (
      <List
        className="demo-loadmore-list"
        loading={this.props.commentloading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={this.props.blog.comments}
        renderItem={item => (
          <List.Item
            actions={[
              <a onClick={() => this.replay(item)} href="#replay">
                回复
              </a>,
            ]}
            // extra={
            //   <div className={styles.subComment}>
            //     <div className={styles.subCommentImage}>
            //       <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            //     </div>
            //     <div className={styles.subCommentLay}>
            //       <div>
            //         gauthier
            //         <span style={{ float: 'right' }}>2018-12323</span>
            //       </div>
            //       <div className={styles.subCommentContent}>
            //         Ant Desigvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvn, a
            //         design
            //       </div>
            //     </div>
            //   </div>
            // }
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                // title={<a href="https://ant.design">{item.name.last}</a>}
                description={item.blogsreviewContent}
              />
              <div>时间 : {item.blogsreviewTime}</div>
            </Skeleton>
          </List.Item>
        )}
      />
    );
  }

  exeComment = () => {
    // addComment
    this.props.dispatch({
      type: 'blog/addComment',
      payload: {
        blogsreviewContent: this.state.comment,
        blogsreviewParentid: this.props.location.state.blogId,
        blogsreviewTime: new Date(),
      },
    });
  };

  handleComment = e => {
    this.setState({
      comment: e.target.value,
    });
  };

  renderMyDiscuss() {
    const {
      list: { list },
      location: { state },
    } = this.props;
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );
    const ListContent = ({ data: { content, updatedAt, owner } }) => (
      <div>
        <div className={stylesArticles.extra} style={{ marginBottom: 5 }}>
          <Avatar
            src="https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png"
            size="small"
          />
          <a>{owner}</a> 发布在
          <a>未知</a>
          <em style={{ marginLeft: 5 }}>{moment(updatedAt).format('YYYY-MM-DD HH:mm')}</em>
        </div>
        <div className={stylesArticles.description}>{`${content}dddddddddddddd`}</div>
      </div>
    );
    return (
      <Card
        bordered={false}
        bodyStyle={{ padding: '0px' }}
        title={<a style={{ fontSize: 22 }}>{state.blogTitle}</a>}
      >
        <Row style={{ marginTop: 15, marginBottom: 0 }}>
          <span>
            <Tag>machine learning</Tag>
            <Tag>julia</Tag>
            <Tag>班级2</Tag>
          </span>
        </Row>
        <Row className={styles.listContent}>
          <div className={styles.description}>
            <div className={styles.extra}>
              <Avatar size="small">{state.userNickname[0]}</Avatar>
              <a>{`  ${state.userNickname}`}</a> 发布在
              <a> 未知</a>
              <em style={{ marginLeft: 5 }}>{state.blogTime}</em>
            </div>
            <br />
            <MarkDown source={state.blogContent} />
          </div>
        </Row>
        <Row style={{ marginTop: 15 }}>
          <IconText type="star-o" text={this.state.blog.star} />
          <Divider type="vertical" className={styles.divid} />
          <IconText type="like-o" text={this.state.blog.like} />
          <Divider type="vertical" className={styles.divid} />
          <a
            onClick={() => {
              this.setState({
                currentOperation: '',
              });
            }}
          >
            <IconText type="message" text={this.state.blog.message} />
          </a>
        </Row>
        <Row>
          <div>
            <div className={styles.commentInput}>
              <Input.TextArea
                id="replay"
                placeholder={
                  this.state.currentOperation == '' ? '留下你的观点' : this.state.currentOperation
                }
                autosize={{ minRows: 2, maxRows: 6 }}
                value={this.state.comment}
                onChange={this.handleComment}
              />
              <div style={{ marginTop: 10, textAlign: 'right' }}>
                <Button onClick={this.exeComment}>
                  {'发表看法  '}
                  <Icon type="eye" theme="outlined" />
                </Button>
              </div>
            </div>
          </div>
          <div className={styles.commentInput}>{this.renderComment()}</div>
        </Row>
      </Card>
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
          <Col lg={24} md={24}>
            <Card style={{ marginTop: 10 }}>{this.renderMyDiscuss()}</Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
