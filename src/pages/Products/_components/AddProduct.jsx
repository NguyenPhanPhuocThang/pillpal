import { Button, Checkbox, Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";
import Dialog from "../../../components/dialog";
import MultiActive from "../../../components/pages/products/MultiActive";
import MultiCategories from "../../../components/pages/products/MultiCategories";
import MultiDosages from "../../../components/pages/products/MultiDosages";
import MultiPharmaceutical from "../../../components/pages/products/MultiPhrmacutial";
import {
  useAddMedicineToBrandWithPrice,
  useCreateMedicine,
  useEditMedicineToBrandWithPrice,
  useGetMedicine,
  useUpdateMedicine,
} from "../../../hooks/useMedicineApi";
import { useGetSpecificationList } from "../../../hooks/useSpecificationApi";
import GradientButton from "../../../components/button/GradientButton";
import MultiBrand from "../../../components/pages/products/MultiBrand";

const CustomSelect = ({ list = [], selected, onChange }) => {
  return (
    <div
      className="flex items-center"
      style={{ alignItems: "center", gap: "10px", paddingBottom: "10px" }}
    >
      <p
        style={{
          margin: "0",
          padding: "0",
          width: "200px",
          textAlign: "left",
          fontSize: "18px",
        }}
      >
        Loại:
      </p>
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
        {list.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const AddProduct = ({ onClose, id = null }) => {
  const [form] = Form.useForm();

  // API: Get medicine
  const { data: initData, isLoading: initLoading } = useGetMedicine(id);

  // API: Update medicine
  const { mutate: updateMutate, isLoading: updateLoading } =
    useUpdateMedicine(id);

  // API: Create medicine
  const { mutate: createMutate, isLoading: createLoading } =
    useCreateMedicine();

  // API: Add Medicine to Brand with Price
  const {
    mutate: addMedicineToBrandWithPriceMutate,
    isLoading: addMedicineToBrandWithPriceLoading,
  } = useAddMedicineToBrandWithPrice();

  // API: edit Medicine to brand with price
  const {
    mutate: editMedicineToBrandWithPriceMutate,
    isLoading: editMedicineToBrandWithPriceLoading,
  } = useEditMedicineToBrandWithPrice();

  const queryClient = useQueryClient();

  // Branch with price
  const [branchWithPrice, setBranchWithPrice] = useState([]);

  const [body, setBody] = useState({
    medicineName: "",
    requirePrescript: false,
    image: "",
    specificationId: null,
    categories: [],
    pharmaceuticalCompanies: [],
    dosageForms: [],
    activeIngredients: [],
  });

  useEffect(() => {
    if (initData) {
      const formattedData = {
        ...initData,
        specificationId: initData.specification.id,
      };
      setBody((prev) => ({
        ...prev,
        ...formattedData,
      }));
      form.setFieldsValue(formattedData);

      setBranchWithPrice(
        initData.medicineInBrands.map((item) => ({
          price: item.price,
          brandId: item.brand.id,
          medicineUrl: item.medicineUrl,
        }))
      );
    }
  }, [initData, form]);

  const { data: specificationList = [] } = useGetSpecificationList({
    PageSize: 9999999,
  });

  const onSubmit = () => {
    const payload = {
      ...body,
      categories: body.categories.map((item) => item.id),
      dosageForms: body.dosageForms.map((item) => item.id),
      activeIngredients: body.activeIngredients.map((item) => item.id),
      pharmaceuticalCompanies: body.pharmaceuticalCompanies.map(
        (item) => item.id
      ),
    };
    if (id) {
      updateMutate(payload, {
        onSuccess: async () => {
          await branchWithPrice.map(async (item) => {
            await editMedicineToBrandWithPriceMutate({ id, data: item }, {});
          });
          queryClient.invalidateQueries("getListMedicine");
          toast.success("Cập nhật thành công");
          onClose();
        },
      });
    } else {
      createMutate(payload, {
        onSuccess: async ({ id }) => {
          await branchWithPrice.map(async (item) => {
            await addMedicineToBrandWithPriceMutate({ id, data: item }, {});
          });
          queryClient.invalidateQueries("getListMedicine");
          toast.success("Thêm thành công!");
          onClose();
        },
      });
    }
  };

  useEffect(() => {
    const elements = document.querySelectorAll(
      ".ant-col.ant-col-16.ant-form-item-control"
    );
    elements.forEach((element) => {
      element.classList.remove("ant-col-16");
    });
  }, []);

  return (
    <Dialog onClose={onClose}>
      <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
        {id ? "CẬP NHẬT " : "THÊM "}THUỐC
      </h2>
      <Form
        form={form}
        onFinish={onSubmit}
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ textAlign: "center", margin: "20px", paddingLeft: "20px" }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item name="medicineName">
          <div className="flex">
            <p style={{ fontSize: "18px", width: "200px", textAlign: "left" }}>
              Tên thuốc:
            </p>
            <Input
              style={{ width: "100%" }}
              value={body.medicineName}
              onChange={(e) =>
                setBody({ ...body, medicineName: e.target.value })
              }
            />
          </div>
        </Form.Item>

        <Form.Item name="image">
          <div className="flex">
            <p style={{ fontSize: "18px", width: "200px", textAlign: "left" }}>
              Hình ảnh:
            </p>
            <Input
              value={body.image}
              onChange={(e) => setBody({ ...body, image: e.target.value })}
            />
          </div>
        </Form.Item>

        {id ? (
          <CustomSelect
            list={specificationList.map((i) => ({
              label: i.typeName,
              value: i.id,
            }))}
            selected={body.specificationId}
            onChange={(value) => setBody({ ...body, specificationId: value })}
          />
        ) : (
          <Form.Item name="specificationId">
            <div className="flex">
              <p
                style={{ fontSize: "18px", width: "200px", textAlign: "left" }}
              >
                Loại:{" "}
              </p>
              <Select
                labelInValue
                value={
                  body.specificationId
                    ? {
                      label: specificationList.find(
                        (spec) => spec.id === body.specificationId
                      )?.typeName,
                      value: body.specificationId,
                    }
                    : undefined
                }
                style={{ width: "100%" }}
                options={specificationList.map((i) => ({
                  label: i.typeName,
                  value: i.id,
                }))}
                onChange={(value) => {
                  setBody({ ...body, specificationId: value.value });
                  form.setFieldsValue({ specificationId: value });
                }}
                placeholder="Loại"
              />
            </div>
          </Form.Item>
        )}

        <MultiCategories
          list={body.categories}
          onChange={(data) => setBody({ ...body, categories: data })}
        />

        <MultiPharmaceutical
          list={body.pharmaceuticalCompanies}
          onChange={(data) =>
            setBody({ ...body, pharmaceuticalCompanies: data })
          }
        />

        <MultiDosages
          list={body.dosageForms}
          onChange={(data) => setBody({ ...body, dosageForms: data })}
        />

        <MultiActive
          list={body.activeIngredients}
          onChange={(data) => setBody({ ...body, activeIngredients: data })}
        />

        <MultiBrand list={branchWithPrice || []} setList={setBranchWithPrice} />

        <Form.Item
          name="requirePrescript"
          valuePropName="checked"
          style={{ marginLeft: 18 }}
        >
          <Checkbox
            onChange={(e) =>
              setBody({ ...body, requirePrescript: e.target.checked })
            }
            checked={body.requirePrescript}
          >
            Yêu cầu đọc hướng dẫn sử dụng trước khi dùng
          </Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 7 }}>
          <GradientButton
            action={"submit"}
            type={"primary"}
            label={
              createLoading || updateLoading ? "Đang tải..." : "CẬP NHẬT ➕"
            }
          />
        </Form.Item>
      </Form>
    </Dialog>
  );
};

export default AddProduct;
