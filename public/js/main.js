window.onload = function(){
	/*
	 * TODO
	 * AJAX query for bar chart data, send as arg to function
	 */

//	var jqxhrBar = $.get('/distByType', function(response){
//		jqxhrBar.done(function(response){
//			data = response.data;
			//showBarChart('barChart', 0);
//		});
//		jqxhrBar.fail(function(jqXHR){
//	  		console.log("error loading chart");
//		});
//	 })

//Default Hide Individaul Analytics section
	$('#Individual').hide();

	var jqxhrPie = $.get('/distByType', function(response){
		jqxhrPie.done(function(response){
			data = response.data;
			showPieChart('pieChart', data);
		});
		jqxhrPie.fail(function(jqXHR){
	  		console.log("error loading chart");
		});
	 })

	 var jqxhrBar = $.get('/revByYearType', function(response){
		jqxhrBar.done(function(response){
			data = response.data;
			showBarChart('barChart', data);
		});
		jqxhrBar.fail(function(jqXHR){
	  		console.log("error loading chart");
		});
	 })

}

// Create the bar chart
function showBarChart(element, data) {
	/*
	 * TODO
	 * Pull data from database
	 * Remove hardcoded data
	 * Use jquery selectors
	 */

	let barChart = document.getElementById('barChart').getContext('2d');
	let overallYearlyRevision = new Chart(barChart, {
		 type: 'bar',
		    data: {
		        labels:["2001", "2002", "2003", "2004", "2005", "2006"],
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

//ajax request to load individual analytics section
$(document).ready(function(){
	$('#IndividualLink').on('click', function(e){
		$('#Individual').show();
		$('#Overall').hide();
		e.preventDefault();
		});
});

//ajax request to load overall analytics section
$(document).ready(function(){
	$('#OverallLink').on('click', function(e){
		$('#Individual').hide();
		$('#Overall').show();
		e.preventDefault();
		});
});

//ajax request to load individual article summary
$(document).ready(function(){
	$('#individualquery').on('click', function(e){
    var data=$('#dropdown').val();
		var arr = data.split(" |");
		var titlename = encodeURI(arr[0]);
		$('#articlesummary').load('/userdashboard?title='+titlename +' #articlesummary')

		$.get('/updateRevisions?title='+titlename,null,function(result) {
				var revnum = result;
				alert("MediaWiki Updated!"+"\n"+"There are " +revnum+" new revisions for artilce "+arr[0]);
		}
		);
		});
});
