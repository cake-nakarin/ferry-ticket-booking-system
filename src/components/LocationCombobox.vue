<template>
  <div class="combobox" ref="comboboxRef">
    <input
      ref="inputRef"
      type="text"
      :value="inputText"
      :placeholder="placeholder"
      autocomplete="off"
      @input="onInput"
      @focus="onFocus"
      @keydown="onKeydown"
    />
    <button
      v-if="inputText"
      type="button"
      class="clear-btn"
      tabindex="-1"
      @click="clear"
    >
      <i class="fas fa-times"></i>
    </button>

    <ul v-if="isOpen && filteredOptions.length" class="combobox-dropdown" role="listbox">
      <li
        v-for="(option, index) in filteredOptions"
        :key="option.value"
        role="option"
        :class="{ highlighted: index === highlightedIndex }"
        @mousedown.prevent="select(option)"
        @mousemove="highlightedIndex = index"
      >
        <i class="fas fa-anchor"></i> {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, required: true }, // [{ label, value }]
  placeholder: { type: String, default: 'Select or type...' },
})

const emit = defineEmits(['update:modelValue'])

const comboboxRef = ref(null)
const inputRef = ref(null)
const isOpen = ref(false)
const highlightedIndex = ref(-1)

// inputText mirrors user's typing; shows the matching label when a value is selected
const inputText = ref(
  props.options.find((o) => o.value === props.modelValue)?.label ?? props.modelValue
)

const filteredOptions = computed(() => {
  const q = inputText.value.toLowerCase()
  if (!q) return props.options
  return props.options.filter(
    (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
  )
})

const onInput = (e) => {
  inputText.value = e.target.value
  isOpen.value = true
  highlightedIndex.value = -1
  // Emit the raw typed text so search still works even without selecting a suggestion
  emit('update:modelValue', e.target.value)
}

const onFocus = () => {
  isOpen.value = true
}

const select = (option) => {
  inputText.value = option.label
  emit('update:modelValue', option.value)
  isOpen.value = false
  highlightedIndex.value = -1
}

const clear = () => {
  inputText.value = ''
  emit('update:modelValue', '')
  isOpen.value = false
  inputRef.value?.focus()
}

const onKeydown = (e) => {
  if (!isOpen.value) {
    if (e.key === 'ArrowDown' || e.key === 'Enter') isOpen.value = true
    return
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredOptions.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (highlightedIndex.value >= 0) {
      select(filteredOptions.value[highlightedIndex.value])
    } else {
      isOpen.value = false
    }
  } else if (e.key === 'Escape') {
    isOpen.value = false
  }
}

const handleClickOutside = (event) => {
  if (comboboxRef.value && !comboboxRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<style scoped>
.combobox {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.combobox input {
  width: 100%;
  padding: 10px 32px 10px 12px;
  border: 0.5px solid rgb(227, 228, 232);
  border-radius: 4px;
  font-size: 13px;
  background: white;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.combobox input::placeholder {
  color: var(--text-lighter);
}

.combobox input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.clear-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-lighter);
  font-size: 13px;
  padding: 0 4px;
  transition: color 200ms;
  z-index: 5;
}

.clear-btn:hover {
  color: var(--primary);
}

.combobox-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  list-style: none;
  margin: 0;
  padding: 4px 0;
  z-index: 200;
  max-height: 220px;
  overflow-y: auto;
}

.combobox-dropdown li {
  padding: 10px 14px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
}

.combobox-dropdown li i {
  color: var(--primary);
  font-size: 12px;
  width: 14px;
  text-align: center;
}

.combobox-dropdown li:hover,
.combobox-dropdown li.highlighted {
  background: rgba(25, 118, 210, 0.06);
  color: var(--primary);
}
</style>
