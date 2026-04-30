<template>
  <div class="top-header">
    <div class="top-header-content">
      <div class="header-left">
        <a href="#"><i class="fas fa-home"></i> {{ t('top.home') }}</a>
        <a href="#"><i class="fas fa-question-circle"></i> {{ t('top.help') }}</a>
      </div>
      <div class="header-right">
        <div class="language-selector">
          <button :class="['language-btn', { active: i18nState.lang === 'th' }]" @click="setLang('th')">ไทย</button>
          <span>/</span>
          <button :class="['language-btn', { active: i18nState.lang === 'en' }]" @click="setLang('en')">EN</button>
        </div>
        <a href="#"><i class="fas fa-sign-in-alt"></i> {{ t('top.login') }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { i18nState, setLang, t } from '../i18n'
</script>

<style scoped>
.top-header {
  background: #FFFFFF;
  border-bottom: 0.5px solid rgb(227, 228, 232);
  padding: 12px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.top-header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.header-left {
  display: flex;
  gap: 24px;
}

.header-left a,
.header-right a {
  color: var(--text-light);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 200ms cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 400;
}

.header-left a:hover,
.header-right a:hover {
  color: var(--primary);
}

.header-right {
  display: flex;
  gap: 16px;
  align-items: center;
}

.language-selector {
  display: flex;
  gap: 6px;
  align-items: center;
}

.language-btn {
  padding: 4px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;
  font-weight: 500;
  color: var(--text-light);
}

.language-btn.active {
  color: var(--primary);
  background: var(--primary-light);
}
</style>
