import { genChartByAIUsingPOST, listChartByPageUsingPOST } from '@/services/bi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Spin,
  Upload,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

/**
 * 添加图表页面
 * @constructor
 */
const AddChart: React.FC = () => {
  // 定义状态，用来接受后端返回值，实时展示
  const [chart, setChart] = useState<API.BiResponse>();
  const [chartOption, setChartOption] = useState<any>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    listChartByPageUsingPOST({}).then((res) => {
      console.error('res', res);
    });
  });

  const onFinish = async (values: any) => {
    //避免重复提交
    if (submitting) {
      return;
    }
    setChartOption(undefined);
    setChart(undefined);
    //提交中状态
    setSubmitting(true);
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAIUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析成功');
        // 把代码字符串进行json格式化
        const chartOption = JSON.parse(res.data.genChartCode ?? '');
        if (!chartOption) {
          throw new Error('图表代码解析失败');
        } else {
          setChart(res.data);
          setChartOption(chartOption);
        }
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
              name="addChart"
              onFinish={onFinish}
              initialValues={{}}
              labelAlign="left"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item name="name" label="图表名称" rules={[{ required: true }]}>
                <Input placeholder="请输入图表名称"></Input>
              </Form.Item>

              <Form.Item name="goal" label="分析需求" rules={[{ required: true }]}>
                <TextArea placeholder="请输入分析需求，比如：分析网站用户增长趋势"></TextArea>
              </Form.Item>

              <Form.Item
                name="chartType"
                label="图表类型"
                hasFeedback
                rules={[{ required: true, message: 'Please select your country!' }]}
              >
                <Select
                  placeholder="请选择图表类型"
                  options={[
                    { value: '折线图', label: '折线图' },
                    { value: '柱状图', label: '柱状图' },
                    { value: '饼状图', label: '饼状图' },
                    { value: '堆叠图', label: '堆叠图' },
                    { value: '雷达图', label: '雷达图' },
                  ]}
                ></Select>
              </Form.Item>

              <Form.Item name="file" label="原始文件" rules={[{ required: true }]}>
                <Upload name="logo" action="/upload.do" listType="picture" maxCount={1}>
                  <Button icon={<UploadOutlined />}>点击选择文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    disabled={submitting}
                  >
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分析结果">
            <div>
              {chart?.genResult}
              <Spin spinning={submitting}></Spin>
            </div>
          </Card>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <Card title="可视化图表">
            <div>
              {chartOption && <ReactECharts option={chartOption} />}
              <Spin spinning={submitting}></Spin>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
