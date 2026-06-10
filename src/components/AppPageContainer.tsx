import type { PropsWithChildren, ReactNode } from 'react';
import { PageContainer } from '@ant-design/pro-components';

type AppPageContainerProps = PropsWithChildren<{
  title: string;
  subTitle?: string;
  extra?: ReactNode;
}>;

export function AppPageContainer({ title, subTitle, extra, children }: AppPageContainerProps) {
  return (
    <PageContainer
      title={title}
      subTitle={subTitle}
      extra={extra}
      ghost
      style={{ paddingBlockStart: 0 }}
    >
      {children}
    </PageContainer>
  );
}
