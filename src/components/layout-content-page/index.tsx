import React from 'react';
import { Layout } from 'antd';

type LayoutContentPageProps = {
  children: React.ReactNode;
  className?: string;
};

const LayoutContentPage: React.FC<LayoutContentPageProps> = (props) => {
  return <Layout.Content className={`${props.className}`}>{props.children}</Layout.Content>;
};

export default LayoutContentPage;
