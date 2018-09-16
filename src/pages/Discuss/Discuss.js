import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Input, Form, Card, Select, List, Tag, Icon, Avatar, Button } from 'antd';
import styles from './Discuss.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SimpleMDE from 'react-simplemde-editor';
import 'simplemde/dist/simplemde.min.css';
import MarkDodn from 'react-markdown'

const pageSize = 5;

@Form.create()
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
class SearchList extends Component {
  state = {
    editPanelVisible: false,
    mdeValue: '',
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 5,
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
    //搜索处理
    console.log(value);
  };
  editDiscuss = () => {
    this.setState({
      editPanelVisible: !this.state.editPanelVisible,
    });
  };
  handleChange = value => {
    this.setState({ mdeValue: value });
  };
  renderMarkDown = () => {
    return (
      <div>
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
          <div style={{ marginTop: 10 }}>
            <SimpleMDE onChange={this.handleChange} />
            {/* <SimpleMDE
  value={this.state.textValue}
  onChange={this.handleChange}
  extraKeys={extraKeys}
/> */}
          </div>
          <div style={{textAlign:"right"}}><Button onClick={this.publishDiscuss} type="primary" size="large" ghost>发布<Icon type="twitter" theme="outlined" /></Button></div>
        </Card>
      </div>
    );
  };
  publishDiscuss=()=>{
      console.log("发布博客")
  }

  render() {
    const {
      list: { list },
      loading,
    } = this.props;

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    const ListContent = ({ data: { content, updatedAt, avatar, owner, href } }) => (
      <div className={styles.listContent}>
        <div className={styles.description}>{content}</div>
        <div className={styles.extra}>
          <Avatar src={avatar} size="small" />
          <a href={href}>{owner}</a> 发布在
          <a href={href}>{href}</a>
          <em>{moment(updatedAt).format('YYYY-MM-DD HH:mm')}</em>
        </div>
      </div>
    );

    const loadMore =
      list.length > 0 ? (
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
        <PageHeaderWrapper title="搜索列表" content={mainSearch} />
        {this.state.editPanelVisible ? this.renderMarkDown() : null}

        <Fragment>
          <Card
            style={{ marginTop: 24 }}
            bordered={false}
            bodyStyle={{ padding: '8px 32px 32px 32px' }}
            
          >
            <List
              size="large"
              loading={list.length === 0 ? loading : false}
              rowKey="id"
              itemLayout="vertical"
              loadMore={loadMore}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  key={item.id}
                  actions={[
                    <IconText type="star-o" text={item.star} />,
                    <IconText type="like-o" text={item.like} />,
                    <a onClick={()=>{console.log("点赞")}}><IconText   type="message" text={item.message} /></a>,
                  ]}
                  extra={<div className={styles.listItemExtra} />}
                >
                  <List.Item.Meta
                    title={
                      <a className={styles.listItemMetaTitle}>
                        {item.title}
                      </a>
                    }
                    description={
                      <span>
                        <Tag>世界历史</Tag>
                        <Tag>人文</Tag>
                        <Tag>ssss</Tag>
                      </span>
                    }
                  />
                  <a className={styles.listItemMetaTitle} onClick={()=>{this.props.history.push("/account/discuss/detail")}}>
                  <MarkDodn source={"# This is a header\n\nAnd this is a paragraph"} />
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
