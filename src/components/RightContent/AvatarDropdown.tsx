import { userLogoutUsingPOST } from '@/services/bi/userController';
import {AlertOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history, useModel } from '@umijs/max';
import {Button, Descriptions, Form, Modal, Spin, Switch } from 'antd';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useState } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import {getParamsUsingGET, switchStatusUsingGET} from "@/services/bi/sysParamsController";

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.userName}</span>;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {

  // 个人信息弹窗控制
  const [open, setOpen] = useState(false);
  // 通知弹窗控制
  const [nOpen, setNOpen] = useState(false);
  const [sOpen, setSOPen] = useState(false);

  // 系统设置
  const [isNotifyChart, setIsNotifyChart] = useState<boolean>();
  const [isNotifySql, setIsNotifySql] = useState<boolean>();



  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await userLogoutUsingPOST();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };
  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });
  const { initialState, setInitialState } = useModel('@@initialState');

  const showUserInfo = () => {
    setOpen(true);
  };
  const showNotification = () => {
    setNOpen(true);
  };
  const showSettings = () => {
    setSOPen(true);
  };
  const onChange = (type : string) => {
    if (type === 'chart') {
      setIsNotifyChart(!isNotifyChart);
      const param = {
        isNotifyChart : isNotifyChart ? 'false' : 'true'
      };
      const res = switchStatusUsingGET(param)
    }
    if (type === 'sql') {
      setIsNotifySql(!isNotifySql);
      const param = {
        isNotifySql : isNotifySql ? 'false' : 'true'
      };
      const res = switchStatusUsingGET(param)
    }
  };

  const onMenuClick = useCallback(
    async (event: MenuInfo) => {
      const {key} = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({...s, currentUser: undefined}));
        });
        loginOut();
        return;
      }
      if (key === 'userInfo') {
        // history.push('/user/info');
        showUserInfo();
        return;
      }
      if (key === 'userNotification') {
        showNotification();
        return;
      }
      if (key === 'settings') {
        const res = await getParamsUsingGET();
        setIsNotifyChart(res.data.isNotifyChart)
        setIsNotifySql(res.data.isNotifySql)
        showSettings();
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={actionClassName}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.userName) {
    return loading;
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'userInfo',
            icon: <UserOutlined />,
            label: '用户信息',
          },
          {
            key: 'userNotification',
            icon: <AlertOutlined />,
            label: '用户通知',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '系统设置',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];


  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
    setNOpen(false);
    setSOPen(false);
  };

  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {children}
      </HeaderDropdown>
      <Modal
        open={open}
        title="用户信息"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            返回
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            修改
          </Button>,
        ]}
      >
        <Descriptions title="" bordered layout="vertical">
          <Descriptions.Item label="用户名">{currentUser.userName}</Descriptions.Item>
          <Descriptions.Item label="账户">{currentUser.userAccount}</Descriptions.Item>
          <Descriptions.Item label="角色">{currentUser.userRole}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{currentUser.createTime}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{currentUser.updateTime}</Descriptions.Item>
        </Descriptions>

      </Modal>

      <Modal
        open={nOpen}
        title="任务通知"
        onOk={()=>{}}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            返回
          </Button>,
        ]}
      >

      </Modal>

      <Modal
        open={sOpen}
        title="系统设置"
        onOk={()=>{}}
        width={300}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            返回
          </Button>,
        ]}
      >

        <Form
          name="basic"
          labelCol={{ span: 16}}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 300 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="是否通知图表生成状态"
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked={isNotifyChart} onChange={()=>onChange('chart')}/>
          </Form.Item>
          <Form.Item
            label="是否通知数据生成状态"
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked={isNotifySql} onChange={()=>onChange('sql')}/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
