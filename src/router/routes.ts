import { RouteRecordRaw } from 'vue-router';
import { Loading } from 'quasar';

const routes: RouteRecordRaw[] = [
  /* PUBLIC */
  {
    path: '/:catchAll(.*)*',
    component: async () => {
      try {
        Loading.show();
        const component = await import('pages/ErrorNotFound.vue');
        return component;
      } finally {
        Loading.hide();
      }
    },
  },
  {
    path: '/not-allowed',
    name: 'not-allowed',
    component: async () => {
      try {
        Loading.show();
        const component = await import('pages/ErrorNotAllowed.vue');
        return component;
      } finally {
        Loading.hide();
      }
    },
  },
  {
    path: '/email-not-verified',
    name: 'email-not-verified',
    component: async () => {
      try {
        Loading.show();
        const component = await import('pages/ErrorEmailNotVerified.vue');
        return component;
      } finally {
        Loading.hide();
      }
    },
  },
  {
    path: '/dev',
    name: 'dev',
    component: async () => {
      try {
        Loading.show();
        const component = await import('src/pages/DevPage.vue');
        return component;
      } finally {
        Loading.hide();
      }
    },
  },

  /* GUEST */
  {
    path: '/',
    component: async () => {
      try {
        Loading.show();
        const component = await import('src/layouts/guest/MainLayout.vue');
        return component;
      } finally {
        Loading.hide();
      }
    },
    children: [
      {
        path: '',
        meta: { guest: true },
        component: async () => {
          try {
            Loading.show();
            const component = await import('src/pages/guest/LoginPage.vue');
            return component;
          } finally {
            Loading.hide();
          }
        },
      },
      {
        path: 'login',
        name: 'login',
        meta: { guest: true },
        component: async () => {
          try {
            Loading.show();
            const component = await import('src/pages/guest/LoginPage.vue');
            return component;
          } finally {
            Loading.hide();
          }
        },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        meta: { guest: true },
        component: async () => {
          try {
            Loading.show();
            const component = await import('src/pages/guest/ForgotPassword.vue');
            return component;
          } finally {
            Loading.hide();
          }
        },
      },
      {
        path: 'password-reset/:token',
        name: 'password-reset',
        meta: { guest: true },
        component: async () => {
          try {
            Loading.show();
            const component = await import('src/pages/guest/PasswordReset.vue');
            return component;
          } finally {
            Loading.hide();
          }
        },
      },
      {
        path: '/verify-email/:id/:hash',
        name: 'verify-email',
        component: async () => {
          try {
            Loading.show();
            const component = await import('src/pages/guest/VerifyEmail.vue');
            return component;
          } finally {
            Loading.hide();
          }
        },
      },
    ],
  },

  /* AUTHENTICATED */
  {
    path: '/',
    meta: { auth: true, verified_email_required: true },
    component: async () => {
      try {
        Loading.show();
        const component = await import('src/layouts/auth/MainLayout.vue');
        return component;
      } finally {
        Loading.hide();
      }
    },
    children: [
      {
        path: '',
        meta: { permission: 'painel_page' },
        component: async () => {
          try {
            Loading.show();
            const component = await import('src/pages/auth/painel/PainelPage.vue');
            return component;
          } finally {
            Loading.hide();
          }
        },
      },
      {
        path: 'painel',
        name: 'painel',
        meta: { permission: 'painel_page' },
        component: async () => {
          try {
            Loading.show();
            const component = await import('src/pages/auth/painel/PainelPage.vue');
            return component;
          } finally {
            Loading.hide();
          }
        },
        props: (route) => ({ openTab: route.query.openTab || null }),
      },
      {
        path: 'cadastros/usuarios',
        name: 'registrations.users',
        meta: { permission: 'users_page' },
        component: async () => {
          try {
            Loading.show();
            const component = await import('src/pages/auth/users/ListPage.vue');
            return component;
          } finally {
            Loading.hide();
          }
        },
      },
      {
        path: 'cadastros/funcoes',
        name: 'registrations.roles',
        meta: { permission: 'roles_page' },
        component: async () => {
          try {
            Loading.show();
            const component = await import('src/pages/auth/roles/ListPage.vue');
            return component;
          } finally {
            Loading.hide();
          }
        },
      },
      {
        path: 'cadastros/categorias',
        name: 'registrations.categories',
        meta: { permission: 'categories_page' },
        component: async () => {
          try {
            Loading.show();
            const component = await import('src/pages/auth/categories/ListPage.vue');
            return component;
          } finally {
            Loading.hide();
          }
        },
      },
      {
        path: 'cadastros/movimentos-financeiros',
        name: 'registrations.movements',
        meta: { permission: 'movements_page' },
        component: async () => {
          try {
            Loading.show();
            const component = await import('src/pages/auth/movements/ListPage.vue');
            return component;
          } finally {
            Loading.hide();
          }
        },
      },
    ],
  },
];

export default routes;
