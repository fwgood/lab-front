import React, { PureComponent } from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
import { Row, Col, Form, DatePicker, Card, Select, Icon, Avatar, Input, List, Tooltip, Button, Menu, Modal, Upload, Popover } from 'antd';

import { formatWan } from '@/utils/utils';

import styles from './CourseInfo.less';
import { getAuth } from '@/utils/auth'
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 },
};
const rangeConfig = {
    rules: [{ type: 'array', required: true, message: 'Please select time!' }],
};

const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};
@Form.create()
@connect(({ list, loading }) => ({
    list,
    loading: loading.models.list,
}))

@Form.create()
class FilterCardList extends PureComponent {
    state = {
        labVisible: false,
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'list/fetch',
            payload: {
                count: 8,
            },
        });
    }
    okHandle = () => {
        this.setState({
            labVisible: false,
        })
    }
    cancelAddLab = () => {
        this.setState({
            labVisible: false,
        })
    }
    showAddLab = () => {
        console.log("add lab")
        this.setState({
            labVisible: true,
        })
        console.log(this.state.labVisible)
    }
    renderAddLab() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                destroyOnClose
                title="发布"
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
                        {getFieldDecorator('desc', {
                            rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
                        })(<Input.TextArea placeholder="请输入" autosize />)}
                    </FormItem>
                    <FormItem
                        label="起止时间" {...formItemLayout}
                    >
                        {getFieldDecorator('setime', rangeConfig)(
                            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        )}
                    </FormItem>
                    <FormItem label="上传文件" {...formItemLayout}
                    >
                        {getFieldDecorator('upload', {
                            valuePropName: 'fileList',
                            getValueFromEvent: normFile,
                        })(
                            <Upload name="logo" action="/upload.do" listType="picture">
                                <Button>
                                    <Icon type="upload" /> 点击上传
        </Button>
                            </Upload>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    };

    showEdit = (item) => {
        this.setState({
            labVisible: true,
        })
        console.log(item)

    }

    render() {
        const {
            list: { list },
            loading,
        } = this.props;

        const CardInfo = ({ activeUser, newUser }) => (
            <div className={styles.cardInfo}>
                <div>
                    <p>活跃用户</p>
                    <p>{activeUser}</p>
                </div>
                <div>
                    <p>新增用户</p>
                    <p>{newUser}</p>
                </div>
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

        return (
            <div className={styles.filterCardList}>
                <Card bordered={false} title="java班" extra="教师: 张三">
                    <Row gutter={16}>
                        <Col lg={4} md={10} sm={10} xs={4}>
                            <Button onClick={this.showAddLab}>
                                发布实验<Icon type="plus-circle" theme="outlined" />
                            </Button>
                        </Col>
                        <Col lg={8} md={10} sm={10} xs={24}>
                            课程简介{' '}:
                </Col>
                    </Row>
                </Card>
                <div>{this.renderAddLab()}</div>
                <List
                    rowKey="id"
                    style={{ marginTop: 24 }}
                    grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
                    loading={loading}
                    dataSource={list}
                    renderItem={item => (
                        <List.Item key={item.id}>
                            <Card
                                hoverable
                                bodyStyle={{ paddingBottom: 20 }}
                                actions={[
                                    <Tooltip title="下载" >
                                        <a href={"http://cs229.stanford.edu/notes/cs229-notes1.pdf"} download="cs229">
                                            <Icon type="download" />
                                        </a>
                                    </Tooltip>,
                                    <Tooltip title="编辑" onClick={() => this.showEdit(item)}>
                                        <Icon type="edit" />
                                    </Tooltip>,
                                    <Tooltip title="评分" style={getAuth().role != '1' ? { visibility: "hidden" } : {}} onClick={() => { this.props.history.push("/course/grade") }}>
                                        <Icon type="check" theme="outlined" />
                                    </Tooltip>,
                                    //   <Dropdown overlay={itemMenu}>
                                    //     <Icon type="ellipsis" />
                                    //   </Dropdown>,
                                ]}
                            >
                                <Card.Meta avatar={<Avatar size="small" src={item.avatar} />} title={item.title} />
                                <Popover content={item.newUser} title={item.title}>

                                    <div className={styles.cardItemContent}>
                                        <CardInfo
                                            activeUser={formatWan(item.activeUser)}
                                            newUser={numeral(item.newUser).format('0,0')}
                                        />
                                    </div>
                                </Popover>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}

export default FilterCardList;
