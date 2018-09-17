import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Popconfirm,
  Col,
  Card,
  Form,
  Modal,
  Input,
  Icon,
  Button,
  Select,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './UserList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['管家', '教主', '学生'];

@connect(({ rule, loading, userlist }) => ({
  rule,
  userlist,
  loading: loading.models.userlist,
}))
@Form.create()
class TableList extends React.Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    updateAuthVisible: false,
    addVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    currentAuth: '2',
    status: '-1',
    search: '',
    currentUser:{}
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userlist/queryList',
      payload: {
        page: 0,
        pageSize: 0,
        sort: 'asc',
      },
    });
  }

  getData = () =>
    this.props.userlist.users.filter(e => {

      if (this.state.status == -1&& e.userName.match(new RegExp(this.state.search))) {
        return e.userName.match(new RegExp(this.state.search));
      } 
        return e.userRole == this.state.status || e.userName.match(new RegExp(this.state.search));
      
    });
  columns = [
    {
      title: '账号',
      dataIndex: 'userName',
    },
    {
      title: '昵称',
      dataIndex: 'userNickname',
    },
    {
      title: '权限',
      dataIndex: 'userRole',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
        {
          text: status[2],
          value: 2,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a
            onClick={()=>this.md(record)}
          >
            修改
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="此操作不可逆！"
            onConfirm={() => this.confirm(record)}
            onCancel={this.cancel}
            okText="Yes"
            cancelText="No"
          >
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  confirm = record => {
    console.log(record)
    this.props.dispatch({
      type:'userlist/delUser',
      payload:{
        userId:record.userId
      }
    })
  };
  md = record => {
      console.log(record)
      this.setState({ updateAuthVisible:true });
      this.setState({
        currentUser:record
      })
  };
  cancel = e => {
    message.error('Click on No');
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  handleChange = value => {
    this.setState({
      currentAuth: value,
    });
  };

  handleBlur = () => {
    console.log('blur');
  };

  handleFocus = () => {
    console.log('focus');
  };

  confirmAuth = () => {
    console.log(`当前选择权限，${this.state.currentAuth}`);
    this.setState({
      updateAuthVisible:false
    })
    this.props.dispatch({
      type:'userlist/modifyUser',
      payload:{
        role:this.state.currentAuth,
        userId :this.state.currentUser.userId
      }
    })
  };

  renderUpdateAuth = () => (
    <div>
      <Modal
        title="修改权限"
        style={{ textAlign: 'center', width: 300 }}
        visible={this.state.updateAuthVisible}
        onOk={() => this.confirmAuth()}
        onCancel={() => {
          this.setState({ updateAuthVisible: !this.state.updateAuthVisible });
        }}
      >
        <Select
          showSearch
          style={{ width: 300 }}
          placeholder="选择权限"
          optionFilterProp="children"
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          defaultValue="0"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          <Select.Option value={"0"}>管家</Select.Option>
          <Select.Option value={"1"}>教主</Select.Option>
          <Select.Option value={"2"}>学生</Select.Option>
        </Select>
        ,
      </Modal>
    </div>
  );

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
    this.setState({
      status:'-1',
      search:""
    })
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        status: values.status,
        search: values.name,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="权限">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">管家</Option>
                  <Option value="1">教主</Option>
                  <Option value="2">学生</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      rule: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="用户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              {/* <Button
                icon="plus"
                type="primary"
                onClick={() => this.setState({ addVisible: !this.state.addVisible })}
              >
                新建
              </Button> */}
              {this.state.addVisible ? <Card style={{ marginTop: 10 }}>此操作不可逆</Card> : null}
            </div>
            {this.renderUpdateAuth()}
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={{
                list: this.getData(),
              }}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
