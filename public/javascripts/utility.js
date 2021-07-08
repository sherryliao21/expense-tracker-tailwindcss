function checkForm() {
  const inputs = document.querySelectorAll('.form-control')
  const checkboxes = document.querySelectorAll('.form-check-input')
  const selection = document.querySelector('.form-select')
  let checkInputs
  inputs.forEach((input) => {
    if (!input.value || input.value === '0') {
      return (checkInputs = false)
    }
  })
  checkboxes.forEach((checkbox) => {
    if (!checkbox.value) {
      return false
    }
  })
  if (checkInputs === false || selection.value === '請選擇' || !checkboxes) {
    if (confirm('請完整填寫表格')) return false
    return false
  }
}

function confirmBack() {
  if (confirm('尚未編輯完成，直接返回？')) return true
  return false
}
