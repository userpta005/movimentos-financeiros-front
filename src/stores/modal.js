import { defineStore } from 'pinia';
import { Screen } from 'quasar';

export const useModalStore = defineStore('modal', {
  getters: {
    sizes() {
      return {
        xs: { minWidth: Screen.xs ? '320px' : '400px' },
        sm: { minWidth: Screen.xs ? '320px' : Screen.sm ? '500px' : '700px' },
        md: { minWidth: Screen.xs ? '320px' : Screen.sm ? '580px' : '900px' },
        lg: { minWidth: Screen.xs ? '320px' : Screen.sm ? '580px' : Screen.md ? '1000px' : '1200px' },
        xl: { minWidth: Screen.xs ? '320px' : Screen.sm ? '580px' : Screen.md ? '1000px' : '1400px' },
      };
    },
  },
  persist: false,
});
