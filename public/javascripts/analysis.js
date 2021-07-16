const categoryAmount = document
	.querySelector(".categoryAmount")
	.innerText.split(",")
const categoryAmountValue = []
categoryAmount.map(item => {
	categoryAmountValue.push(Number(item))
})
const chart = document.getElementById("myChart").getContext("2d")
const myChart = new Chart(chart, {
	type: "doughnut",
	data: {
		labels: ["餐飲食品", "家居物業", "交通出行", "休閒娛樂", "其他"],
		datasets: [
			{
				label: "# of Votes",
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
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
				],
				borderWidth: 1,
			},
		],
	},
	options: {
		yAxes: [
			{
				ticks: {
					beginAtZero: true,
				},
			},
		],
	},
})
