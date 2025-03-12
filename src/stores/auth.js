import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import notify from 'src/composables/notify';
import { useCacheStore } from './cache';
import { useEnumsStore } from './enums';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    form: { email: null, password: null },
    rememberMe: false,
    isAuthenticated: false,
    token: null,
    user: {
      id: null,
      name: null,
      email: null,
      email_verified_at: null,
      gender: null,
    },
    permissions: [],
  }),
  getters: {},
  actions: {
    reset() {
      this.resetForm();
      this.token = null;
      this.user = {
        id: null,
        name: null,
        email: null,
        email_verified_at: null,
        gender: null,
      };
      this.permissions = [];
    },
    resetForm() {
      if (!this.rememberMe) {
        this.form = { email: null, password: null };
      }
    },
    resetAuth() {
      const cache = useCacheStore();

      this.isAuthenticated = false;
      this.router.push({ name: 'login' });

      this.reset();
      cache.delete('auth-user');
      cache.delete('user-permissions');
      cache.delete('enums');
    },
    async getUser(useCache = true) {
      try {
        const cache = useCacheStore();
        if (!cache.get('auth-user') || !useCache) {
          const response = await api({ url: '/api/auth/user' });
          cache.set('auth-user', true, 3600000); // 1 hora de cache
          this.user = response.data;
        }
      } catch (error) {
        notify.error(error);
      }
    },
    async getPermissions(useCache = true) {
      try {
        const cache = useCacheStore();
        if (!cache.get('user-permissions') || !useCache) {
          const response = await api({ url: '/api/unsafe/user-permissions' });
          cache.set('user-permissions', true, 300000); // 5 minuto de cache
          this.permissions = response.data;
        }
      } catch (error) {
        notify.error(error);
      }
    },
    hasPermissions(permissions) {
      const has = this.permissions.find((item) => permissions.includes(item));
      return !!has;
    },
    hasPermission(permission) {
      const has = this.permissions.find((item) => {
        return item === permission;
      });
      return !!has;
    },
    async login() {
      try {
        const response = await api({
          method: 'post',
          url: '/api/auth/login',
          data: this.form,
        });

        this.token = response.data.token;
        this.isAuthenticated = true;

        await this.syncAuth();

        this.router.push({ name: 'painel' });
      } catch (error) {
        notify.error(error);
      }
    },
    async syncAuth() {
      const enums = useEnumsStore();

      await this.getUser();
      await this.getPermissions();
      await enums.getEnums();
    },
    async logout() {
      try {
        await api({
          method: 'post',
          url: '/api/auth/logout',
        });
        this.resetAuth();
      } catch (error) {
        notify.error(error);
      }
    },
    async forgotPassword(form) {
      try {
        const response = await api({
          method: 'post',
          url: '/api/auth/forgot-password',
          data: form,
        });
        notify.success(response.message);
        this.router.push({ name: 'login' });
      } catch (error) {
        notify.error(error);
      }
    },
    async resetPassword(form) {
      try {
        const response = await api({
          method: 'post',
          url: '/api/auth/reset-password',
          data: form,
        });
        notify.success(response.message);
        this.router.push({ name: 'login' });
      } catch (error) {
        notify.error(error);
      }
    },
    async resendEmailVerification() {
      try {
        const response = await api({
          method: 'post',
          url: '/api/auth/email/verification-notification',
        });
        notify.success(response.message);
      } catch (error) {
        notify.error(error);
      }
    },
    async verifyEmail(form, id, hash) {
      try {
        const params = new URLSearchParams(window.location.search);
        const response = await api({
          method: 'post',
          url: `/api/auth/email/verify/${id}/${hash}`,
          params,
          data: form,
        });

        this.token = response.data.token;
        this.isAuthenticated = true;

        await this.syncAuth();

        this.router.push({ name: 'painel' });
      } catch (error) {
        notify.error(error);
      }
    },
  },
  persist: true,
});
