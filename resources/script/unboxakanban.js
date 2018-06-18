var urlParams = new URLSearchParams(window.location.search),
	qelm = urlParams.get('l'),
	qmsg = urlParams.get('m');
//?post=1234&action=edit
//console.log(urlParams.has('post')); // true
//console.log(urlParams.get('action')); // "edit"
//console.log(urlParams.getAll('action')); // ["edit"]
//console.log(urlParams.toString()); // "?post=1234&action=edit"
//console.log(urlParams.append('active', '1')); // "?post=1234&action=edit&active=1"

$(function(){
	$('#btnSubmit').on('click',function(event){
		$(this).find('.fa-loading').show();
		return true;
	});
	if (qmsg === 'failed') {
		$('#'+qelm+' .form-result.failure, #'+qelm+' form').show();
		$('#'+qelm+' #btnSubmit .fa-loading').hide();
	}	
});