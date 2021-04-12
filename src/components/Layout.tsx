import React, { ReactNode } from "react";
import styled from "styled-components";

import Header from "./Header";

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 3rem 3rem;
`;

const Content = styled.div`
  width: 450px;
`;

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      <ContentWrapper>
        <Content>{children}</Content>
      </ContentWrapper>
    </div>
  );
}
