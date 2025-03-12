import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'src/stores/auth';
import VueViewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';

export default boot(({ app, store, router }) => {
  app.use(VueViewer);

  const auth = useAuthStore(store);

  router.beforeEach(async (to) => {
    if (!auth.isAuthenticated) {
      if (!!to.meta.auth) {
        return { name: 'login' };
      }
    }

    if (!!auth.isAuthenticated) {
      if (!!to.meta.guest) {
        return { name: 'painel' };
      }

      if (!auth.user?.email_verified_at && !!to.meta.verified_email_required) {
        return { name: 'email-not-verified' };
      }

      if ('permission' in to.meta && !auth.hasPermission(to.meta.permission)) {
        return { name: 'not-allowed' };
      }
    }
  });
});
