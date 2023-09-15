import { lazy } from 'react';

const Vault = lazy(() => import('../pages/Vault'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
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
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
  },
  {
    path: '/chart',
    title: 'Chart',
    component: Chart,
  },
];

const routes = [...coreRoutes];
export default routes;
