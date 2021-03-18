function confirmDelete() {
  if (confirm('確定要刪除這間餐廳？')) return true
  return false
}

const resetBtn = document.querySelector('.reset-btn')
const monthForm = document.querySelector('.form-select-month')
const categoryForm = document.querySelector('.form-category')
resetBtn.addEventListener('click', (e) => {
  if (e.target === resetBtn) {
    categoryForm.value = 'all'
    monthForm.value = 'all'
  }
})
