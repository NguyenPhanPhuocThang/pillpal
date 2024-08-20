import {
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Spin,
  Table,
  Typography,
} from "antd";
import React from "react";
import "./style.css";
import { useGetMedicine } from "../../hooks/useMedicineApi";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { dateTimeFormat } from "../../utils/time";
const { Title, Text } = Typography;

function ProductDetail() {
  const { id } = useParams();

  const { data, isLoading } = useGetMedicine(id);
  console.log(data);

  if (isLoading)
    return (
      <div style={{ textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  return (
    <div className="product-details-container">
      <Title
        level={2}
        style={{
          textAlign: "center",
          backgroundColor: "#77a942",
          color: "#fff",
          padding: "10px 0",
        }}
      >
        {data.medicineName}
      </Title>

      <Row gutter={[16, 16]} justify="center" style={{ margin: "20px 0" }}>
        <Col span={8}>
          <Card hoverable cover={<img src={data.image} />} />
        </Col>
        <Col span={16}>
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Tên Thuốc">
              {data.medicineName}
            </Descriptions.Item>
            <Descriptions.Item label="Hoạt Chất">
              {data.activeIngredients
                .map((v) => v.ingredientName)
                .join(", ")}
            </Descriptions.Item>
            <Descriptions.Item label="Dạng Bào Chế">
              {data.dosageForms.map((v) => v.formName).join(", ")}
            </Descriptions.Item>
            <Descriptions.Item label="Quy cách đóng gói">
              {data.specification.typeName} {data.specification.detail}
            </Descriptions.Item>
            <Descriptions.Item label="Công ty Sản Xuất">
              {data.pharmaceuticalCompanies
                .map((v) => v.companyName)
                .join("<br />")}
            </Descriptions.Item>
            <Descriptions.Item label="Số đăng ký">
              {data.registrationNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Thuốc kê đơn">
              {data.requirePrescript ? "Có" : "Không"}
            </Descriptions.Item>
            <Descriptions.Item label="Giá">
              {data.medicineInBrands.map((v) => v.price).join(", ")}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian cập nhật">
              {dateTimeFormat(data.medicineInBrands.map((v) => v.updatedAt).join(", "))}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <Title
        level={2}
        style={{
          textAlign: "center",
          backgroundColor: "#77a942",
          color: "#fff",
          padding: "10px 0",
          marginTop: "100px",
        }}
      >
        So sánh giá {data.medicineName}
      </Title>
      {data.medicineInBrands.map((v) => (
        <PharmacyCard
          brandName={v.brand.brandName}
          brandImage={v.brand.brandLogo}
          medicineUrl={v.medicineUrl}
          brandCode={v.brand.brandCode}
          price={v.price}
        />
      ))}
    </div>
  );
}

export default ProductDetail;

const PharmacyCard = ({
  brandName,
  brandImage,
  medicineUrl,
  brandCode,
  price,
}) => {
  return (
    <Card>
      <Row justify="space-between" align="middle">
        <Col span={24}>
          <div
            style={{
              backgroundColor: "#99a2cf",
              padding: "5px",
              textAlign: "center",
            }}
          >
            <span style={{ color: "white" }}>{brandName}</span>
          </div>
        </Col>
        <Col span={24} style={{ textAlign: "center", marginTop: "10px" }}>
          <img src={brandImage} width={"100px"} />
        </Col>
        <Col span={24} style={{ textAlign: "center", marginTop: "10px" }}>
          <div>{brandName}</div>
        </Col>
        <Col span={8} style={{ textAlign: "center", marginTop: "10px" }}>
          <div>{brandCode}</div>
        </Col>
        <Col span={8} style={{ textAlign: "center", marginTop: "10px" }}>
          <div>
            <a href={medicineUrl}>{medicineUrl}</a>
          </div>
        </Col>
        <Col span={8} style={{ textAlign: "right", marginTop: "10px" }}>
          <div style={{ fontWeight: "bold", fontSize: "20px" }}>{price}</div>
        </Col>
      </Row>
    </Card>
  );
};
