import React, { useMemo, useState } from "react";
import GradientButton from "../../components/button/GradientButton";
import CustomTable from "../../components/table";
import useDialog from "../../hooks/useDialog";
import { useGetPharmaceuticalList } from "../../hooks/usePharmaceutialApi";
import AddPharmaceutical from "./_components/AddPharmaceutical";
import DeletePharmaceutical from "./_components/DeletePharmaceutical";
import DetailPharmaceutical from "./_components/DetailPharmaceutical";

const columns = [
  {
    title: "Tên công ty",
    dataIndex: "companyName",
    key: "companyName",
    sorter: (a, b) => a.companyName.localeCompare(b.companyName),
  },
  {
    title: "Quốc gia",
    dataIndex: "nation",
    key: "nation",
    sorter: (a, b) => a.nation.localeCompare(b.nation),
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
const Pharmaceuticals = () => {
  const [selectedPharmaceutical, setSelectedPharmaceutical] = useState(null);

  // Api get pharmaceutical list
  const { data = [], isLoading } = useGetPharmaceuticalList({
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
      nation: item.nation.nationName,
      edit: (
        <GradientButton
          label={"Chỉnh sửa"}
          type={"warning"}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPharmaceutical(item.id);
            toggleUpdate();
          }}
        />
      ),
      delete: (
        <GradientButton
          label={"Xóa"}
          type={"danger"}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPharmaceutical(item.id);
            toggleDelete();
          }}
        />
      ),
    }));
  }, [data]);

  return (
    <div>
      <GradientButton
        label={"Thêm công ty dược phẩm"}
        onClick={toggleAddDialog}
        style={{ marginBottom: "20px" }}
      />
      <CustomTable
        columns={columns}
        data={dataSource}
        isLoading={isLoading}
        onRowClick={(r) => {
          setSelectedPharmaceutical(r.id);
          toggleDetail();
        }}
      />
      {openDetail && (
        <DetailPharmaceutical
          id={selectedPharmaceutical}
          onClose={() => {
            setSelectedPharmaceutical(null);
            toggleDetail();
          }}
        />
      )}
      {openAddDialog && <AddPharmaceutical onClose={toggleAddDialog} />}
      {openUpdate && (
        <AddPharmaceutical
          id={selectedPharmaceutical}
          onClose={() => {
            toggleUpdate();
            setSelectedPharmaceutical(null);
          }}
        />
      )}
      {openDelete && (
        <DeletePharmaceutical
          id={selectedPharmaceutical}
          onClose={() => {
            toggleDelete();
            setSelectedPharmaceutical(null);
          }}
        />
      )}
    </div>
  );
};

export default Pharmaceuticals;
