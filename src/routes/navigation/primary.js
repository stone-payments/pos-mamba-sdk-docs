import NAV_COMPONENTS from './NAV_COMPONENTS';

export default [
  { type: 'hr' },
  {
    title: 'Components',
    to: '/components',
    icon: 'fas fa-cube',
    submenu: [
      ...NAV_COMPONENTS,
    ],
  },
  { type: 'hr' },
  {
    title: 'API Nativa',
    to: '/native',
    icon: 'fas fa-microchip',
    submenu: [
      { title: 'App', to: '/app'},
      { title: 'Http', to: '/http' },
      { title: 'Keyboard', to: '/keyboard' },
      { title: 'Merchant', to: '/merchant' },
      { title: 'Payment', to: '/payment' },
      { title: 'Printer', to: '/printer' },
      { title: 'System', to: '/system' },
      { title: 'Storage', to: '/storage' },
    ],
  },
]
