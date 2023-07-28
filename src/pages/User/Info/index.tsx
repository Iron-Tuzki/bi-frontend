import {Avatar, Badge, Card, Col, Descriptions, Row} from "antd";
import React from "react";
import {useModel} from "@@/exports";
import {UserOutlined} from "@ant-design/icons";

const UserInfo: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const {currentUser} = initialState ?? {};

  return (
    <Row gutter={24}>
      <Col span={12}>
        <Card title="基本信息">

        </Card>
      </Col>
      <Col span={12}>
        <Card title="图表汇总数据">

        </Card>
      </Col>
    </Row>
  );
};
export default UserInfo;
