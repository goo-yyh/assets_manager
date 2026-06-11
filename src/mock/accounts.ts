import type { RoleKey } from '@/types/permission';

export type LoginAccount = {
  username: string;
  password: string;
  roleKey: RoleKey;
  roleName: string;
  description: string;
};

export const loginAccounts: LoginAccount[] = [
  {
    username: 'admin',
    password: '123456',
    roleKey: 'system_admin',
    roleName: '系统管理员',
    description: '拥有组织、用户、角色、菜单、按钮和数据权限配置能力。',
  },
  {
    username: 'zhangmin',
    password: '123456',
    roleKey: 'asset_admin',
    roleName: '资产管理员',
    description: '负责资产台账、入账、调拨、处置和资产盘点。',
  },
  {
    username: 'liqiang',
    password: '123456',
    roleKey: 'equipment_admin',
    roleName: '设备档案管理员',
    description: '负责一机一档、技术参数、合同证件、验收资料和图片影像。',
  },
  {
    username: 'wanglei',
    password: '123456',
    roleKey: 'spare_admin',
    roleName: '备件管理员',
    description: '负责备件台账、库存、入库、出库、盘点和预警。',
  },
  {
    username: 'factory_mgr',
    password: '123456',
    roleKey: 'factory_manager',
    roleName: '厂区/部门负责人',
    description: '按所属厂区处理资产调拨、处置、备件领用和盘点审批。',
  },
  {
    username: 'zhaofang',
    password: '123456',
    roleKey: 'finance',
    roleName: '财务人员',
    description: '负责财务编号、折旧净值、转固同步和处置核销确认。',
  },
  {
    username: 'chengong',
    password: '123456',
    roleKey: 'maintenance',
    roleName: '维修/保养人员',
    description: '查看设备档案和 MOM 数据，发起备件领用与退库。',
  },
  {
    username: 'liuzong',
    password: '123456',
    roleKey: 'executive',
    roleName: '管理层',
    description: '查看集团级首页、资产、厂区、维修、费用和备件分析。',
  },
];
