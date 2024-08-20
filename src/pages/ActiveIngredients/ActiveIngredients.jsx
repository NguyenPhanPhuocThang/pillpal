import React, { useMemo, useState } from "react";
import GradientButton from "../../components/button/GradientButton";
import CustomTable from "../../components/table";
import { useGetActiveIngredientList } from "../../hooks/useActiveIngredientApi";
import useDialog from "../../hooks/useDialog";
import AddActiveIngredient from "./_components/AddActiveIngredient";
import DeleteActiveIngredient from "./_components/DeleteActiveIngredient";
import DetailActiveIngredient from "./_components/DetailActiveIngredient";

const columns = [
  {
    title: "Mã",
    dataIndex: "ingredientCode",
    key: "ingredientCode",
    sorter: (a, b) => a.ingredientCode.localeCompare(b.ingredientCode),
  },
  {
    title: "Tên hoạt chất",
    dataIndex: "ingredientName",
    key: "ingredientName",
    sorter: (a, b) => a.ingredientName.localeCompare(b.ingredientName),
  },
  {
    title: "",
    dataIndex: "edit",
    key: "edit",
    width: 100,
  },
  {
    title: "",
    dataIndex: "delete",
    key: "delete",
    width: 100,
  },
];
const ActiveIngredients = () => {
  const [detailSelected, setDetailSelected] = useState(null);

  // api get list
  const { isLoading, data = [] } = useGetActiveIngredientList({
    PageSize: 99999999,
  });

  // dialog state
  const { isShow: openDetail, toggleDialog: toggleDetail } = useDialog();
  const { isShow: openAddDialog, toggleDialog: toggleAddDialog } = useDialog();
  const { isShow: openDelete, toggleDialog: toggleDelete } = useDialog();
  const { isShow: openUpdate, toggleDialog: toggleUpdate } = useDialog();

  const dataSource = useMemo(() => {
    return data.map((item) => ({
      ...item,
      edit: (
        <GradientButton
          label={"Chỉnh sửa"}
          onClick={(e) => {
            e.stopPropagation();
            setDetailSelected(item.id);
            toggleUpdate();
          }}
          type={"warning"}
        />
      ),
      delete: (
        <GradientButton
          label={"Xóa"}
          onClick={(e) => {
            e.stopPropagation();
            setDetailSelected(item.id);
            toggleDelete();
          }}
          type={"danger"}
        />
      ),
    }));
  }, [data]);

  return (
    <div>
      <GradientButton
        label={"Thêm thành phần hoạt chất"}
        onClick={toggleAddDialog}
        style={{ marginBottom: "20px" }}
      />
      <CustomTable
        columns={columns}
        data={dataSource}
        onRowClick={(r) => {
          setDetailSelected(r.id);
          toggleDetail();
        }}
        isLoading={isLoading}
      />
      {openAddDialog && <AddActiveIngredient onClose={toggleAddDialog} />}
      {openDetail && (
        <DetailActiveIngredient
          id={detailSelected}
          onClose={() => {
            setDetailSelected(null);
            toggleDetail();
          }}
        />
      )}
      {openUpdate && (
        <AddActiveIngredient
          onClose={() => {
            toggleUpdate();
            setDetailSelected(null);
          }}
          id={detailSelected}
        />
      )}
      {openDelete && (
        <DeleteActiveIngredient
          id={detailSelected}
          onClose={() => {
            toggleDelete();
            setDetailSelected(null);
          }}
        />
      )}
    </div>
  );
};

export default ActiveIngredients;
