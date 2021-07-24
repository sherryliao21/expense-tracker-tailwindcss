// select chart
const chart = document.querySelector('#myChart').getContext('2d')

// count categoryAmount value
const categoryAmount = document
	.querySelector('.category-amount')
	.innerText.split(',')
const categoryAmountValue = []
categoryAmount.map(item => {
	categoryAmountValue.push(Number(item))
})
const labels = ['餐飲食品', '家居物業', '交通出行', '休閒娛樂', '其他']

// // chart image
// const image = new Image()
// image.src = "/public/naruto_wallet_2.jpg"
// const plugin = {
// 	id: "custom_canvas_background_image",
// 	beforeDraw: chart => {
// 		if (image.complete) {
// 			const ctx = chart.ctx
// 			const { top, left, width, height } = chart.chartArea
// 			const x = left + width / 2 - image.width / 2
// 			const y = top + height / 2 - image.height / 2
// 			ctx.drawImage(image, x, y)
// 		} else {
// 			image.onload = () => chart.draw()
// 		}
// 	},
// }

// define chart
const myChart = new Chart(chart, {
	type: 'doughnut',
	data: {
		labels: labels,
		datasets: [
			{
				data: categoryAmountValue,
				backgroundColor: [
					'#00638B',
					'#DCC390',
					'#C7D6DA',
					'#F8F7FB',
					'#E5F2E0'
				],
				borderColor: ['#00638B', '#DCC390', '#C7D6DA', '#F8F7FB', '#E5F2E0'],
				borderWidth: 0.5,
				hoverOffset: 4
			}
		]
	},
	options: {
		maintainAspectRatio: true
	}
	// plugin: [plugin],
})
