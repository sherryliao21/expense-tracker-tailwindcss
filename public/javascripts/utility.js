function checkForm() {
  const inputs = document.querySelectorAll('.form-control')
  const selection = document.querySelector('.form-select')
  let checkInputs = ''
  inputs.forEach((input) => {
    if (!input.value || input.value === '0') {
      return (checkInputs = false)
    }
  })
  if (checkInputs === false || selection.value === '請選擇') {
    if (confirm('請完整填寫表格')) return false
    return false
  }
}

const submitNew = document.querySelector('.submit-new-btn')
const container = document.querySelector('.container-new')
