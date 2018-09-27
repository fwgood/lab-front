import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Select,
  Tag,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './ManageCourse.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ course, loading }) => ({
  course,
  loading: loading.models.course,
}))
@Form.create()
class BasicList extends PureComponent {
  state = { visible: false, done: false, type: 'all' };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentWillMount() {
    const { dispatch } = this.props;
    console.log(23);
    dispatch({
      type: 'course/fetchAllCourse',
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  getList = () => {
    const type = this.state.type;
    if (type == 'all') {
      return this.props.course.list;
    }
    if (type == 'waiting') {
      return this.props.course.list.filter(e => e.courseState == 0 || e.courseState == null);
    }
    if (type == 'success') {
      return this.props.course.list.filter(e => e.courseState == 1);
    }
    if (type == 'fail') {
      return this.props.course.list.filter(e => e.courseState == 2);
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'list/submit',
        payload: { id, ...fieldsValue },
      });
    });
  };

  handleTypeChange = e => {
    this.setState({
      type: e.target.value,
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/submit',
      payload: { id },
    });
  };

  render() {
    const {
      course: { list },
      loading,
    } = this.props;

    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, current = {} } = this.state;

    const editAndDelete = (key, currentItem) => {
      console.log(currentItem);
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: '删除任务',
          content: '确定删除该任务吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(currentItem.id),
        });
      } else if (key === 'pass') {
        this.props.dispatch({
          type: 'course/changeCourseState',
          payload: {
            courseId: currentItem.courseId,
            courseState: 1,
          },
        });
      } else if (key === 'reject') {
        this.props.dispatch({
          type: 'course/changeCourseState',
          payload: {
            courseId: currentItem.courseId,
            courseState: 2,
          },
        });
      } else if (key === 'del') {
        this.props.dispatch({
          type: 'course/deleteCourse',
          payload: {
            courseId: currentItem.courseId,
            courseState: currentItem.courseState,
          },
        });
      }
    };

    const modalFooter = { footer: null, onCancel: this.handleDone };

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all" onChange={this.handleTypeChange}>
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="waiting">待审核</RadioButton>
          <RadioButton value="success">审核通过</RadioButton>
          <RadioButton value="fail">审核失败</RadioButton>
        </RadioGroup>
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 50,
      total: 50,
    };

    const ListContent = ({ data: { userName, courseState, term } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>开课人</span>
          <p>{userName}</p>
        </div>

        <div className={styles.listContentItem}>
          <span>课程状态</span>
          {!courseState ? (
            <div>
              <Tag color="#108ee9">待审核</Tag>
            </div>
          ) : null}
          {courseState == 1 ? (
            <div>
              <Tag color="#87d068">已通过</Tag>
            </div>
          ) : null}
          {courseState == 2 ? (
            <div>
              <Tag color="#f50">未通过</Tag>
            </div>
          ) : null}
        </div>

        <div className={styles.listContentItem}>
          <span>开课学期</span>
          {term == '20172' ? <p>2017秋季学期</p> : null}
          {term == '20181' ? <p>2018春季学期</p> : null}
          {term == '20182' ? <p>2018秋季学期</p> : null}
          {term == '20191' ? <p>2019春季学期</p> : null}
        </div>
        {/* <div className={styles.listContentItem}>
          <span>开始时间</span>
          <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
        </div> */}
      </div>
    );

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
            {!props.current.courseState ? <Menu.Item key="pass">通过</Menu.Item> : null}
            {!props.current.courseState ? <Menu.Item key="reject">拒绝</Menu.Item> : null}
            <Menu.Item key="del">删除</Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );
    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="操作成功"
            description="一系列的信息描述，很短同样也可以带标点。"
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }

      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="课程ID" {...this.formLayout}>
            <span className="ant-form-text">{current.courseId}</span>
          </FormItem>{' '}
          <FormItem label="课程名称" {...this.formLayout}>
            <span className="ant-form-text">{current.courseName}</span>
          </FormItem>
          <FormItem label="课程内容" {...this.formLayout}>
            <span className="ant-form-text">{current.courseContent}</span>
          </FormItem>
          <FormItem label="开课教师" {...this.formLayout}>
            <span className="ant-form-text">{current.userName}</span>
          </FormItem>{' '}
          <FormItem label="选课密码" {...this.formLayout}>
            <span className="ant-form-text">{current.coursePassword}</span>
          </FormItem>{' '}
          <FormItem label="开课学期" {...this.formLayout}>
            <span className="ant-form-text">{current.term}</span>
          </FormItem>
          <FormItem label="" {...this.formLayout}>
            <span className="ant-form-text" />
          </FormItem>
        </Form>
      );
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="所有课程" value={`${list.length}门课程`} bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info
                  title="已审核课程"
                  value={`${
                    list.filter(e => e.courseState == 1 || e.courseState == 2).length
                  }门课程`}
                  bordered
                />
              </Col>
              <Col sm={8} xs={24}>
                <Info
                  title="待审核课程"
                  value={`${
                    list.filter(e => e.courseState == 0 || e.courseState == null).length
                  }门课程`}
                />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="课程列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={this.getList()}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item);
                      }}
                    >
                      查看
                    </a>,
                    <MoreBtn current={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar shape="square" size="large">
                        {item.courseName[0]}
                      </Avatar>
                    }
                    title={item.courseName}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title="课程详情"
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default BasicList;
