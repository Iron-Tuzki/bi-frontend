import React, {useEffect, useState} from "react";
import {changeStatusUsingGET, getAllUnreadUsingGET} from "@/services/bi/notificationController";
import {Button, List, Skeleton} from "antd";


const Notification: React.FC = () => {

  const [list, setList] = useState<API.UserNotification[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const loadData = async () => {
    const params = {
      current: current,
    }
    const res = await getAllUnreadUsingGET(params);
    if (res.data) {
      setList(res?.data?.records);
      setTotal(res.data.total);
    }
  }

  useEffect(() => {
    loadData();
  }, [current]);

  const read = async (id: number) => {
    const params = {
      id: id
    }
    await changeStatusUsingGET(params);
    loadData();
  };


  return (
    <List
      className="demo-loadmore-list"
      itemLayout="horizontal"
      dataSource={list}
      pagination={{
        onChange: (page) => {
          setCurrent(page);
        },
        current: current,
        pageSize: 2,
        total: total,
      }}
      renderItem={(item) => (
        <List.Item
          actions={[<a key="list-loadmore-edit" onClick={()=>read(item.id as number)}>标为已读</a>]}
        >
          <List.Item.Meta
            title={item.id}
            description={item.description}
          />
        </List.Item>
      )}
    />
  );

}
export default Notification;
