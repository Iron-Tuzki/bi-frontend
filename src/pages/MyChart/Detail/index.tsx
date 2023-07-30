import {
  AreaChartOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DotChartOutlined,
  EditOutlined,
  LineChartOutlined,
  PieChartOutlined,
  PlusOutlined,
  RadarChartOutlined,
  SyncOutlined,
  TableOutlined
} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable, TableDropdown} from '@ant-design/pro-components';
import {Button, Modal, Tag} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {listMyChartByPageUsingPOST} from "@/services/bi/chartController";
import ReactECharts from "echarts-for-react";

import Chart from '@/components/Chart';

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};
const {confirm} = Modal;
const MyChartDetail: React.FC = () => {

  const [total, setTotal] = useState<number>(0);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [chartCode, setChartCode] = useState<string>('{}');
  const actionRef = useRef<ActionType>();
  const chartRef = useRef(null);

  const showChart = (genChart: string) => {
    setChartCode(genChart);
    setIsChartOpen(true);
  };

  const showData = (id: number) => {
    // 查询数据
  }

  // 弹窗确认函数
  const handleOk = (type: string) => {
    if (type === 'chart') {
      setIsChartOpen(false);
      // 关闭时销毁echart实例，否则会重叠错乱
      const chartInstance = chartRef.current.getEchartsInstance();
      chartInstance.dispose();
    } else if (type === 'data') {

    }
  };

  // 弹窗关闭函数
  const handleCancel = (type: string) => {
    if (type === 'chart') {
      setIsChartOpen(false);
      const chartInstance = chartRef.current.getEchartsInstance();
      chartInstance.dispose();
    } else if (type === 'data') {

    }
  };

  const columns: ProColumns<API.Chart>[] = [
    {
      title: '图表编号',
      dataIndex: 'id',
      valueType: 'text',
      width: 200,
      hideInSearch: true,
    }, {
      title: '图表名称',
      dataIndex: 'name',
      valueType: 'text',
      width: 160,
    }, {
      title: '类型',
      dataIndex: 'chartType',
      width: 100,
      align: 'center',
      valueType: 'text',
      hideInSearch: true,
      render: (chartType) => (
        <>
          {
            chartType === '折线图' && <LineChartOutlined/>
          }
          {
            chartType === '柱状图' && <BarChartOutlined/>
          }
          {
            chartType === '饼状图' && <PieChartOutlined/>
          }
          {
            chartType === '雷达图' && <RadarChartOutlined/>
          }
          {
            chartType === '堆叠图' && <AreaChartOutlined/>
          }
          {
            chartType === '散点图' && <DotChartOutlined/>
          }
        </>
      ),
    }, {
      title: '类型',
      dataIndex: 'chartType',
      valueType: 'select',
      hideInTable: true,
      valueEnum: {
        '折线图': {
          text: '折线图',
        },
        '柱状图': {
          text: '柱状图',
        },
        '饼状图': {
          text: '饼状图',
        },
        '堆叠图': {
          text: '堆叠图',
        },
        '雷达图': {
          text: '雷达图',
        },
        '散点图': {
          text: '散点图',
        },
      },
    }, {
      title: '分析需求',
      dataIndex: 'goal',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
      tip: '内容过长会自动收缩',
    }, {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      valueType: 'text',
      width: 120,
      align: 'center',
      render: (status) => (
        <>
          {
            status === 'wait' &&
            <Tag icon={<ClockCircleOutlined/>} color="default">
              warning
            </Tag>
          }
          {
            status === 'running' &&
            <Tag icon={<SyncOutlined spin/>} color="processing">
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
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      key: 'createTime',
      width: 180,
      hideInSearch: true,
    }, {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 130,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          <Button size={'small'} icon={<EditOutlined/>}/>
        </a>,
        <a
          key="showChart"
          onClick={
            () => showChart(record.genChart as string)
          }
        >
          <Button size={'small'} icon={<LineChartOutlined/>}/>
        </a>,
        <a
          key="showData"
          onClick={
            () => showData(record.id as number)
          }
        >
          <Button size={'small'} icon={<TableOutlined/>}/>
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={() => action?.reload()}
          menus={[
            {key: 'delete', name: '删除'},
          ]}
        />,
      ],
    },
  ];

  return (
    <div>
      <ProTable<API.Chart>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          params.sortField = 'createTime';
          params.sortOrder = 'desc';
          // console.log(sort, filter);
          const res = await listMyChartByPageUsingPOST(params);
          setTotal(res?.data?.total as number)
          return {
            data: res?.data?.records
          }
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          onChange(value) {
            // console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}

        pagination={{
          total,
          pageSize: 5,
          showQuickJumper: true,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="图表详细信息"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined/>}
            onClick={() => {
              actionRef.current?.reload();
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      <Modal width={1000} title="" open={isChartOpen} onOk={() => handleOk('chart')}
             onCancel={() => handleCancel('chart')}>
        <ReactECharts ref={chartRef} option={JSON.parse(chartCode as string) ?? {}} style={{width: 1000, height: 300}}/>
        {/*<Chart parameter={JSON.parse(chartCode as string) ?? {}}/>*/}
      </Modal>
    </div>
  );
};

export default MyChartDetail;
