import React, { PureComponent } from 'react';
import numeral from 'numeral';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
import { connect } from 'dva';
import {
  notification,
  Row,
  Col,
  Form,
  DatePicker,
  Card,
  Select,
  Icon,
  Avatar,
  Input,
  List,
  Tooltip,
  Button,
  Menu,
  Modal,
  Upload,
  message,
  Popover,
} from 'antd';

import { formatWan } from '@/utils/utils';
import styles from './CourseInfo.less';
import { getAuth } from '@/utils/auth';

const Dragger = Upload.Dragger;
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};
const Authorized = RenderAuthorized(getAuthority());
const rangeConfig = {
  rules: [{ type: 'array', required: true, message: 'Please select time!' }],
};

const normFile = e => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

@Form.create()
@connect(({ list, loading, lab }) => ({
  list,
  lab,
  loading: loading.models.lab,
}))
@Form.create()
class FilterCardList extends PureComponent {
  state = {
    labVisible: false,
    commitVisible: false,
    currentLab: {},
    qiniu: {
      token:
        'rcHe5WjHZQ9cfbxNWlPao4zNFgLGPZijSJei264R:kc6D4ZiSzdT3EdPxPanibrI2KU4=:eyJzY29wZSI6ImV0bXMiLCJkZWFkbGluZSI6MTYwNjc1MjAwMH0=',
      file: {},
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    if(getAuthority=='1'){
      dispatch({
        type: 'lab/queryAll',
        payload: {
          courseId: this.props.location.state.courseId,
        },
      });
    }else{
      dispatch({
        type: 'lab/queryMyLab',
        payload: {
          courseId: this.props.location.state.courseId,
        },
      });
    }
    console.log();
  }

  okHandle = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!values.upload) {
        message.error('请上传文件');
        return false;
      }
      this.props.dispatch({
        type: 'lab/addLab',
        payload: {
          labContent: values.labContent,
          labName: values.labName,
          labDeadline: values.setime[1].format('YYYY-MM-DD HH-m'),
          labStarttime: values.setime[1].format('YYYY-MM-DD HH-mm'),
          labUrl: `http://file.lli.fun/${values.upload[0].response.key}`,
          courseId: this.props.location.state.courseId,
        },
      });
      // 处理发布作业
      this.setState({
        labVisible: false,
      });
    });
  };

  okCommit = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!values.upload) {
        message.error('请上传文件');
        return false;
      }
      console.log(this.state.currentLab);
      console.log(values.upload[0].response);
      this.props.dispatch({
        type: 'lab/add',
        payload: {
          labId: this.state.currentLab.labId,
          commitContent: values.desc,
          commitUrl: `http://file.lli.fun/${values.upload[0].response.key}`,
        },
      });
      // 处理发布作业
      this.setState({
        commitVisible: false,
      });
    });
  };
  // okCommit = () => {
  //   // 处理提交作业
  //   this.setState({
  //     commitVisible: false,
  //   });
  // };

  handleFileChange = e => {
    console.log(e);
  };

  handleFile = f => {
    this.setState({
      qiniu: {
        ...this.state.qiniu,
        file: f,
      },
    });
  };

  cancelAddLab = () => {
    this.setState({
      labVisible: false,
      commitVisible: false,
    });
  };

  showAddLab = () => {
    console.log('add lab');
    this.setState({
      labVisible: true,
    });
  };

  renderAddLab() {
    const { getFieldDecorator } = this.props.form;
    console.log(getAuthority()[0] === '1');

    return (
      <Modal
        destroyOnClose
        title={getAuthority()[0] === '1' ? '发布' : '提交'}
        visible={this.state.labVisible}
        onOk={this.okHandle}
        onCancel={() => this.cancelAddLab()}
      >
        <Form>
          <FormItem {...formItemLayout} label="实验名称">
            {getFieldDecorator('labName', {
              rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
            })(<Input placeholder="请输入" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="实验描述">
            {getFieldDecorator('labContent', {
              rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
            })(<Input.TextArea placeholder="请输入" autosize />)}
          </FormItem>
          <FormItem label="起止时间" {...formItemLayout}>
            {getFieldDecorator('setime', rangeConfig)(
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            )}
          </FormItem>
          <FormItem label="上传文件" {...formItemLayout}>
            {getFieldDecorator('upload', {
              valuePropName: 'fileList',
              getValueFromEvent: normFile,
            })(
              <Upload
                name="logo"
                action="http://upload-z2.qiniu.com"
                listType="picture"
                beforeUpload={this.handleFile}
                data={this.state.qiniu}
                onChange={this.handleFileChange}
              >
                <Button>
                  <Icon type="upload" /> 点击上传
                </Button>
              </Upload>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }

  showEdit = item => {
    if (getAuth().role == '2') {
      // 时间截至
      // notification.error({
      //     message:'时间已截至'
      // })
      this.setState({
        commitVisible: true,
        currentLab: item,
      });
    } else if (getAuth().role == '1') {
      this.setState({
        labVisible: true,
        currentLab: item,
      });
      console.log(item);
    }
  };

  renderCommitLab() {
    const propty = {
      name: 'file',
      multiple: true,
      action: '//jsonplaceholder.typicode.com/posts/',
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        destroyOnClose
        title={getAuthority()[0] === '1' ? '发布' : '提交'}
        visible={this.state.commitVisible}
        onOk={this.okCommit}
        onCancel={() => this.cancelAddLab()}
      >
        <Form>
          <FormItem {...formItemLayout} label="实验描述">
            {getFieldDecorator('desc', {
              rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
            })(<Input.TextArea placeholder="请输入" autosize />)}
          </FormItem>
          <FormItem label="上传文件" {...formItemLayout}>
            {getFieldDecorator('upload', {
              valuePropName: 'fileList',
              getValueFromEvent: normFile,
            })(
              <Dragger
                action="http://upload-z2.qiniu.com"
                listType="picture"
                beforeUpload={this.handleFile}
                data={this.state.qiniu}
                onChange={this.handleFileChange}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from uploading company data
                  or other band files
                </p>
              </Dragger>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }

  render() {
    const {
      lab: { labs },
      loading,
    } = this.props;
    const CardInfo = ({ activeUser, newUser, item }) => (
      <div className={styles.cardInfo}>
        <Popover
          placement="topLeft"
          content={
            <div>
              <p>{item.labContent}</p>
              <p className={styles.warning}>
                截止时间:
                {item.labDeadline}
              </p>
            </div>
          }
          title={item.labName}
        >
          <div>
            <p>描述</p>
          </div>
        </Popover>
        {getAuthority()[0] == '2' ? (
          <div>
            <p>分数</p>
            <p>{newUser}</p>
          </div>
        ) : null}
      </div>
    );

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const itemMenu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
            1st menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
            2nd menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
            3d menu item
          </a>
        </Menu.Item>
      </Menu>
    );
    const addBtn = (
      <Button onClick={this.showAddLab}>
        发布实验
        <Icon type="plus-circle" theme="outlined" />
      </Button>
    );
    return (
      <div className={styles.filterCardList}>
        <Card
          bordered={false}
          title={this.props.location.state.courseName}
          extra={`教师: ${this.props.location.state.userName}`}
        >
          <Row gutter={16}>
            <Col lg={4} md={10} sm={10} xs={4}>
              <Authorized children={addBtn} authority="1" onMatch={<h1>fds</h1>} />
            </Col>
            <Col lg={8} md={10} sm={10} xs={24} offset={12}>
              课程简介 :{this.props.location.state.courseContent}
            </Col>
          </Row>
        </Card>
        <div>{this.renderAddLab()}</div>
        <div>{this.renderCommitLab()}</div>
        <List
          rowKey="id"
          style={{ marginTop: 24 }}
          grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
          loading={loading}
          dataSource={labs}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card
                hoverable
                bodyStyle={{ paddingBottom: 20 }}
                actions={[
                  <Tooltip title="下载">
                    <a href={item.labUrl} download="information">
                      <Icon type="download" />
                    </a>
                  </Tooltip>,
                  getAuthority()[0] === '2' ? (
                    <Tooltip title="提交" onClick={() => this.showEdit(item)}>
                      <Icon type="edit" />
                    </Tooltip>
                  ) : null,

                  <Tooltip
                    title={getAuth().role != '2' ? '评分' : '论坛'}
                    onClick={() => {
                      this.props.history.push('/course/grade', item);
                    }}
                  >
                    {getAuth().role != '2' ? (
                      <Icon type="check" theme="outlined" />
                    ) : (
                      <Icon type="message" theme="outlined" />
                    )}
                  </Tooltip>,
                ]}
              >
                <Card.Meta
                  avatar={<Avatar size="small">{item.labName}</Avatar>}
                  title={item.labName}
                />

                <div className={styles.cardItemContent}>
                  <CardInfo
                    item={item}
                    activeUser={formatWan(item.activeUser)}
                    newUser={numeral(item.score).format('0,0')}
                  />
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default FilterCardList;
