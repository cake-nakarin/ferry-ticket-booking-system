<template>
  <div class="promo-banner">
    <div class="promo-card">
      <div>
        <div class="promo-label">{{ t('promo.label') }}</div>
        <div class="promo-text"><i class="fas fa-star"></i> {{ t('promo.title') }}</div>
      </div>
      <div class="promo-action">
        <button class="btn-outline">{{ t('promo.details') }}</button>
        <button class="btn-filled">{{ t('promo.confirm') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { t } from '../i18n'
</script>

<style scoped>
.promo-banner {
  max-width: 1400px;
  margin: 24px auto;
  padding: 0 24px;
}

.promo-card {
  background: linear-gradient(135deg, var(--primary-light) 0%, #E1F5FE 100%);
  border-left: 4px solid var(--primary);
  padding: 20px 24px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.promo-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary);
  margin-bottom: 4px;
}

.promo-label {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 4px;
}

.promo-action {
  display: flex;
  gap: 12px;
}

.btn-outline {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  background: white;
  color: var(--primary);
  border: 1px solid var(--primary);
  transition: all 200ms;
}

.btn-outline:hover {
  background: var(--primary-light);
}

.btn-filled {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  background: var(--primary);
  color: white;
  border: none;
  transition: all 200ms;
}

.btn-filled:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .promo-card {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  .promo-banner {
    padding: 0 12px;
    margin: 12px auto;
  }
}
</style>
