
import React from 'react';
import { Outlet } from 'react-router-dom';

const MarketplaceLayout: React.FC = () => (
  <div>
    <Outlet />
  </div>
);

export default MarketplaceLayout;
