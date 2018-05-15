window.onload = function(){

var jqxhr = $.get('/distByType', function(response){
	jqxhr.done(function(response){
		data = response.data;
		showPieChart('barChart', data);
	});
	jqxhr.fail(function(jqXHR){
  		console.log("error loading chart");
	});
 })

//showBarChart();
}

// Create the bar chart
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


// Create the pie chart
function showPieChart(element, data) {

	let pieChart = document.getElementById(element).getContext('2d');
	let overallYearlyRevision = new Chart(pieChart, {
		 type: 'pie',
		    data: {
		    	datasets: [{
		            data: [data[0].revisions, data[1].revisions, data[2].revisions, data[3].revisions],
		            backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(83, 222, 83, 0.2)'],
		            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)', 'rgba(83, 222, 83, 1)'],
		    	}],
		        labels: [data[0].user, data[1].user, data[2].user, data[3].user],
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

//ajax request to reload list of revisions
$(document).ready(function(){
	$('#button').on('click', function(e){
    var data=$('#number').val();
		$('#results').load('/userdashboard?number='+data +' #results')
		});
});
