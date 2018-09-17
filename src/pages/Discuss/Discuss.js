import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Input, Form, Card, Select, List, Tag, Icon, Avatar, Button, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SimpleMDE from 'react-simplemde-editor';
import 'simplemde/dist/simplemde.min.css';
import MarkDodn from 'react-markdown';
import styles from './Discuss.less';

const pageSize = 5;

@Form.create()
@connect(({ list, loading, blog }) => ({
  list,
  blog,
  loading: loading.models.blog,
}))
class SearchList extends Component {
  state = {
    editPanelVisible: false,
    mdeValue: '',
    title: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'blog/queryBlog',
      payload: {
        courseId: 0,
        page: 1,
        pageSize: 20,
      },
    });
  }
  fetchMore = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/appendFetch',
      payload: {
        count: pageSize,
      },
    });
  };

  searchDiscuss = value => {
    // 搜索处理
    this.props.dispatch({
      type: 'blog/search',
      payload: {
        param:value,
        courseId: 0,
        page: 1,
        pageSize: 20,
      },
    });
  };

  editDiscuss = () => {
    this.setState({
      editPanelVisible: !this.state.editPanelVisible,
    });
  };

  handleChange = value => {
    this.setState({ mdeValue: value });
  };

  handleTitleChange = e => {
    this.setState({
      title: e.target.value,
    });
  };

  renderMarkDown = () => (
    <div>
      <Card
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '8px 32px 32px 32px' }}
      >
        <Input
          placeholder="请在此键入标题"
          value={this.state.title}
          onChange={this.handleTitleChange}
        />

        <div style={{ marginTop: 10 }}>
          <SimpleMDE onChange={this.handleChange} />
          {/* <SimpleMDE
  value={this.state.textValue}
  onChange={this.handleChange}
  extraKeys={extraKeys}
/> */}
        </div>
        <div style={{ textAlign: 'right' }}>
          <Button onClick={this.publishDiscuss} type="primary" size="large" ghost>
            发布
            <Icon type="twitter" theme="outlined" />
          </Button>
        </div>
      </Card>
    </div>
  );

  publishDiscuss = () => {
    if (this.state.mdeValue == '') {
      message.warn('您还没有输入博客内容');
    }
    if (this.state.title == '') {
      message.warn('您还没有输入标题');
    } else {
      this.props.dispatch({
        type: 'blog/addBlog',
        payload: {
          blogTitle: this.state.title,
          blogContent: this.state.mdeValue,
          blogTime: moment(new Date()).format('YYYY-MM-DD HH:mm'),
          courseId: '0',
        },
      });
      this.setState({
        mdeValue: '',
        title: '',
        editPanelVisible: false,
      });
    }
  };

  render() {
    const {
      blog: { blogs },
      loading,
    } = this.props;
    console.log(blogs);
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

    const loadMore =
      blogs.length > 0 ? (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
            {loading ? (
              <span>
                <Icon type="loading" /> 加载中...
              </span>
            ) : (
              '加载更多'
            )}
          </Button>
        </div>
      ) : null;

    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <Input.Group compact>
          <Button size="large" onClick={() => this.editDiscuss()}>
            写点东西
            <Icon type="form" theme="outlined" />
          </Button>
          <Input.Search
            placeholder="请输入"
            enterButton="搜索"
            size="large"
            onSearch={value => this.searchDiscuss(value)}
            style={{ width: 522 }}
          />
        </Input.Group>
      </div>
    );
    return (
      <div>
        <PageHeaderWrapper title="" content={mainSearch} />
        {this.state.editPanelVisible ? this.renderMarkDown() : null}

        <Fragment>
          <Card
            style={{ marginTop: 24 }}
            bordered={false}
            bodyStyle={{ padding: '8px 32px 32px 32px' }}
          >
            <List
              size="large"
              loading={blogs.length === 0 ? loading : false}
              rowKey="id"
              itemLayout="vertical"
              loadMore={loadMore}
              dataSource={blogs}
              renderItem={item => (
                <List.Item
                  key={item.id}
                  actions={[
                    <IconText type="star-o" text={item.star} />,
                    <IconText type="like-o" text={item.like} />,
                    <a
                      onClick={() => {
                        console.log('点赞');
                      }}
                    >
                      <IconText type="message" text={item.message} />
                    </a>,
                  ]}
                  extra={<div className={styles.listItemExtra} />}
                >
                  <List.Item.Meta
                    title={<a className={styles.listItemMetaTitle}>{item.blogTitle}</a>}
                    description={
                      <span>
                        <Tag>世界历史</Tag>
                        <Tag>人文</Tag>
                        <Tag>ssss</Tag>
                      </span>
                    }
                  />
                  <a
                    className={styles.listItemMetaTitle}
                    onClick={() => {
                      this.props.history.push('/account/discuss/detail', item);
                    }}
                  >
                    <MarkDodn source={item.blogContent} />
                    <ListContent data={item} />
                  </a>
                </List.Item>
              )}
            />
          </Card>
        </Fragment>
      </div>
    );
  }
}

export default SearchList;
