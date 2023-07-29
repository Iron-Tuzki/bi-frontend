import {genChartByAIMqUsingPOST, listMySimpleChartsUsingGET} from '@/services/bi/chartController';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  SyncOutlined,
  UploadOutlined
} from '@ant-design/icons';
import {Button, Card, Col, Form, Input, message, Row, Select, Space, Table, Tag, Upload} from 'antd';
import {useForm} from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import React, {useEffect, useState} from 'react';
import {ColumnsType} from "antd/es/table";

/**
 * 添加图表页面(异步)
 * @constructor
 */
const AddChartMq: React.FC = () => {
  const [form] = useForm();
  // 定义状态，用来接受后端返回值，实时展示
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [data, setData] = useState<API.SimpleChartInfo>();
  const columns: ColumnsType<API.SimpleChartInfo> = [
    {
      title: '图表编号',
      dataIndex: 'chartId',
      key: 'chartId',
    }, {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '类型',
      dataIndex: 'chartType',
      key: 'chartType',
      render: (chartType) => (
        <>
          {
            chartType === '折线图' && <Tag color="red">{chartType}</Tag>
          }
          {
            chartType === '柱状图' && <Tag color="green">{chartType}</Tag>
          }
          {
            chartType === '饼状图' && <Tag color="cyan">{chartType}</Tag>
          }
          {
            chartType === '堆叠图' && <Tag color="blue">{chartType}</Tag>
          }
          {
            chartType === '雷达图' && <Tag color="gold">{chartType}</Tag>
          }
          {
            chartType === '散点图' && <Tag color="geekblue">{chartType}</Tag>
          }
        </>
      )
    }, {
      title: '分析状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, {status}) => (
        <>
          {
            status === 'wait' &&
            <Tag icon={<ClockCircleOutlined  />} color="default">
              warning
            </Tag>
          }
          {
            status === 'running' &&
            <Tag icon={<SyncOutlined spin />} color="processing">
              processing
            </Tag>
          }
          {
            status === 'success' &&
            <Tag icon={<CheckCircleOutlined/>} color="success">
              success
            </Tag>
          }
          {
            status === 'fail' &&
            <Tag icon={<CloseCircleOutlined/>} color="error">
              error
            </Tag>
          }
        </>
      ),
    },
  ]

  const loadData = async () => {
    try {
      const res = await listMySimpleChartsUsingGET();
      if (res?.data) {
        setData(res.data as API.SimpleChartInfo);
        message.success('刷新成功');
      } else {
        throw new Error('获取预览失败');
      }
    } catch (e: any) {
      message.error('获取预览失败', e);
    }
  };
  useEffect(() => {
    loadData()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true); // 设置刷新状态为正在刷新
    loadData();
    setRefreshing(false);
  };

  const onFinish = async (values: any) => {
    //避免重复提交
    if (submitting) {
      return;
    }
    //提交中状态
    setSubmitting(true);
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAIMqUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('提交失败');
      } else {
        message.success('分析任务提交成功！请稍后在【我的图表】查看分析状态和结果');
        form.resetFields();
        loadData();
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="提交表单">
            <Form
              form={form}
              name="addChart"
              onFinish={onFinish}
              initialValues={{}}
              labelAlign="right"
              labelCol={{span: 4}}
              wrapperCol={{span: 16}}
            >
              <Form.Item name="name" label="图表名称" rules={[{required: true}]}>
                <Input placeholder="请输入图表名称"></Input>
              </Form.Item>
              <Form.Item
                name="chartType"
                label="图表类型"
                hasFeedback
                rules={[{required: true, message: 'Please select your country!'}]}
              >
                <Select
                  placeholder="请选择图表类型"
                  options={[
                    {value: '折线图', label: '折线图'},
                    {value: '柱状图', label: '柱状图'},
                    {value: '饼状图', label: '饼状图'},
                    {value: '堆叠图', label: '堆叠图'},
                    {value: '雷达图', label: '雷达图'},
                    {value: '散点图', label: '散点图'},
                  ]}
                ></Select>
              </Form.Item>
              <Form.Item name="goal" label="分析需求" rules={[{required: true}]}>
                <TextArea placeholder="请输入分析需求，比如：分析网站用户增长趋势"></TextArea>
              </Form.Item>


              <Form.Item name="file" label="原始文件" rules={[{required: true}]}>
                <Upload name="logo" action="/upload.do" listType="picture" maxCount={1}>
                  <Button icon={<UploadOutlined/>}>点击选择文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{span: 12, offset: 4}}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="我的图表（预览）"
                actions={[
                  <Button
                    icon={<ReloadOutlined />}
                    key="refresh"
                    onClick={handleRefresh}
                    loading={refreshing} // 根据刷新状态设置按钮的加载样式
                  />,
                ]}
          >
            <Table columns={columns}
                   dataSource={data}
                   pagination={false}
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
};
export default AddChartMq;
