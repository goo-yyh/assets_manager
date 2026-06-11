import type { PropsWithChildren, ReactNode } from 'react';
import { PageContainer } from '@ant-design/pro-components';

type AppPageContainerProps = PropsWithChildren<{
  title: string;
  extra?: ReactNode;
}>;

export function AppPageContainer({ title, extra, children }: AppPageContainerProps) {
  return (
    <PageContainer
      title={title}
      extra={extra}
      ghost
      style={{ paddingBlockStart: 0 }}
    >
      {children}
    </PageContainer>
  );
}
