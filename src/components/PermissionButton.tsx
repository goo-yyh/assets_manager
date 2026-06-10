import type { ReactNode } from 'react';
import { Button, Tooltip } from 'antd';
import type { ButtonProps } from 'antd';
import type { PermissionCode } from '@/types/permission';
import { usePermission } from '@/hooks/usePermission';

type PermissionButtonProps = ButtonProps & {
  permission?: PermissionCode;
  children: ReactNode;
};

export function PermissionButton({ permission, children, disabled, ...props }: PermissionButtonProps) {
  const allowed = usePermission(permission);

  if (!allowed) {
    return (
      <Tooltip title="当前角色无此操作权限">
        <Button {...props} disabled>
          {children}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button {...props} disabled={disabled}>
      {children}
    </Button>
  );
}
