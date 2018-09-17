import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Icon,
  List,
  Modal,
  Input,
  Form,
  AutoComplete,
  message,
  Select,
  Popconfirm,
  Popover,
  Table,
} from 'antd';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import debounce from 'lodash/debounce';
import { Avatar } from 'antd';
import styles from './CurrentTerm.less';
import icon2 from '../../assets/icon2.jpg';
import { getAuth } from '@/utils/auth';

const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};
@connect(({ login, loading, course }) => ({
  login,
  course,
  loading: loading.models.course,
}))
@Form.create()
class CardList extends PureComponent {
  constructor(params) {
    super(params);
  }

  state = {
    quitCourseVisible: false,
    courseInfoVisible: false,
    currentCourse: {},
    addCourseVisible: false,
    searchCourseVisible: false,
    fetching: false,
    current: {},
    pass: '',
    passVisible: 0,
    inputValue:''
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'course/fetchMyCourse',
      payload: {},
    });
  }

  chekDetail = (flag, item) => {
    console.log(item);
    this.props.history.push('/course/detail', item);
  };


  addOperate = () => {
    if (getAuth().role == '1') {
      this.props.history.push('/manage-course/add-course');
      // 跳转申请开课
    } else getAuth().role == '2';
    {
      this.fetchUser();
      this.setState({
        addCourseVisible: true,
      });
      // 显示添加课程
    }
  };

  hideQuitDialog = () => {
    this.setState({
      quitCourseVisible: false,
    });
  };

  executeQuit = () => {
    this.props.dispatch({
      type: 'course/quitCourse',
      payload: {
        courseId: this.state.currentCourse.courseId,
      },
    });
    this.setState({
      quitCourseVisible: false,
    });
    // 执行退选操作
  };

  changeSearch = visible => () => {
    this.setState({
      visible,
    });
  };

  quitOrInfo = item => {
    this.setState({
      currentCourse: item,
    });
    if (getAuth().role == 2) {
      console.log('退选');

      this.setState({
        quitCourseVisible: true,
      });
      console.log(this.state.quitCourseVisible);
    }
    if (getAuth().role == 1) {
      this.setState({
        courseInfoVisible: true,
      });
      // 发布通知
    }
  };

  executeInfo = () => {
    // 执行发送通知
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'notice/addNotice',
          payload: {
            ...values,
            announncementCourseId: this.state.currentCourse.courseId,
            announncementType: 'string',
            announncementTime: moment(new Date()).format('YYYY-MM-D H-m'),
          },
        });
        this.setState({
          courseInfoVisible: false,
        });
      }
    });
  };

  hideInfoDialog = () => {
    this.setState({
      courseInfoVisible: false,
    });
  };

  handleAdd = record => () => {
    console.log(record);
    this.setState({
      current: record,
      passVisible: record.courseId,
    });
  };

  fetchUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'course/searchCourse',
      payload: {},
    });
  };

  renderQuitDialog() {
    return (
      <Modal
        title="请确认当前操作"
        visible={this.state.quitCourseVisible}
        onOk={this.executeQuit}
        onCancel={this.hideQuitDialog}
        okText="确认"
        cancelText="取消"
      >
        <p>确定退选当前课程</p>
      </Modal>
    );
  }

  handleCancel = () => {
    this.setState({
      addCourseVisible: false,
    });
  };

  handlePass = () => {
    this.props.dispatch({
      type: 'course/selectCourse',
      payload: {
        password: encodeURI(this.state.pass),
        courseId: this.state.current.courseId,
      },
    });
    this.setState({
      passVisible: 0,
    });
  };

  handlePassChange = e => {
    this.setState({
      pass: e.target.value,
    });
  };

  renderInfo() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="向java班发送通知"
        visible={this.state.courseInfoVisible}
        onOk={this.executeInfo}
        onCancel={this.hideInfoDialog}
        okText="发送"
        cancelText="取消"
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="标题">
            {getFieldDecorator('announncementTitle', {
              rules: [
                {
                  message: '请输入标题',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="公告内容">
            {getFieldDecorator('announncementContent', {
              rules: [
                {
                  message: '请输入内容',
                },
              ],
            })(<TextArea />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }

  render() {
    const {
      course: { list },
      loading,
    } = this.props;

    const teaInfo = {
      title: '我的班级',
      courseOPerate: '开设课程',
      courseInfo: '',
    };
    const stuInfo = {
      title: '当前学期',
      courseOPerate: '添加课程',
      courseInfo: '',
    };

    const extraContent = (
      <div className={styles.extraImg}>
        <img alt="这是一个标题" src={icon2} />
      </div>
    );
    const columns = [
      {
        title: '课程ID',
        dataIndex: 'courseId',
        key: 'courseId',
      },
      {
        title: '课程名称',
        dataIndex: 'courseName',
        key: 'courseName',
      },
      {
        title: '开课老师',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '开课学期',
        dataIndex: 'term',
        key: 'term',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Popover
              content={
                <div>
                  <Input value={this.state.pass} onChange={this.handlePassChange} style={{width:120}}/>
                  <Button onClick={this.handlePass}>选课</Button>
                </div>
              }
              title="请输入选课密码"
              visible={this.state.passVisible == record.courseId}
            >
              <Button onClick={this.handleAdd(record)}>选课</Button>
            </Popover>
          </span>
        ),
      },
    ];
    return (
      <PageHeaderWrapper
        title={getAuth().role == '2' ? stuInfo.title : teaInfo.title}
        extraContent={extraContent}
        content={<div />}
      >
        <div className={styles.cardList}>
          <Modal
            title="可选课程列表"
            visible={this.state.addCourseVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <Table dataSource={this.props.course.course} columns={columns} loading={loading} rowKey='courseId'/>
          </Modal>

          <div>{this.renderQuitDialog()}</div>
          <div>{this.renderInfo()}</div>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...list]}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[
                      <a onClick={() => this.chekDetail(true, item)}>查看</a>,
                      <a onClick={() => this.quitOrInfo(item)}>
                        {getAuth().role == '2' ? '退选' : '发布通知'}
                      </a>,
                    ]}
                  >
                    <Card.Meta
                      avatar={<Avatar size="large">{item.courseName[0]}</Avatar>}
                      title={<a>{item.courseName}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.courseContent}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  {/* {this.state.searchCourseVisible ? (
                    <div className={styles.search}>
                      <div>
                        <AutoComplete
                          style={{ width: 160 }}
                          placeholder="input here"
                          onChange={this.handleSearchChange}
                          onSelect={this.handleSelect}
                          dataSource={this.props.course.course.map(e => ({
                            value: e.courseId,
                            text: `${e.courseId}/${e.courseName}`,
                          }))}
                        />
                        <Select
                          labelInValue
                          onChange={this.handleCurrentChange}
                          onSearch={this.handleSearchChange}
                          style={{ width: 160 }}
                          showSearch
                        >
                          {this.props.course.course.map(e => (
                            <Select.Option value={e.courseId}>{e.courseName}</Select.Option>
                          ))}
                        </Select>
                        <Button onClick={this.handleAdd}>添加</Button>
                      </div>
                    </div>
                  ) : ( */}
                  <Button
                    type="dashed"
                    onClick={() => this.addOperate()}
                    className={styles.newButton}
                  >
                    <Icon type="plus" />{' '}
                    {getAuth().role != '2' ? teaInfo.courseOPerate : stuInfo.courseOPerate}
                  </Button>
                  {/* )} */}
                </List.Item>
              )
            }
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
