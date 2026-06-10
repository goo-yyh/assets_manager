import { Breadcrumb } from 'antd';

type FactoryBreadcrumbProps = {
  factory?: string;
  workshop?: string;
  line?: string;
};

export function FactoryBreadcrumb({ factory, workshop, line }: FactoryBreadcrumbProps) {
  const items = [factory, workshop, line].filter(Boolean).map((title) => ({ title }));
  return <Breadcrumb items={items} />;
}
