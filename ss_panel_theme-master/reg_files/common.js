// 发送验证码
var tt = 60,
	intcode;

function fsCode(obj, typeid, pageid, msgid, name) {
	if (name && $('input[name="' + name + '"]')) {
		var o = $('input[name="' + name + '"]');
		if ((o.attr('oreg') != '' && !eval(o.attr('oreg')).test(o.val())) || o.val() == '') {
			sErrorMsg(o);
			return false;
		}
	}
	obj = $(obj);
	if (!obj.hasClass('cur')) {
		var url = '',
			data = '';
		msgid = msgid ? msgid : 0;
		if (name && $('input[name="' + name + '"]')) {
			url = '/index.php/uCenter/verifysendCode/' + typeid + '/' + pageid + '/' + msgid;
			data = name + '=' + $('input[name="' + name + '"]').val();
		} else {
			url = '/index.php/uCenter/newsendCode/' + typeid + '/' + pageid + '/' + msgid;
		}

		$.ajax({
			type: 'post',
			url: url,
			data: data,
			dataType: 'json',
			timeout: 1000,
			beforeSend: function() {
				obj.addClass('cur').html('发送中 ...');
				if (obj.next('span').size() > 0) obj.next('span').hide();
			},
			success: function(data) {
				if (data.id == 1) {
					if (obj.next('span').size() == 0) obj.after('&nbsp;&nbsp;<span class="fsz">发送成功</span>');
					else obj.next('span').show();
					dmiao(obj);
					intcode = setInterval(function() {
						dmiao(obj);
					}, 1000);
					$('.code').focus();
				} else {
					if (obj.next('span').size() == 0) obj.after('&nbsp;&nbsp;<span>发送异常，请稍后再试</span>');
					else obj.next('span').html('发送异常，请稍后再试').show();
					intcode = setInterval(function() {
						dmiao(obj);
					}, 1000);
				}
			},
			error: function(data) {
				if (obj.next('span').size() == 0) obj.after('&nbsp;&nbsp;<span>发送异常，请稍后再试</span>');
				else obj.next('span').html('发送异常，请稍后再试').show();
				intcode = setInterval(function() {
					dmiao(obj);
				}, 1000);
			},
			complete: function(XMLHttpRequest, status) { //请求完成后最终执行参数
				　　　　
				if (status == 'timeout') { //超时,status还有success,error等值的情况
					　　　　　
					ajaxTimeoutTest.abort();　　　　　
					alert("超时");　　　　
				}　　
			}
		});
	}
}

// 等待加载 load

function load(msg) {
	easyDialog.open({
		container: {
			content: msg
		}
	});
}

// 发送倒计时

function dmiao(obj) {
	obj.html('重新发送(' + tt + ')');
	tt--;
	if (tt < 0) {
		obj.removeClass('cur').html('重新发送').next('span').hide();
		clearInterval(intcode);
		tt = 60;
	}
}

function sErrorMsg(obj, msg) {
	msg = typeof(msg) == 'undefined' ? obj.attr('title') : msg;
	obj.focus().next('.msg').html(msg).hide().fadeIn().addClass('error');
}

function alert(msg, title) {
	var title = title ? title : '系统提示';
	easyDialog.open({
		container: {
			header: title,
			content: msg,
			yesFn: function() {
				return true;
			}
		}
	});
}

function myalert(msg, isreload) {
	easyDialog.open({
		container: {
			header: '系统提示',
			content: msg,
			yesFn: function() {
				if (isreload) window.location.reload();
				else return true;
			}
		}
	});
}

function sDialog(title, content) {
	if($('#dialog').size() == 0)
		$('body').append('<div id="dialog" class="pop">'+
							'<div class="con"></div>'+
						'</div>');
	var dialog = $('#dialog');
	dialog.children('.con').html('<h4 id="easyDialogTitle" class="m_title"><a title="关闭窗口" href="javascript:void(0)" onclick="easyDialog.close();">×</a>' + title + '</h4>' + content);

	//弹框宽度 兼容ie 67 
	var o = $('#dialog .con').children().eq(1);
	var le = o.css('margin-left') == 'auto' ? 0 : parseInt(o.css('margin-left'));
	var ri = o.css('margin-right') == 'auto' ? 0 : parseInt(o.css('margin-right'));
	var width = parseInt(o.width()) + le + ri;
	width = width < 480 ? 480 : width;
	$('#dialog').width(width + 'px');
	//弹框宽度 兼容ie 67 

	easyDialog.open({
		container: 'dialog'
	});
	$('#dialog').find('.txt:first').focus();
}

function sChange(fun) {
	$('#safe_fire .btn').unbind('click').click(function() {
		eval(fun);
	})
	easyDialog.open({
		container: 'safe_fire'
	});
}