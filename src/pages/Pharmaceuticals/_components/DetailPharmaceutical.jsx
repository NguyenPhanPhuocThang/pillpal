import React from "react";
import Dialog from "../../../components/dialog";
import { useGetPharmaceuticalById } from "../../../hooks/usePharmaceutialApi";

const DetailPharmaceutical = ({ id, onClose }) => {
  const { isLoading, data } = useGetPharmaceuticalById(id);

  return (
    <Dialog onClose={onClose}>
      {isLoading ? (
        <p>Đang tải...</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontSize: "24px" }}>Chi tiết công ty dược phẩm</h3>
          <p>Tên công ty: {data?.companyName}</p>
          <p>Quốc gia: {data?.nation?.nationName}</p>
        </div>
      )}
    </Dialog>
  );
};

export default DetailPharmaceutical;
