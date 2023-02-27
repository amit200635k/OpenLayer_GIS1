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
 $("#dataTableDiv").attr("style","width: 80% !important;");
 $("#dataTableDiv").hide(); 

$(document).on('click',"#toggleDataDiv", function(){
	$("#dataTableDiv").toggle();
});
$(document).on('click',"#hideTableDiv", function(){
	$("#dataTableDiv").hide();
});


});
function loadbasemap(basemapId)
{
	console.log(basemapId);
	
	$("#layertree #visible"+basemapId).click()
	$(this).attr("style","background: #00932c;");
	
}