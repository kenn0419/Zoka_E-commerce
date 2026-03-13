import React, { useState } from "react";
import { Card, DatePicker, Button, Table, Space, Typography, Tag } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Area } from "@ant-design/charts";
import { useAdminRevenueQuery } from "../../../queries/statistics.query";
import { statisticsApi } from "../../../apis/statistics.api";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const AdminRevenueReport: React.FC = () => {
  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>([
    dayjs().subtract(1, "month"),
    dayjs(),
  ]);

  const { data: revenueData, isLoading } = useAdminRevenueQuery({
    period: "day",
    startDate: dates ? dates[0].format("YYYY-MM-DD") : undefined,
    endDate: dates ? dates[1].format("YYYY-MM-DD") : undefined,
  });

  const handleExport = async () => {
    try {
      const response = await statisticsApi.exportAdminRevenue({
        period: "day",
        startDate: dates ? dates[0].format("YYYY-MM-DD") : undefined,
        endDate: dates ? dates[1].format("YYYY-MM-DD") : undefined,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `admin-revenue-${dayjs().format("YYYY-MM-DD")}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: "Cumulative Revenue",
      dataIndex: "cumulativeRevenue",
      key: "cumulativeRevenue",
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: "Growth",
      dataIndex: "growthPercentage",
      key: "growthPercentage",
      render: (val: number | null) => {
        if (val === null) return <Tag>N/A</Tag>;
        const color = val >= 0 ? "green" : "red";
        return <Tag color={color}>{val.toFixed(2)}%</Tag>;
      },
    },
  ];

  const config = {
    data: revenueData || [],
    xField: "date",
    yField: "revenue",
    smooth: true,
    areaStyle: () => {
      return {
        fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
      };
    },
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Revenue Report</Title>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Space>
            <RangePicker
              value={dates}
              onChange={(val) => setDates(val as any)}
              format="YYYY-MM-DD"
            />
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              Export Excel
            </Button>
          </Space>
        </Card>

        <Card title="Revenue Trend">
          <div style={{ height: 400 }}>
            <Area {...config} />
          </div>
        </Card>

        <Card title="Detailed Data">
          <Table
            columns={columns}
            dataSource={revenueData || []}
            loading={isLoading}
            rowKey="date"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </Space>
    </div>
  );
};

export default AdminRevenueReport;
