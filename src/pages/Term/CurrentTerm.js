import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List,Modal,Input,Form } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './CurrentTerm.less';
import icon2 from '../../assets/icon2.jpg';
import {getAuth} from '@/utils/auth'
const FormItem = Form.Item;
const { TextArea } = Input
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};
@connect(({ list, login, loading }) => ({
  list,
  login,
  loading: loading.models.list,
}))

@Form.create()
class CardList extends PureComponent {
  state = {
    quitCourseVisible:false,
    courseInfoVisible:false,
    currentCourse:{},
    addCourseVisible:false,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
  }
  chekDetail = (flag, item) => {
    console.log(item)
    this.props.history.push("/course")
  }
  addOperate = () => {
    if (getAuth().role == '1') {
      this.props.history.push("/manage-course/add-course")
      //跳转申请开课
    } else (getAuth().role == '2')
    {
      this.setState({
        addCourseVisible:true
      })
      //显示添加课程
    }
  }
  hideQuitDialog=()=>{
    this.setState({
      quitCourseVisible:false,
    })
  }
  executeQuit=()=>{
    this.setState({
      quitCourseVisible:false,
    })
    //执行退选操作
  }
  quitOrInfo = (item) => {
    this.state.currentCourse=item
    if(getAuth().role==2)
    {
      console.log('推选')
      
      this.setState({
        quitCourseVisible:true,
      })
      console.log(this.state.quitCourseVisible)
    }
    if(getAuth().role==1)
    {
      this.setState({
        courseInfoVisible:true
      })
      //发布通知
    }
  }
  executeInfo=()=>{
    //执行发送通知
    this.setState({
      courseInfoVisible:false
    })
  }
  hideInfoDialog=()=>{
    this.setState({
      courseInfoVisible:false
    })
  }

  renderQuitDialog()
  {
    
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
  };

  renderInfo(){
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
              <Form  onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="标题"
            >
              {getFieldDecorator('title', {
                rules: [{
                  type: 'email', message: '请输入标题',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="公告内容"
            >
              {getFieldDecorator('content', {
                rules: [{
                  type: 'email', message: '请输入内容',
                }],
              })(
                <TextArea />
              )}
            </FormItem>
          </Form>

    </Modal>
    )
  }
  render() {
    const {
      list: { list },
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

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          好好学习，天天向上
        </p>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src={icon2}
        />
      </div>
    );

    return (
      <PageHeaderWrapper title={getAuth().role == '2' ? stuInfo.title : teaInfo.title} content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
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
                  <Card hoverable className={styles.card} actions={[<a onClick={() => this.chekDetail(true, item)}>查看</a>, <a onClick={()=>this.quitOrInfo(item)} >{getAuth().role == '2' ? '退选' : '发布通知'}</a>]}>
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                      title={<a>{item.title}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.description}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                  <List.Item>
                    <Button type="dashed" onClick={()=>this.addOperate()} className={styles.newButton}>
                      <Icon type="plus" />  {getAuth().role != '2' ? teaInfo.courseOPerate : stuInfo.courseOPerate}
                    </Button>
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
