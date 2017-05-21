function usefullClass() {}

usefullClass.prototype = {
	_alerts:1,
	_notes:1,
	_currentPageNum:1,
	_totalAlertNum:1,
	_pageCollectionNum:7,
	_pageNum:1,
	_alertIds:[],
	_alertTinyIds:[],
	_alertCreatedTimes:[],
	_alertCreatedDates:[],
	_colors:[],
	_borderColors:[],
	getReadyJSONs:function(url1,url2){
			var	collection,
				count = 0,
				_alerts = this._alerts,
				_notes = this._notes,
				_pageCollectionNum = this._pageCollectionNum,
				_createPagination = this.createPagination,
				_drawChart = this.drawChart,
				_listAlerts = this.listAlerts,
				_setJSONs = this.setJSONs;


			$.getJSON(url1, function( data1 ) {
				_notes = data1
				$.getJSON(url2, function( data2 ) {
					_alerts = data2;
					_setJSONs(_alerts,_notes);
					_listAlerts(_pageCollectionNum,0,_pageCollectionNum);			
					_createPagination(Math.round(_alerts["alerts"].length/_pageCollectionNum));
					_drawChart();
				});
			});

		},
	viewAlert:function(url1,url2){
		var _notes,
			_alerts,
			count = 0,
			_pageCollectionNum = this._pageCollectionNum,
			collection,
			_notes = [],
			data,
			getSearchId = window.location.search.split("?")[1].split("=")[1];
			

		$.getJSON(url1, function( data1 ) {
			_notes = data1
			$.getJSON(url2, function( data2 ) {
				_alerts = data2;
				//_setJSONs(_alerts,_notes);
				

				collection = document.createElement("ul");
				collection.className = "collection with-header";
				for (var i= 0;i<_alerts["alerts"].length;i++){
					if (_alerts["alerts"][i].id == getSearchId){
						data = _alerts["alerts"][i];
						break;
					}
				}

				for (var j = 0;j<_notes["notes"].length;j++){
					if (_notes["notes"][j].alertId == data.id){
						count++;
						document.getElementById("notes").innerHTML += "<div class=\"column\"><div class=\"col s12 m5\"><h6>Note "+(count)+"</h6><div class=\"card-panel teal\"><span class=\"white-text\">"+_notes["notes"][j].note+"</span></div></div></div>";
					}
				}

				if (count == 0) {
					$("#tab2 a").html("Notes(0)").parent().attr("class","tab col s3 disabled");
				}else if (count > 0){
					$("#tab2 a").html("Notes("+count+")").parent().attr("class","tab col s3");
				}

				collection.innerHTML += "<li class=\"collection-header\"><span id=\"headerspan1\">Id: "+data.id+"</span><br><span id=\"headerspan2\">TinyId: "+data.tinyId+"</span><br><span id=\"headerspan3\">IsSeen: "+data.isSeen+"</span></li>";
				$.each( data, function( key, val ) {
				     collection.innerHTML += "<li class=\"collection-item\"><span class=\"boldText\">"+key+"</span>: "+val.toString()+"</li>";
				});
				

				$("#viewContainer").prepend(collection);
				$("#viewContainer,#notes").append("<a id=\"backbutton\" href=\"../../index.html\" class=\"waves-effect waves-light btn\">BACK</a>")
				

			});
		});

	},
	setJSONs:function(_alerts,_notes){
		this.usefullClass.prototype._alerts = _alerts;
		this.usefullClass.prototype._notes = _notes;
		this.usefullClass.prototype._alertIds = [];
		this.usefullClass.prototype._colors = [];
		this.usefullClass.prototype._borderColors = [];
		var date = new Date();
		for (var i = 0;i<_alerts["alerts"].length;i++){
			this.usefullClass.prototype._alertIds.push(_alerts["alerts"][i].id);
			//if (this.usefullClass.prototype._alertCreatedTimes.indexOf(new Date(_alerts["alerts"][i].createdAtTimestamp).getDate())==-1)
			//this.usefullClass.prototype._alertCreatedTimes.push((_alerts["alerts"][i].createdAtTimestamp));

			this.usefullClass.prototype._alertTinyIds.push(_alerts["alerts"][i].tinyId);
			this.usefullClass.prototype._alertCreatedDates.push(_alerts["alerts"][i].createdAt);
			this.usefullClass.prototype._colors.push([
			                'rgba(255, 99, 132, 0.2)',
			                'rgba(54, 162, 235, 0.2)',
			                'rgba(255, 206, 86, 0.2)',
			                'rgba(75, 192, 192, 0.2)',
			                'rgba(153, 102, 255, 0.2)',
			                'rgba(255, 159, 64, 0.2)',
			                'rgba(255, 99, 132, 0.2)'
			            ][Math.round(Math.random()*6)+1]);
			this.usefullClass.prototype._borderColors.push([
			                'rgba(255,99,132,1)',
			                'rgba(54, 162, 235, 1)',
			                'rgba(255, 206, 86, 1)',
			                'rgba(75, 192, 192, 1)',
			                'rgba(153, 102, 255, 1)',
			                'rgba(255, 159, 64, 1)',
			                'rgba(153, 102, 255, 1)'
			            ][Math.round(Math.random()*6)+1]);
		}
	},
	getAlert:function(){
		return this.usefullClass.prototype._alerts;
	},
	listAlerts:function(_pageCollectionNum,from,to){
		var	collection,
			count = 0,
			_alerts = this.usefullClass.prototype._alerts,
			_notes = this.usefullClass.prototype._notes;
			
		collection = document.createElement("div");
		collection.className = "collection";
		for (var i = from;i<to;i++){
			
			count = 0;
			for (var j = 0;j<_notes["notes"].length;j++){
				if (_notes["notes"][j].alertId == _alerts["alerts"][i].id){
					count++;
				}
			}

			if (count == 0)
				collection.innerHTML += "<a href=\"com/html/alertView.html?id="+_alerts["alerts"][i].id+"\" class=\"collection-item\">Alert id: "+_alerts["alerts"][i].id+"</a>"
			else if (count == 1)
				collection.innerHTML += "<a href=\"com/html/alertView.html?id="+_alerts["alerts"][i].id+"\" class=\"collection-item\">Alert id: "+_alerts["alerts"][i].id+"<span class=\"new badge\" data-badge-caption=\"note\">1</span></a>"
			else if (count > 1)
				collection.innerHTML += "<a href=\"com/html/alertView.html?id="+_alerts["alerts"][i].id+"\" class=\"collection-item\">Alert id: "+_alerts["alerts"][i].id+"<span class=\"new badge\" data-badge-caption=\"notes\">"+count+"</span></a>"
			
		}
		$("#tap1").prepend(collection);
	},
	drawChart:function(){
		var _alertIds = this.usefullClass.prototype._alertIds;
		var _alertCreatedTimes = this.usefullClass.prototype._alertCreatedTimes;
		var _alertTinyIds = this.usefullClass.prototype._alertTinyIds;
		var _alertCreatedDates = this.usefullClass.prototype._alertCreatedDates;
		var _colors = this.usefullClass.prototype._colors;
		var _borderColors = this.usefullClass.prototype._borderColors;

		var ctx = document.getElementById("chart");
		var myChart = new Chart(ctx, {
		    type: 'horizontalBar',
		    data: {		    	
		    	labels: _alertTinyIds,
			    datasets: [
			        {
			        	
			            label: "Tiny Id, Created At Timestamp(Day, Oct 2016)",
			            backgroundColor: _colors,
			            borderColor: "#bbbbbb",
			            hoverBackgroundColor: "#bbbbbb",
			            borderWidth: 1,
			            data: _alertCreatedTimes
			        }
			    ]},
			options:{
				scales: {

					xAxes: [{
						id:"dsfds",
						display:true,
		            	stacked:true,		            	
		                ticks: {
		                    max: 31,
		                    min: 1,
		                    stepSize: 2		                
			            }
		            }],
		            yAxes: [{
		            	stacked:true
		            }]
		        }
			}
		});
	},
	createPagination:function(num){
		var pagination = document.createElement("ul"),
			_pageCollectionNum = this.usefullClass.prototype._pageCollectionNum,
			_listAlerts = this.usefullClass.prototype.listAlerts,
			_this = this;


		this.usefullClass.prototype._pageNum = num;

		pagination.className = "pagination";
		pagination.id = "pagination";
		pagination.pageNum = this.usefullClass.prototype._pageNum;
		pagination.currentPageNum = 1;
		pagination.totalAlertNum = this.usefullClass.prototype._alerts["alerts"].length;
		document.getElementById("tap1").appendChild(pagination);

		pagination.innerHTML += "<li id =\"left_arrow\" class=\"disabled\"><a href=\"#!\"><i class=\"material-icons\">chevron_left</i></a></li>"
		for (var i = 0;i<num;i++){
			if (i == 0)
				pagination.innerHTML += "<li id = page_"+(i+1)+" class=\"pagenum active\"><a href=\"#!\">1</a></li>";
			else
				pagination.innerHTML += "<li id = page_"+(i+1)+" class=\"pagenum waves-effect\"><a href=\"#!\">"+(i+1)+"</a></li>";
		}
		pagination.innerHTML += "<li id =\"right_arrow\" class=\"waves-effect\"><a href=\"#!\"><i class=\"material-icons\">chevron_right</i></a></li>"
		
		$(".pagination .pagenum").off("mousedown");
		$(".pagination .pagenum").on("mousedown",function(e){
			var takeNum = parseInt(e.currentTarget.id.split("_")[1]),
				totalPagenum = document.getElementById("pagination").pageNum;
	
			for (var i = 0;i<document.getElementById("pagination").pageNum;i++){
				$("#page_"+(i+1)).removeAttr("class");
				$("#page_"+(i+1)).attr("class","pagenum waves-effect");
			}
			$(e.currentTarget).attr("class","active");

			if (document.getElementById("pagination").currentPageNum != takeNum){
				$(".collection").remove();
				if (takeNum != totalPagenum){
					_listAlerts(_pageCollectionNum,(takeNum-1)*7,takeNum*7);
				}else {
					_listAlerts(_pageCollectionNum,(takeNum-1)*7,(takeNum-1)*7+(document.getElementById("pagination").totalAlertNum%_pageCollectionNum));
				}
			}

			document.getElementById("pagination").currentPageNum = takeNum;

			if (takeNum==1) {
				$(".pagination #left_arrow").attr("class","disabled");
				$(".pagination #right_arrow").attr("class","waves-effect");
			}else if (takeNum==document.getElementById("pagination").pageNum) {
				$(".pagination #left_arrow").attr("class","waves-effect");
				$(".pagination #right_arrow").attr("class","disabled");
			}else {
				$(".pagination #left_arrow").attr("class","waves-effect");
				$(".pagination #right_arrow").attr("class","waves-effect");
			}

		});

		$(".pagination #left_arrow,.pagination #right_arrow").off("mousedown");
		$(".pagination #left_arrow,.pagination #right_arrow").on("mousedown",function(e){
			var takeCurrentPageNum = document.getElementById("pagination").currentPageNum,
				totalPagenum = document.getElementById("pagination").pageNum;

			if (e.currentTarget.id == "left_arrow") {
				if (takeCurrentPageNum > 1){
					takeCurrentPageNum--;
					
					if (document.getElementById("pagination").currentPageNum != takeCurrentPageNum){
						$(".collection").remove();						
						_listAlerts(_pageCollectionNum,(takeCurrentPageNum-1)*7,takeCurrentPageNum*7);
					}

					document.getElementById("pagination").currentPageNum = takeCurrentPageNum;
					for (var i = 0;i<document.getElementById("pagination").pageNum;i++){
						$("#page_"+(i+1)).removeAttr("class");
						$("#page_"+(i+1)).attr("class","pagenum waves-effect");
					}
					$("#page_"+takeCurrentPageNum).attr("class","active");
				}
			}else if (e.currentTarget.id == "right_arrow") {
				if (takeCurrentPageNum < totalPagenum){
					takeCurrentPageNum++;

					if (document.getElementById("pagination").currentPageNum != takeCurrentPageNum){
						$(".collection").remove();

						if (takeCurrentPageNum != totalPagenum){
							_listAlerts(_pageCollectionNum,(takeCurrentPageNum-1)*7,takeCurrentPageNum*7);
						}else {
							_listAlerts(_pageCollectionNum,(takeCurrentPageNum-1)*7,(takeCurrentPageNum-1)*7+(document.getElementById("pagination").totalAlertNum%_pageCollectionNum));
						}
					}

					document.getElementById("pagination").currentPageNum = takeCurrentPageNum;
					for (var i = 0;i<document.getElementById("pagination").pageNum;i++){
						$("#page_"+(i+1)).removeAttr("class");
						$("#page_"+(i+1)).attr("class","pagenum waves-effect");
					}
					$("#page_"+takeCurrentPageNum).attr("class","active");
				}				
			}



			if (takeCurrentPageNum==1) {
				$(".pagination #left_arrow").attr("class","disabled");
				$(".pagination #right_arrow").attr("class","waves-effect");
			}else if (takeCurrentPageNum==totalPagenum) {
				$(".pagination #left_arrow").attr("class","waves-effect");
				$(".pagination #right_arrow").attr("class","disabled");
			}else{
				$(".pagination #left_arrow").attr("class","waves-effect");
				$(".pagination #right_arrow").attr("class","waves-effect");				
			}

		});
	}
}

window.usefullClass = usefullClass;