import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";
import GradientButton from "../../components/button/GradientButton";
import CustomTable from "../../components/table";
import {
  useGetCustomerList,
  useLockCustomer,
  useUnlockCustomer,
} from "../../hooks/useCustomerApi";
import useDialog from "../../hooks/useDialog";
import { dateTimeFormat } from "../../utils/time";
import DetailCustomer from "./_components/Detail";
import { Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";


const Customers = () => {
  const queryClient = useQueryClient();
  const { isShow, toggleDialog } = useDialog();
  const [selected, setSelected] = useState(null);
  const { isShow: isDetailVisible, toggleDialog: toggleSeeDetail } = useDialog();
  const [lockStatus, setLockStatus] = useState({});

  console.log(selected);
  const { mutate: lockMutate, isLoading: lockLoading } = useLockCustomer();
  const { mutate: unlockMutate, isLoading: unlockLoading } =
    useUnlockCustomer();

  const handleLock = (id) => {
    lockMutate(id, {
      onSuccess: () => {
        setSelected(null);
        toast.success("Khóa khách hàng thành công");
        queryClient.invalidateQueries("getCustomerList");
      },
    });
  };

  const handleUnlock = (id) => {
    unlockMutate(id, {
      onSuccess: () => {
        setSelected(null);
        toast.success("Mở khóa thành công!  ");
        queryClient.invalidateQueries("getCustomerList");
      },
    });
  };

  const [filteredInfo, setFilteredInfo] = useState({});

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
    },
    {
      title: "Gói đăng ký",
      dataIndex: "customerPackage",
      key: "customerPackage",
      sorter: (a, b) => a.customerPackage.localeCompare(b.customerPackage),
      filters: [
        { text: 'Gói trải nghiệm', value: 'Gói trải nghiệm' },
        { text: 'Gói tiết kiệm', value: 'Gói tiết kiệm' },
        { text: 'Gói ưu đãi', value: 'Gói ưu đãi' },
      ],
      onFilter: (value, record) => record.customerPackage.indexOf(value) === 0,
    },
    {
      title: "Trạng thái",
      dataIndex: "lockoutEnabled",
      key: "lockoutEnabled",
      sorter: (a, b) => {
        const textA = a.lockoutEnabled.props.children;
        const textB = b.lockoutEnabled.props.children;
        return textA.localeCompare(textB);
      },
    },
    {
      title: "Lần cuối khóa",
      dataIndex: "lockoutEnd",
      key: "lockoutEnd",
    },
    {
      title: "Xem chi tiết",
      dataIndex: "seeDetail",
      key: "seeDetail",
      width: 70,
    },
    {
      title: "",
      dataIndex: "lock",
      key: "lock",
      width: 70,
    },
    {
      title: "",
      dataIndex: "unlock",
      key: "unlock",
      width: 150,
    },
  ];

  // API: get customer list
  const { data = [], isLoading } = useGetCustomerList({
    PageSize: 99999999,
  });

  const isLocked = (lockoutEnd) => {
    if (!lockoutEnd) return <Tag color="success">Đang hoạt động</Tag>;
    if (new Date(lockoutEnd) < new Date()) return <Tag color="error">Đã vô hiệu hóa</Tag>;
    return <Tag color="error">Đã vô hiệu hóa</Tag>;
  };

  const dataSource = useMemo(() => {
    return data.map((item) => {
      const isUserLocked = lockStatus[item.id] ?? new Date(item.applicationUser.lockoutEnd) > new Date();
      return {
        ...item,
        ...item.applicationUser,
        id: item.id,
        lockoutEnd: dateTimeFormat(item.applicationUser.lockoutEnd),
        lockoutEnabled: isLocked(item.applicationUser.lockoutEnd),
        phoneNumber: item.applicationUser.phoneNumber || "N/A",
        customerPackage: item.customerPackage || "N/A",
        lockoutEnd: dateTimeFormat(item.applicationUser.lockoutEnd) || "N/A",
        seeDetail: (
          <EyeOutlined
            style={{ fontSize: "20px", color: "#1890ff" }}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(item.id);
              toggleSeeDetail();
            }}
          />
        ),
        lock: !isUserLocked && (
          <GradientButton
            type={"danger"}
            label={"Khóa"}
            onClick={(e) => {
              e.stopPropagation();
              handleLock(item.id);
            }}
          />
        ),
        unlock: isUserLocked && (
          <GradientButton
            label={"Mở khóa"}
            type={"warning"}
            onClick={(e) => {
              e.stopPropagation();
              handleUnlock(item.id);
            }}
          />
        ),
      };
    });
  }, [data, lockStatus]);

  return (
    <>
      <CustomTable
        columns={columns}
        data={dataSource}
        onChange={handleChange}
        isLoading={isLoading}
        onRowClick={(r) => {
          setSelected(r.id);
          toggleDialog();
        }}
      />

      {isDetailVisible && selected && (
        <DetailCustomer
          id={selected}
          onClose={() => {
            toggleSeeDetail();
            setSelected(null);
          }}
        />
      )}
    </>
  );
};

export default Customers;
