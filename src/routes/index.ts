import { lazy } from 'react';

const Vault = lazy(() => import('../pages/Vault'));
const Swap = lazy(() => import('../pages/Swap'));
const Earn = lazy(() => import('../pages/Earn'))

const coreRoutes = [
  {
    path: '/swap',
    title: 'Swap',
    component: Swap,
  },
  {
    path: '/vault',
    title: 'Vault',
    component: Vault,
  },
  {
    path: '/earn',
    title: 'earn',
    component: Earn,
  },
];

const routes = [...coreRoutes];
export default routes;
