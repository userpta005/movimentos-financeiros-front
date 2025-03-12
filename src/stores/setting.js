import { defineStore } from 'pinia';
import { Dark, setCssVar } from 'quasar';

export const useSettingStore = defineStore('setting', {
  state: () => ({
    darkModeisActive: false,
    miniModeIsActive: false,
  }),
  actions: {
    boot() {
      this.bootDarkMode();
    },
    bootDarkMode() {
      Dark.set(this.darkModeisActive);
      setCssVar('primary', !this.darkModeisActive ? '#233253' : '#c59530');
      setCssVar('secondary', !this.darkModeisActive ? '#c59530' : '#233253');
    },
    toggleDarkMode() {
      this.darkModeisActive = !this.darkModeisActive;
      Dark.set(this.darkModeisActive);
      setCssVar('primary', !this.darkModeisActive ? '#233253' : '#c59530');
      setCssVar('secondary', !this.darkModeisActive ? '#c59530' : '#233253');
    },
  },
  persist: true,
});
