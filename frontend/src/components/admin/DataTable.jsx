import { Table } from "antd";

export default function DataTable({ columns, dataSource, loading, pagination, onChange, rowKey = "id", ...rest }) {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey={rowKey}
      pagination={
        pagination
          ? {
              current: pagination.page,
              pageSize: pagination.limit,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: (t) => `Total ${t} items`,
            }
          : false
      }
      onChange={onChange}
      scroll={{ x: "max-content" }}
      {...rest}
    />
  );
}
