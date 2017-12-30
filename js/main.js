$(document).ready(() => {

	$('#searchForm').submit((e) => {
		var text = $('#searchform').val();
		//console.log(text);
		if(text == '' && ($('div#results').text()) != ''){
			$('#results').empty();
			// $('#error').css('display', 'show');

			$('#error').html('Error: Please enter a value into the field above to search');
			return false;
		}

		if(text == ''){
			$('#error').html('Error: Please enter a value into the field above to search');
			return false;
		}



		if(($('#error').html()) != ''){
			$('#error').empty();
		}
		// if(($('#error').html()) != ''){
		// 	$('#error').addClass('hidden');
		// }

		fetchWiki(text);
		e.preventDefault();
	});

});

function fetchWiki(text) {


	var api = "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=extracts&exintro&explaintext&exsentences=2&exlimit=max&format=json&gsrsearch=" + text;

	$.ajax({
		type: 'GET',
		url: api,
		dataType: 'jsonp',
		contentType: "application/json; charset=utf-8",
    async: false,
		success: (data, textStatus, jqXHR) => {
    	$('div#preloader').addClass('hidden');

			console.log(data);
			// console.log(data.query.pages);
			var pages = data.query.pages;

			var output = "";

			$.each(pages, (pageId, page) => {
				// console.log(page.title);
				output += `
					<div class="well">
						<h4>${page.title}</h4>
						<hr>
						<div id="extract">${page.extract}</div>
						<button class="btn btn-primary" onclick="openWikiPage('${page.title}')" id="viewButton" href="#" target="_blank">View Full Article</button>
					</div>

				`;
			});

			$('#results').html(output);
			
			$('#searchForm').find('input:text').val('');
			// formReset();
			


		}
	});


}

// function formReset(){
// 	$('#searchForm').reset();
// }

function openPage(title){
	sessionStorage.setItem('pageTitle', title);
	window.open('view.html');
	return false;
}

function showPage(){
	var pagetitle = sessionStorage.getItem('pageTitle');

	var api = "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&page="+pagetitle+"&callback=?"


		$.ajax({
		type: 'GET',
		url: api,
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
    async: false,
		success: (data, textStatus, jqXHR) => {
			// console.log(data.parse.text['*']);
			
			var output = "";

			var text = data.parse.text['*'];

			// var htmlText = $('<div></div>').html(text);
			var htmlText = $('<div>'+text+'</div>');

			// htmlText.find('a').each(() => {
			// 	$(this).replaceWith($(this).html());
			// });
			// htmlText.find('a').replaceWith();
			htmlText.find('a').each(function() { $(this).replaceWith($(this).html()); });

			htmlText.find('sup').remove();

			htmlText.find('.mw-ext-cite-error').remove();

			output = `
					<h3>${pagetitle}</h3>
					<hr>
					<div id="pageinfo">${htmlText}</div>
			`;

			console.log(htmlText);

			$('#pageview').html(htmlText);

		}
	});
}

function openWikiPage(title){
	window.open("https://en.wikipedia.org/wiki/"+title);
	return false;
}
