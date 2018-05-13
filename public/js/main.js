window.onload = function(){
	//showBarChart();
	showPieChart();
}

function showBarChart() {
	/*
	 * TODO
	 * Pull data from database
	 * Remove hardcoded data
	 * Use jquery selectors
	 */
	var labels = ["2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008"];
	var datasets=[{
		label: 'Administrator',
		data: [12, 19, 3, 5, 2, 3]
	},
	{
		label: 'Anonymous',
        data: [4, 9, 3, 4, 4, 23]
	},
	{
        label: 'Bot',
        data: [1, 1, 7, 4, 9, 21]
	},
	{
        label: 'Regular User',
        data: [9, 2, 2, 9, 6, 16]
	}];
	
	
	let barChart = document.getElementById('barChart').getContext('2d');
	let overallYearlyRevision = new Chart(barChart, {
		 type: 'bar',
		    data: {
		        labels:["2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008"],
		        datasets: [{
		            label: datasets[0].label,
		            data: datasets[0].data,
		            backgroundColor: 'rgba(54, 162, 235, 0.2)',
		            borderColor: 'rgba(54, 162, 235, 1)',
		            borderWidth: 1
		        },
		        {
		            label: datasets[1].label,
		            data: datasets[1].data,
		            backgroundColor: 'rgba(255, 99, 132, 0.2)',
		            borderColor: 'rgba(255,99,132,1)',
		            borderWidth: 1
		        },
		        {
		            label: datasets[2].label,
		            data: datasets[2].data,
		            backgroundColor: 'rgba(255, 206, 86, 0.2)',
		            borderColor: 'rgba(255, 206, 86, 1)',
		            borderWidth: 1
		        },
		        {
		            label: datasets[3].label,
		            data: datasets[3].data,
		            backgroundColor: 'rgba(83, 222, 83, 0.2)',
		            borderColor: 'rgba(83, 222, 83, 1)',
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

function showPieChart() {
	/*
	 * TODO
	 * Pull data from database
	 * Remove hardcoded data
	 * Use jquery selectors
	 */
	var labels = ["Administrator", "Anonymous", "Bot", "Regular User"];
	var data = [13, 8, 12, 57];
	
	
	let pieChart = document.getElementById('barChart').getContext('2d');
	let overallYearlyRevision = new Chart(pieChart, {
		 type: 'pie',
		    data: {
		    	datasets: [{
		            data: data,
		            backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(83, 222, 83, 0.2)'],
		            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)', 'rgba(83, 222, 83, 1)'],
		    	}],
		        labels: labels,
			    options: {
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                }
			            }]
			        }
			    }
		    }
	});
}