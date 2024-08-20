import React, { useState } from "react";
import { useGetBrandList } from "../../../hooks/useBrandApi";
import GradientButton from "../../button/GradientButton";
import { vndFormat } from "../../../utils/price-vnd";

const MultiBrand = ({ list, setList }) => {
  const { data = [], isLoading } = useGetBrandList({});

  // State for new item inputs
  const [selectedBrand, setSelectedBrand] = useState("");
  const [price, setPrice] = useState("");
  const [medicineUrl, setMedicineUrl] = useState("");

  const handleAddItem = () => {
    if (selectedBrand && price && medicineUrl) {
      const newItem = {
        brandId: selectedBrand,
        price: price,
        medicineUrl: medicineUrl,
      };
      setList([...list, newItem]);

      // Reset inputs
      setSelectedBrand("");
      setPrice("");
      setMedicineUrl("");
    }
  };

  const handleDeleteItem = (id) => {
    setList(list.filter((i) => i.brandId !== id));
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div
        className="flex"
        style={{
          margin: "15px 0px",
          width: "100%",
          alignItems: "start",
          borderBottom: "0.5px solid #d6d6d6",
          paddingBottom: "15px",
        }}
      >
        <div
          className="flex"
          style={{
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
            width: "200px",
          }}
        >
          <p
            style={{
              margin: "0",
              padding: "0",
              fontSize: "18px",
              textAlign: "left",
            }}
          >
            Thương hiệu
          </p>
        </div>
        {/* list */}
        <div className="w-full">
          {list &&
            list.map((i) => (
              <Item
                key={i.brandId}
                brandId={i.brandId}
                brandName={
                  data.find((d) => d.id === i.brandId)?.brandName ||
                  "Không có thương hiệu"
                }
                price={i.price}
                medicineUrl={i.medicineUrl}
                onDelete={() => handleDeleteItem(i.brandId)}
              />
            ))}
          {/* Add Form */}
          <div className="flex" style={{ alignItems: "center", gap: "10px" }}>
            {/* Brand ID selector */}
            <CustomSelect
              disabledList={list.map((i) => i.brandId)}
              list={data.map((i) => ({
                label: i.brandName,
                value: i.id,
              }))}
              selected={selectedBrand}
              onChange={setSelectedBrand}
            />

            {/* Price and URL input */}
            <input
              placeholder="💸 Giá..."
              style={{ flex: 1, padding: "5px 10px" }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              placeholder="🔗 URL..."
              style={{ flex: 1, padding: "5px 10px" }}
              value={medicineUrl}
              onChange={(e) => setMedicineUrl(e.target.value)}
            />
            {/* Add button */}
            <GradientButton onClick={handleAddItem} label={"➕"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiBrand;

const CustomSelect = ({ list = [], selected, onChange, disabledList = [] }) => {
  return (
    <div
      className="flex items-center"
      style={{ alignItems: "center", gap: "10px" }}
    >
      <select
        style={{
          width: "100%",
          padding: "10px",
          border: "1px solid #d9d9d9",
          color: "gray",
          borderRadius: "5px",
        }}
        onChange={(e) => onChange(e.target.value)}
        value={selected}
      >
        <option value="" disabled>
          Chọn thương hiệu
        </option>
        {list.map((item) => (
          <option
            key={item.value}
            value={item.value}
            disabled={disabledList.includes(item.value)}
          >
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const Item = ({ brandId, price, medicineUrl, brandName, onDelete }) => (
  <div
    className="flex"
    style={{
      justifyContent: "space-between",
      margin: "5px 0",
      alignItems: "center",
    }}
  >
    <p>
      {brandName} - {price} - {medicineUrl}
    </p>
    <GradientButton label={"✖"} type={"danger"} onClick={onDelete} />
  </div>
);
