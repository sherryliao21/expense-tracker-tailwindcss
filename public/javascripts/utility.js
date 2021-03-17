function displayTotal() {
  const totalAmount = document.querySelector('#total-amount-display')
  const individualAmount = document.querySelectorAll('.individual-amount')
  individualAmount.forEach(item => {
    let total = Number(totalAmount.innerText)
    total += Number(item.innerText)
    return totalAmount.innerText = total
  })
}
function checkForm() {
  const inputs = document.querySelectorAll('.form-control')
  const selection = document.querySelector('.form-select')
  let checkInputs = ''
  inputs.forEach(input => {
    if (!input.value || input.value === '0') {
      return checkInputs = false
    }
  })
  if (checkInputs === false || selection.value === '請選擇') {
    alert('請完整填寫表格')
  }
}

const submitNew = document.querySelector('.submit-new-btn')
const container = document.querySelector('.container-new')

displayTotal()
container.addEventListener('click', function onButtonClicked(event) {
  if (event.target.matches('.submit-new-btn')) {
    checkForm()
  }
})