import {listMyChartByPageUsingPOST} from '@/services/bi/chartController';
import {useModel} from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  Drawer,
  Form,
  Input,
  List,
  message,
  Result,
  Row,
  Select,
  Space,
  Tag,
  theme,
} from 'antd';
import ReactECharts from 'echarts-for-react';
import React, {useEffect, useState} from 'react';

/**
 * 添加图表页面
 * @constructor
 */
const MyChart: React.FC = () => {
  const {token} = theme.useToken();
  const [form] = Form.useForm();
  const formStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
    height: 90,
  };
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  };
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>(initSearchParams);
  const [chartList, setChartList] = useState<API.Chart>();
  const [total, setTotal] = useState<number>(0);
  const {initialState} = useModel('@@initialState');
  const {currentUser} = initialState ?? {};
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState();

  const showDrawer = (genResult: string) => {
    setOpen(true);
    setResult(genResult);
  };

  const onClose = () => {
    setOpen(false);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res?.data?.records) {
        // 统一删除标题title
        res.data.records.forEach((record) => {
          if (record.status === 'success') {
            // 去除ai生成的图表标题
            const chartOption = JSON.parse(record.genChart !== undefined ? record.genChart : '');
            chartOption.title = undefined;
            record.genChart = JSON.stringify(chartOption);
          }
        });
        setChartList(res.data.records as API.Chart);
        setTotal(res.data.total ?? 0);
      } else {
        throw new Error('获取图表失败');
      }
    } catch (e: any) {
      message.error('获取图表失败', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  // 定时任务，前端轮询
  useEffect(() => {
    const timer = setInterval(() => {
      // 实现定时任务的逻辑，如重新获取数据
      loadData();
    }, 120000);
    // 在组件销毁时清除定时器
    return () => clearInterval(timer);
  }, []);

  const onFinish = (values: any) => {
    setSearchParams({
      ...initSearchParams,
      name: values.name,
      goal: values.goal,
      chartType: values.chartType,
    });
    // loadData() 使用了钩子函数，当搜索条件发生变化，会自动执行
  };

  return (
    <div className="my-chart">
      {/*搜索栏*/}
      <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="name" label="图表名称">
              <Input placeholder="请输入图表名称"/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="goal" label="分析需求">
              <Input placeholder="请输入分析需求"/>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="chartType" label="图表类型">
              <Select
                placeholder="请选择"
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
          </Col>
          <Col span={4}>
            <div style={{textAlign: 'right'}}>
              <Space size="small">
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  Clear
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Form>
      {/*列表栏*/}
      <div style={{marginBottom: 20}}></div>
      <List
        grid={{gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2}}
        loading={loading}
        pagination={{
          onChange: (page) => {
            setSearchParams({
              ...searchParams,
              current: page,
            });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        dataSource={chartList}
        footer={
          <div>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card style={{width: '100%'}}>
              <div style={{display: 'flex', flexDirection: 'row', gap: 20, marginBottom: 10}}>
                {item.name}
                {
                  item.chartType === '折线图' && <Tag color="red">{item.chartType}</Tag>
                }
                {
                  item.chartType === '柱状图' && <Tag color="green">{item.chartType}</Tag>
                }
                {
                  item.chartType === '饼状图' && <Tag color="cyan">{item.chartType}</Tag>
                }
                {
                  item.chartType === '堆叠图' && <Tag color="blue">{item.chartType}</Tag>
                }
                {
                  item.chartType === '雷达图' && <Tag color="gold">{item.chartType}</Tag>
                }
                {
                  item.chartType === '散点图' && <Tag color="geekblue">{item.chartType}</Tag>
                }
              </div>
              <List.Item.Meta
                description={item.goal}
              />
              <>
                {item.status === 'running' && (
                  <>
                    <Result status="info" title="图表正在生成中，请稍等"/>
                  </>
                )}
                {item.status === 'success' && (
                  <>
                    <div style={{marginBottom: 20}}></div>
                    <ReactECharts option={JSON.parse(item.genChart) ?? {}}/>
                  </>
                )}
                {item.status === 'fail' && (
                  <>
                    <Result status="error" title="图表生成失败" subTitle={item.execMessage}/>
                  </>
                )}
              </>
              <Collapse
                items={[{label: '分析结论', children: <p>{item.genResult}</p>}]}
              />
            </Card>
          </List.Item>
        )}
      />

      <Drawer
        title="分析结论"
        placement="left"
        closable={false}
        onClose={onClose}
        open={open}
        key="left"
      >
        {result}
      </Drawer>
    </div>
  );
};


export default MyChart;

