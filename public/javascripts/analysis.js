// select chart
const chart = document.querySelector("#myChart").getContext("2d")

// count categoryAmount value
const categoryAmount = document
	.querySelector(".category-amount")
	.innerText.split(",")
const categoryAmountValue = []
categoryAmount.map(item => {
	categoryAmountValue.push(Number(item))
})
const labels = ["餐飲食品", "家居物業", "交通出行", "休閒娛樂", "其他"]

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
	type: "doughnut",
	data: {
		labels: labels,
		datasets: [
			{
				data: categoryAmountValue,
				backgroundColor: [
					"rgba(255, 99, 132, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(255, 206, 86, 0.2)",
					"rgba(75, 192, 192, 0.2)",
					"rgba(153, 102, 255, 0.2)",
					"rgba(255, 159, 64, 0.2)",
				],
				borderColor: [
					"rgba(255, 99, 132, 0.8)",
					"rgba(54, 162, 235, 0.8)",
					"rgba(255, 206, 86, 0.8)",
					"rgba(75, 192, 192, 0.8)",
					"rgba(153, 102, 255, 0.8)",
					"rgba(255, 159, 64, 0.8)",
				],
				borderWidth: 0.5,
				hoverOffset: 4,
			},
		],
	},
	options: {
		maintainAspectRatio: true,
	},
	// plugin: [plugin],
})
