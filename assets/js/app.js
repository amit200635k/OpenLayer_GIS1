if(sessionStorage.getItem("accessTokenAccident") && sessionStorage.getItem("accessTokenAccident")==="" || sessionStorage.length==='0'){
	sessionStorage.clear();
	location.replace("index.html");
}

$(function() {
	"use strict";

	$(".mobile-toggle-menu").on("click", function() {
		$(".wrapper").addClass("toggled")
	});

	//$(".wrapper").addClass("toggled");
	$(".sidebar-wrapper").hover(function() {
		$(".wrapper").addClass("sidebar-hovered")
	}, function() {
		$(".wrapper").removeClass("sidebar-hovered")
	});

	$(".toggle-icon").click(function() {
		$(".wrapper").hasClass("toggled") ? 
		($(".wrapper").removeClass("toggled"), 
		$(".ol-viewport").attr("style","width: 95% !important;"), 
		$("#dataTableDiv").attr("style","width: 80% !important;"),
		$(".sidebar-wrapper").unbind("hover")) 
		: ($(".wrapper").addClass("toggled"), 
		$(".ol-viewport").attr("style","width: 82% !important;"),
		$("#dataTableDiv").attr("style","width: 95% !important;"), 
		$(".sidebar-wrapper").hover(function() {
			$(".wrapper").addClass("sidebar-hovered")
		}, function() {
			$(".wrapper").removeClass("sidebar-hovered")
		}))
	});
	
	$(document).ready(function() {
		$(window).on("scroll", function() {
			$(this).scrollTop() > 300 ? $(".back-to-top").fadeIn() : $(".back-to-top").fadeOut()
		}), $(".back-to-top").on("click", function() {
			return $("html, body").animate({
				scrollTop: 0
			}, 600), !1
		})
	});

	if($(".metismenu").length){
	$(function() {
		for (var e = window.location, o = $(".metismenu li a").filter(function() {
				return this.href == e
			}).addClass("").parent().addClass("mm-active"); o.is("li");) o = o.parent("").addClass("mm-show").parent("").addClass("mm-active")
	}), 
	
	$(function() {
		$("#menu").metisMenu()
	})
 }

 var toggler = document.getElementsByClassName("box");
 var i;
 
 for (i = 0; i < toggler.length; i++) {
   toggler[i].addEventListener("click", function() {
	 this.parentElement.querySelector(".nested").classList.toggle("active");
	 this.classList.toggle("check-box");
   });
 }


 $("#dataTableDiv").attr("style","width: 80% !important;");
 $("#dataTableDiv").hide(); 

$(document).on('click',"#toggleDataDiv", function(){
	$("#dataTableDiv").toggle();
});
$(document).on('click',"#hideTableDiv", function(){
	$("#dataTableDiv").hide();
});


$.get("http://127.0.0.1:5000/getDistricts",function(data){
	console.log(data);
	let string ='<option value="">==Select District==</option>';
	data.forEach(row => {
		string+="<option value='"+row[3]+"'>"+row[0]+"</option>";
	});
	 $("#dname").html(string);
});
// $.get("http://localhost:8880/geoserver/UAVDATA/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=UAVDATA%3ADistrict_Boundary_Jharkhand&maxfeatures=50&outputformat=application%2Fjson",function(data){
// 	console.log(data);
// 	let string ='<option value="">==Select District==</option>';
// 	data.features.forEach(row => {
// 		string+="<option data-bbox='"+row.properties.bbox+"' value='"+row.geometry.coordinates+"'>"+row.properties.dtname+"</option>";
// 	});
// 	 $("#dname").html(string);
// });

$(document).on('change',"#dname", function(){
	//let dataObj={};
	//dataObj.push({'dtname':$(this).find('option:selected').text()})
	//dataObj["dtname"]=$(this).find('option:selected').text();
	$.ajax({
		url:"http://127.0.0.1:5000/getBlocks",
		type: "GET",
		data: {dtname: $(this).find('option:selected').text()},
		///JSON.stringify(dataObj),
		//{dtname: $(this).find('option:selected').text()},
		dataType: "json", 
		success: function(data) {
			console.log(data);
			let string ='<option value="">==Select Block==</option>';
			data.forEach(row => {
				string+="<option value='"+row[3]+"'>"+row[0]+"</option>";
			});
			$("#bname").html(string);
		}
});


	// $.get("http://127.0.0.1:5000/getBlocks",{"dtname":$(this).text()},function(data){
	// 	console.log(data);
	// 	let string ='<option value="">==Select District==</option>';
	// 	data.forEach(row => {
	// 		string+="<option value='"+row[3]+"'>"+row[0]+"</option>";
	// 	});
	// 	$("#getBlocks").html(string);
	// });
});
$(document).on('change',"#bname", function(){
	//let dataObj={};
	//dataObj.push({'dtname':$(this).find('option:selected').text()})
	//dataObj["dtname"]=$(this).find('option:selected').text();
	$.ajax({
		url:"http://127.0.0.1:5000/getPanchayats",
		type: "GET",
		data: {dtname: $('#dname option:selected').text(), bname: $(this).find('option:selected').text()},
		///JSON.stringify(dataObj),
		//{dtname: $(this).find('option:selected').text()},
		dataType: "json", 
		success: function(data) {
			console.log(data);
			let string ='<option value="">==Select Panchayat==</option>';
			data.forEach(row => {
				string+="<option value='"+row[3]+"'>"+row[0]+"</option>";
			});
			$("#pname").html(string);
		}
});
});
$(document).on('change',"#pname", function(){
	//let dataObj={};
	//dataObj.push({'dtname':$(this).find('option:selected').text()})
	//dataObj["dtname"]=$(this).find('option:selected').text();
	$.ajax({
		url:"http://127.0.0.1:5000/getVillages",
		type: "GET",
		data: {dtname: $('#dname option:selected').text(), bname: $('#bname option:selected').text(), pname: $(this).find('option:selected').text()},
		///JSON.stringify(dataObj),
		//{dtname: $(this).find('option:selected').text()},
		dataType: "json", 
		success: function(data) {
			console.log(data);
			let string ='<option value="">==Select Village==</option>';
			data.forEach(row => {
				string+="<option value='"+row[3]+"'>"+row[0]+"</option>";
			});
			$("#vname").html(string);
		}
});
});
});
function loadbasemap(basemapId)
{
	console.log(basemapId);
	
	$("#layertree #visible"+basemapId).click()
	$(this).attr("style","background: #00932c;");
	
}


function logout(){
	//alert("Logout");
	sessionStorage.clear();
	location.replace("index.html");
}

$(document).on("click", "#popup .accordion-button", function(){
	//$trigger.first().addClass('active').next().hide();

	let faqs = $("#popup .accordion-collapse");
	//$(".faq_title").click(function () {
	  //faqs.slideUp();
	  faqs.removeClass("show");
	  //faqs.prev().removeClass("show");
	 // faqs.next().removeClass("show");
	 // $(this).next().slideDown();
	 $(this).addClass("show");
	  return false;
	//});

})