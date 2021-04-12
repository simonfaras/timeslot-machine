import React from "react";
import styled from "styled-components";
import { useSession } from "next-auth/client";
import Link from "next/link";

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 1rem 2rem;
  border-bottom: 1px solid #282c34;
  box-shadow: 2px 2px 1px rgba(0, 0, 0, 0.2);
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  width: 1024px;
`;

const HeaderTitle = styled.span`
  font-size: 1.5rem;
  line-height: 1;
`;

const UserName = styled.span`
  margin-right: 1rem;
`;

export default function Header() {
  const [session] = useSession();

  const isLoggedIn = !!session;

  return (
    <HeaderWrapper>
      <HeaderContainer>
        <HeaderTitle>Vad vad det jag gjorde?</HeaderTitle>
        <div>
          {isLoggedIn ? (
            <div>
              <UserName>[{session.user.name}]</UserName>
              <Link href="/api/auth/signout">
                <a>Logga ut</a>
              </Link>
            </div>
          ) : (
            <Link href="/api/auth/signin">
              <a>Logga in</a>
            </Link>
          )}
        </div>
      </HeaderContainer>
    </HeaderWrapper>
  );
}
