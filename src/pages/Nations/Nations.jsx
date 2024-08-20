import { Button } from "antd";
import React, { useMemo, useState } from "react";
import CustomTable from "../../components/table";
import useDialog from "../../hooks/useDialog";
import { useGetNationList } from "../../hooks/useNationApi";
import AddNation from "./_components/AddNation";
import DeleteNation from "./_components/DeleteNation";
import DetailNation from "./_components/DetailNation";
import GradientButton from "../../components/button/GradientButton";
const columns = [
  {
    title: "Tên quốc gia",
    dataIndex: "nationName",
    key: "nationName",
    sorter: (a, b) => a.nationName.localeCompare(b.nationName),
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
const Nations = () => {
  // api get list
  const { data = [], isLoading } = useGetNationList({
    PageSize: 99999999,
  });

  const [selectedDetail, setSelectedDetail] = useState(null);

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
          type={"warning"}
          label={"Chỉnh sửa"}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDetail(item.id);
            toggleUpdate();
          }}
        />
      ),
      delete: (
        <GradientButton
          type={"danger"}
          label={"Xóa"}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDetail(item.id);
            toggleDelete();
          }}
        />
      ),
    }));
  }, [data]);

  return (
    <div>
      <GradientButton
        label="Thêm quốc gia"
        onClick={toggleAddDialog}
        type="primary"
        style={{ marginBottom: "10px" }}
      />
      <CustomTable
        columns={columns}
        data={dataSource}
        isLoading={isLoading}
        onRowClick={(row) => ({
          onClick: () => {
            setSelectedDetail(row.id);
            toggleDetail();
          },
        })}
      />
      {openAddDialog && <AddNation onClose={toggleAddDialog} />}
      {openDetail && (
        <DetailNation
          id={selectedDetail}
          onClose={() => {
            setSelectedDetail(null);
            toggleDetail();
          }}
        />
      )}
      {openUpdate && (
        <AddNation
          id={selectedDetail}
          onClose={() => {
            setSelectedDetail(null);
            toggleUpdate();
          }}
        />
      )}
      {openDelete && (
        <DeleteNation
          id={selectedDetail}
          onClose={() => {
            setSelectedDetail(null);
            toggleDelete();
          }}
        />
      )}
    </div>
  );
};

export default Nations;
