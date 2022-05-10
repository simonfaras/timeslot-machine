import React, { useEffect, useState } from "react";
import Periods from "@/views/Periods";

export default function PeriodsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  });

  return (
    <div>
      {!isClient && "Laddar"}
      {isClient && <Periods />}
    </div>
  );
}

export { default as getServerSideProps } from "@/utils/getAuthServerSideProps";
