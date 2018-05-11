window.onLoad() = function(){
	//showBarChart();	
}

function showBarChart() {
	let myChart = document.getElementById('myChart').getContext('2d');
	let overallYearlyRevision = new Chart(myChart, {
		 type: 'bar',
		    data: {
		        labels: <%- JSON.stringify(labels) %>,
		        datasets: [{
		            label: <%- JSON.stringify(datasets[0].label) %>,
		            data: [<%= datasets[0].data %>],
		            backgroundColor: 'rgba(54, 162, 235, 0.2)',
		            borderColor: 'rgba(54, 162, 235, 1)',
		            borderWidth: 1
		        },
		        {
		            label: <%- JSON.stringify(datasets[1].label) %>,
		            data: [<%= datasets[1].data %>],
		            backgroundColor: 'rgba(255, 99, 132, 0.2)',
		            borderColor: 'rgba(255,99,132,1)',
		            borderWidth: 1
		        },
		        {
		            label: <%- JSON.stringify(datasets[2].label) %>,
		            data: [<%= datasets[2].data %>],
		            backgroundColor: 'rgba(255, 206, 86, 0.2)',
		            borderColor: 'rgba(255, 206, 86, 1)',
		            borderWidth: 1
		        },
		        {
		            label: <%- JSON.stringify(datasets[3].label) %>,
		            data: [<%= datasets[3].data %>],
		            backgroundColor: 'rgba(255, 159, 64, 0.2)',
		            borderColor: 'rgba(255, 159, 64, 1)',
			            borderWidth: 1
			        }]
			    },
			    options: {
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                }
			            }]
			        }
			    }
	});
}