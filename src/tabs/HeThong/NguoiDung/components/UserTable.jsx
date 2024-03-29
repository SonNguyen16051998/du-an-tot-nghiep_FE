import {
  Button,
  message,
  Popconfirm,
  Input,
  Table,
  Transfer,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  LOI,
  LOI_HE_THONG,
  RETCODE_SUCCESS,
  SUCCESS,
} from "../../../../constants/api";
import { getDsNguoiDungSvc } from "../../../../store/nguoidung/service";
import {
  getNguoiDung_PhongBanSvc,
  themNguoiDung_PhongBanSvc,
} from "../../../../store/nguoidung_phongban/service";
import {
  getNguoiDung_VaiTroSvc,
  themNguoiDung_VaiTroSvc,
} from "../../../../store/nguoidung_vaitro/service";
import { getDsPhongBanSvc } from "../../../../store/phongban/service";
import { getDsVaiTroSvc } from "../../../../store/vaitro/service";
import { toLowerCaseNonAccentVietnamese } from "../../../../utils/strings";
import { ArrowLeftOutlined, DoubleLeftOutlined } from "@ant-design/icons";
import formState from "../assets/formState";

const PHONG_BAN = "Phòng ban";
const VAI_TRO = "Vai trò";

export default ({
  isShowTransfer,
  setIsShowTransfer,
  setUserFormState,
  setUserData,
  setCurrentTab,
  setUserList,
}) => {
  const [list, setList] = useState([]);
  const [subListName, setSubListName] = useState(PHONG_BAN); // Phòng ban || Vai trò
  const [searchList, setSearchList] = useState([]);
  const [getListLoading, setGetListLoading] = useState(true);
  const [getSubListLoading, setGetSubListLoading] = useState(false);
  const [addSubLoading, setAddSubLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

  const [transferData, setTransferData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [finalKeys, setFinalKeys] = useState([]);

  const handleGetList = async () => {
    setGetListLoading(true);
    try {
      const res = await getDsNguoiDungSvc();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        const list = res.data?.data
          ?.filter((i) => i?.isDeleted === false)
          ?.map((i) => {
            return {
              maSo: i?.ma_NguoiDung,
              itemName: i?.hoTen,
              key: i?.ma_NguoiDung,
              email: i?.email,
              sdt: i?.sdt,
              gioiTinh: i?.gioiTinh,
              diaChi: i?.diaChi,
              ma_ChucDanh: i?.ma_ChucDanh,
              avatar: i?.avatar,
            };
          });

        setList(list);
        setUserList(list);
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setGetListLoading(false);
    }
  };

  const handleGetSubListPB = async (id = -1) => {
    setGetSubListLoading(true);

    try {
      const res = await getDsPhongBanSvc();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        const subList = res.data?.data
          ?.filter((i) => i?.isDeleted === false)
          ?.map((i) => {
            return {
              maSo: i?.ma_PhongBan,
              itemName: i?.ten_PhongBan,
              key: i?.ten_PhongBan,
            };
          });

        const res_2 = await getNguoiDung_PhongBanSvc({ id });

        if (
          res_2.status === SUCCESS &&
          res_2.data?.retCode === RETCODE_SUCCESS
        ) {
          const selectedList = res_2.data?.data;
          getTransferData(subList, selectedList);
        }
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setGetSubListLoading(false);
    }
  };

  const handleGetSubListVT = async (id = -1) => {
    setGetSubListLoading(true);

    try {
      const res = await getDsVaiTroSvc();

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        const subList = res.data?.data
          ?.filter((i) => i?.isDeleted === false)
          ?.map((i) => {
            return {
              maSo: i?.ma_Role,
              itemName: i?.ten_Role,
              key: i?.ma_Role,
            };
          });

        const res_2 = await getNguoiDung_VaiTroSvc({ id });

        if (
          res_2.status === SUCCESS &&
          res_2.data?.retCode === RETCODE_SUCCESS
        ) {
          const selectedList = res_2.data?.data;
          getTransferData(subList, selectedList);
        }
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setGetSubListLoading(false);
    }
  };

  const handleDelete = async (item) => {
    // try {
    //   const res = await xoaVaiTroSvc({ id: item.maSo });
    //   if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
    //     message.success(res.data?.retText);
    //     handleGetList();
    //   } else {
    //     message.error(LOI);
    //   }
    // } catch (error) {
    //   message.error(LOI_HE_THONG);
    // } finally {
    // }
  };

  const handleSearch = (keyword) => {
    setKeyword(keyword);

    setSearchList(
      [...list].filter((i) =>
        toLowerCaseNonAccentVietnamese(i?.itemName).includes(
          toLowerCaseNonAccentVietnamese(keyword),
        ),
      ),
    );
  };

  const getTransferData = (list, selectedList = []) => {
    const maSo = subListName === PHONG_BAN ? "ma_PhongBan" : "ma_Role";

    const targetKeys = [];
    const transferData = [];

    for (let i = 0; i < list.length - 1; i++) {
      const item = list[i];

      const data = {
        key: item?.maSo,
        title: item?.itemName,
        chosen: selectedList.find((i) => i[maSo] === item?.maSo),
      };

      if (!data.chosen) {
        targetKeys.push(data.key);
      }
      transferData.push(data);
    }

    setTransferData(transferData);
    setTargetKeys(targetKeys);
  };

  const handleTransfer = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
    setFinalKeys(
      transferData
        .filter((i) => !newTargetKeys?.includes(i?.key))
        .map((i) => i.key),
    );
  };

  const handleAddNguoiDung_PB = async () => {
    setAddSubLoading(true);

    try {
      const res = await themNguoiDung_PhongBanSvc({
        id_NguoiDung: selectedItem?.maSo,
        phongBans: finalKeys.map((item) => {
          return {
            id_PhongBan: item,
          };
        }),
      });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setAddSubLoading(false);
    }
  };

  const handleAddNguoiDung_VT = async () => {
    setAddSubLoading(true);

    try {
      const res = await themNguoiDung_VaiTroSvc({
        id_NguoiDung: selectedItem?.maSo,
        roles: finalKeys.map((item) => {
          return {
            id_role: item,
          };
        }),
      });

      if (res.status === SUCCESS && res.data?.retCode === RETCODE_SUCCESS) {
        message.success(res.data?.retText);
      } else {
        message.error(LOI);
      }
    } catch (error) {
      message.error(LOI_HE_THONG);
    } finally {
      setAddSubLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã số",
      dataIndex: "maSo",
      key: "maSo",
    },
    {
      title: "Họ và tên",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "sdt",
      key: "sdt",
    },
    {
      title: "Hành động",
      key: "hanhDong",
      render: (_, record) => (
        <div>
          <div>
            <div className="d-flex">
              <Button
                type="link"
                onClick={() => {
                  setSelectedItem(record);
                  setUserFormState(formState.DETAIL);
                  setUserData(record);
                  setCurrentTab(2);
                }}>
                Chi tiết
              </Button>
              <Button
                onClick={() => {
                  setSelectedItem(record);
                  setUserFormState(formState.EDIT);
                  setUserData(record);
                  setCurrentTab(2);
                }}
                type="link">
                Sửa
              </Button>

              <Popconfirm
                title="Bạn có chắc chắn muốn xoá?"
                onConfirm={() => handleDelete(record)}
                okText="Đồng ý"
                cancelText="Thoát">
                <Button type="link">Xoá</Button>
              </Popconfirm>
            </div>

            <div className="d-flex">
              <Button
                type="link"
                onClick={() => {
                  setSelectedItem(record);
                  setIsShowTransfer(true);
                  handleGetSubListVT(record?.maSo);
                  setSubListName(VAI_TRO);
                }}>
                Vai trò
              </Button>

              <Button
                type="link"
                onClick={() => {
                  setSelectedItem(record);
                  setIsShowTransfer(true);
                  handleGetSubListPB(record?.maSo);
                  setSubListName(PHONG_BAN);
                }}>
                Phân nhóm
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    handleGetList();
  }, []);
  return (
    <div>
      {isShowTransfer ? (
        <div>
          <div className="mt-2 mb-4 d-flex justify-content-between">
            <Button
              type="link"
              className="d-flex align-items-center"
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                handleGetList();
                setIsShowTransfer(false);
              }}>
              Danh sách
            </Button>

            {/* <div>Vai trò hiện tại: {selectedItem?.itemName}</div> */}
          </div>

          {getSubListLoading ? (
            <div className="d-flex justify-content-center">
              <Spin className="mt-4 mb-3" />
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center mt-2">
              <div className="d-flex align-items-center justify-content-center gap-5">
                <div>{subListName} đã có</div>
                <DoubleLeftOutlined />
                <div>{subListName} chưa có</div>
              </div>

              <Transfer
                dataSource={transferData}
                listStyle={{
                  width: 250,
                  height: 350,
                  marginTop: 10,
                }}
                targetKeys={targetKeys}
                onChange={handleTransfer}
                render={(item) => `${item.title}`}
              />

              <Button
                type="primary"
                className="mt-3"
                loading={addSubLoading}
                onClick={
                  subListName === PHONG_BAN
                    ? handleAddNguoiDung_PB
                    : handleAddNguoiDung_VT
                }>
                Xác nhận
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div style={{}}>
          <div className="mt-2 mb-4 d-flex justify-content-between">
            <Input
              style={{ width: 200 }}
              placeholder="Nhập từ khoá tìm kiếm"
              value={keyword}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Table
            loading={getListLoading}
            columns={columns}
            dataSource={keyword.trim() ? searchList : list}
            pagination={{ defaultPageSize: 5 }}
          />
        </div>
      )}
    </div>
  );
};
