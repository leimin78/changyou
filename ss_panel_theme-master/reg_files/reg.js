$(document).ready(function(e) {
	var passtatus = 0;
	var chkpwd = function(pwd_value) {
		var oreg = /^[a-zA-Z0-9]{6,20}$/;
		var reg1 = /^(([0-9]*?)|([a-z]*?)|([A-Z]*?))$/;
		var reg2 = /^(([0-9a-z]*?)|([a-zA-Z]*?)|([A-Z0-9]*?))$/;
		var reg3 = /^[0-9a-zA-Z]*?$/;

		if (!oreg.test(pwd_value)) return 0;
		else if (reg1.test(pwd_value)) return 1;
		else if (reg2.test(pwd_value)) return 2;
		else if (reg3.test(pwd_value)) return 3;
		else return 0;
	}

	$('#password').keyup(function() {
		$('#almsg').html('');
		$('#level').removeClass('level1');
		$('#level').removeClass('level2');
		$('#level').removeClass('level3');
		switch (chkpwd($(this).attr('value'))) {
			case 1:
				$('#level').addClass('level1');
				passtatus = 1;
				break;

			case 2:
				$('#level').addClass('level2');
				passtatus = 2;
				break;

			case 3:
				$('#level').addClass('level3');
				passtatus = 3;
				break;
			case 0:
				if ($(this).val().length >= 6) $('#almsg').html('<font color="#ff00">密码只能为数字和大小写字母。</font>');
			default:
				passtatus = 0;
		}
	});

	//恢复元素的初始状态
	var reinit = function(obj) {
		$('#space_msg_' + $(obj).attr('id')).removeClass('sp_msg');
		$('#space_msg_' + $(obj).attr('id')).removeClass('suc');
		$('#space_msg_' + $(obj).attr('id')).removeClass('log_txt_error');
		$('#msg_' + $(obj).attr('id')).html('');
		$(obj).attr('valid', '0');
	}

	//禁止为空的处理
	var deny_null = function(obj) {
		var self = '';
		switch (obj.attr('id')) {
			case 'loginid':
				self = '迅游账号';
				break;
			case 'password':
				self = '创建密码';
				break;
			case 'confirm_password':
				self = '重复密码';
				break;
			case 'ver_code_2':
				self = '验证码';
				break;
		}

		$('#space_msg_' + obj.attr('id')).removeClass('sp_msg');
		$('#space_msg_' + obj.attr('id')).removeClass('suc');
		$('#space_msg_' + obj.attr('id')).addClass('log_txt_error_1');
		$('#msg_' + obj.attr('id')).html('<span style="color:red;">'+self + '不能为空</span>');
		obj.attr('valid', '1');
	}

	//缓存填充
	var cache_fill = function(obj) {
		var obj_msg = $('#msg_' + $(obj).attr('id'));
		var clss = ['sp_msg', 'suc', 'log_txt_error'];
		for (var i = 0, j = clss.length; i < j; i++) {
			if ($(obj).attr('prev_class') == clss[i]) {
				$('#space_msg_' + $(obj).attr('id')).addClass(clss[i]);
			} else {
				$('#space_msg_' + $(obj).attr('id')).removeClass(clss[i]);
			}
		}

		smsg(obj_msg, $(obj).attr('prev_valid'))
		$('#msg_' + $(obj).attr('id')).html($(obj).attr('prev_mesg'));
		$(obj).attr('valid', $(obj).attr('prev_valid'));
	}

	//保存当前状态
	var save_status = function(obj, prev_class, prev_mesg) {
		$(obj).attr('prev_value', $(obj).attr('value'));
		$(obj).attr('prev_class', prev_class);
		$(obj).attr('prev_mesg', prev_mesg);
		$(obj).attr('prev_valid', $(obj).attr('valid'));
	}

	//设置当前状态
	var set_status = function(obj, _class, mesg, valid) {
		var obj_msg = $('#msg_' + $(obj).attr('id'));
		var clss = ['sp_msg', 'suc', 'log_txt_error'];
		for (var i = 0, j = clss.length; i < j; i++) {
			if (_class == clss[i]) {
				$('#space_msg_' + $(obj).attr('id')).addClass(clss[i]);
			} else {
				$('#space_msg_' + $(obj).attr('id')).removeClass(clss[i]);
			}
		}
		smsg(obj_msg, valid);
		$('#msg_' + $(obj).attr('id')).html(mesg);
		$(obj).attr('valid', valid);
	}

		function smsg(obj, i) {
			if (i == 2) obj.removeClass('error').addClass('right');
			else if (i == 1) obj.removeClass('right').addClass('error');
		}

	var curr_event_source = 'input'; //事件来源
	var ajax_question_method = true; //默认使用异步请求

	//元素获得焦点
	var focus_process = function() {
		var obj_msg = $('#msg_' + $(this).attr('id'));
		if ($(this).attr('id') == 'password') {
			$('#almsg').text('');
		}
		curr_event_source = 'input';
		ajax_question_method = true;

		//$('#space_msg_'+$(this).attr('id')).removeClass('log_txt_error');
		//$('#space_msg_'+$(this).attr('id')).removeClass('suc');
		//$('#space_msg_'+$(this).attr('id')).addClass('sp_msg');
		obj_msg.attr('class', 'alertmsg').html(obj_msg.attr('title'));
	}

	$('#loginid').focus(focus_process);
	$('#password').focus(focus_process);
	$('#confirm_password').focus(focus_process);
	$('#ver_code_2').focus(focus_process);
	$('#loginid').keydown(function() {
		$(this).attr('valid', '1')
	});
	$('#password').keydown(function() {
		$(this).attr('valid', '1')
	});
	$('#confirm_password').keydown(function() {
		$(this).attr('valid', '1')
	});
	$('#ver_code_2').keydown(function() {
		$(this).attr('valid', '1')
	});
	$('#loginid').focus(function() {
		if ($(this).val() == '用户名/QQ号/手机号') {
			$(this).val('');
		}
		$(this).removeClass('uname_deft_color');
	});
	$('#loginid').blur(function() {
		if ($(this).attr('value') == '') {
			if ($(this).attr('value') == '') {
				$(this).addClass('uname_deft_color');
			}
			if (curr_event_source == 'form') deny_null($(this));
			else reinit($(this));
		} else {
			if ($(this).attr('prev_value') == $(this).attr('value')) {
				cache_fill($(this));
				return false;
			}

			var html = '';
			var oreg = /^[a-zA-Z0-9]{6,20}$/;
			if ($(this).attr('value').length < 6) {
				html = '长度至少 6 个字符';
			} else if (!oreg.test($(this).attr('value'))) {
				html = '只能是英文和数字';
			}

			if (html == '') {
				var obj = $(this);
				$('#msg_' + $(this).attr('id')).html('正在检查...');
				$.ajax({
					async: ajax_question_method,
					type: 'POST',
					dataType: 'text',
					data: $('#regForm').serializeArray(),
					url: '/index.php/memberpanel/checkUsserExisted_bak',
					complete: function(request, status) {
						var html = request.responseText;
						if ($.trim(html) == '') {
							set_status(obj, 'suc', '', '2');
							save_status(obj, 'suc', '');
						} else {
							set_status(obj, 'log_txt_error', html, '1');
							save_status(obj, 'log_txt_error', html);
						}
					}
				});
			} else {
				set_status($(this), 'log_txt_error', html, '1');
				save_status($(this), 'log_txt_error', html);
			}
		}
	});


	$('#password').blur(function() {
		var txt = '';
		if (passtatus == 1) txt = '试试数字、大小写字母组合吧';
		else if (passtatus == 2) txt = '复杂度还行，再加强一下？试试数字、大小写字母组合。';
		else if (passtatus == 3) txt = '复杂度不错，请牢记哦！';
		$('#almsg').text(txt);

		$(this).removeClass("log_txt_focuse");

		if ($(this).attr('value') == '') {

			if (curr_event_source == 'form') deny_null($(this));
			else reinit($(this));
		} else {
			var html = '';
			var oreg = /^[a-zA-Z0-9]{6,20}$/;
			if ($(this).attr('value').length < 6) {
				html = '长度至少 6 个字符';
			} else if (!oreg.test($(this).attr('value'))) {
				html = '只能是英文和数字';
			}

			if (html == '') {
				if ($(this).attr('value') == $('#confirm_password').attr('value')) {
					//					set_status($('#confirm_password'), 'suc', '格式正确', '2');
					set_status($('#confirm_password'), 'suc', '', '2');
				} else if ($('#confirm_password').attr('value') != '') {
					set_status($(this), 'log_txt_error', '两次输入的密码不一致', '1');
					return false;
				}

				//				set_status($(this), 'suc', '格式正确', '2');
				set_status($(this), 'suc', '', '2');
			} else {
				set_status($(this), 'log_txt_error', html, '1');
			}
		}
	});

	$('#confirm_password').blur(function() {
		$(this).removeClass("log_txt_focuse");

		if ($(this).attr('value') == '') {
			if (curr_event_source == 'form') deny_null($(this));
			else reinit($(this));
		} else {
			var html = '';
			var oreg = /^[a-zA-Z0-9]{6,20}$/;
			if ($(this).attr('value').length < 6) {
				html = '长度至少 6 个字符';
			} else if (!oreg.test($(this).attr('value'))) {
				html = '只能是英文和数字';
			}

			if (html == '') {
				if ($(this).attr('value') == $('#password').attr('value')) {
					//					set_status($('#password'), 'suc', '格式正确', '2');
					set_status($('#password'), 'suc', '', '2');
				} else if ($('#password').attr('value') != '') {
					set_status($(this), 'log_txt_error', '两次输入的密码不一致', '1');
					return false;
				}

				//				set_status($(this), 'suc', '格式正确', '2');
				set_status($(this), 'suc', '', '2');
			} else {
				set_status($(this), 'log_txt_error', html, '1');
			}
		}
	});

	$('#ver_code_2').blur(function() {
		//		$(this).removeClass("log_txt_focuse");
		//		
		//		if($(this).attr('value')=='')
		//		{
		//			if(curr_event_source=='form') deny_null($(this));
		//			else reinit($(this));
		//		}else
		//		{
		//			if($(this).attr('prev_value')==$(this).attr('value'))
		//			{
		//				cache_fill($(this));
		//				return false;
		//			}
		//			
		//			var oreg	= /^[0-9]{5}$/;
		//			if(!oreg.test($(this).attr('value')))
		//			{
		//				set_status($(this), 'log_txt_error', '输入错误', '1');
		//				save_status($(this), 'log_txt_error', '输入错误');
		//				return false;
		//			}
		//			
		//			var obj	= $(this);
		//			set_status(obj, 'suc', '格式正确', '2');
		//			save_status(obj, 'suc', '格式正确');
		//			
		//		}
		$('#msg_ver_code_2').html('');
	});

	$('#regForm').submit(function() {
		curr_event_source = 'form'; //设定事件来源
		ajax_question_method = false;

		$('#loginid, #password, #confirm_password, #ver_code_2').blur();
		if ($('#loginid').attr('valid') == '2' && $('#password').attr('valid') == '2' && $('#confirm_password').attr('valid') == '2') {
			easyDialog.open({
				container: {
					content: '数据提交中，请稍后 ...'
				}
			});
			$(this).ajaxSubmit({
				dataType: 'json',
				success: function(data) {
					if (data.errorid != 2) {
						$('#ver_code_2_image').click();
						alert(data.errormsg);
					} else {
						window.location.href = 'http://my.xunyou.com/u';
					}
				}
			});
		}
		return false;
	});


	$('.txt').focus(function() {
		$(this).addClass('f');
	}).blur(function() {
		$('.txt').removeClass('f');
	}).eq(0).focus();
});
var JPlaceHolder = {
    //检测
    _check : function(){
        return 'placeholder' in document.createElement('input');
    },
    //初始化
    init : function(){
        if(!this._check()){
            this.fix();
        }
    },
    //修复 何问起
    fix : function(){
        jQuery(':input[placeholder]').each(function(index, element) {
            var self = $(this), txt = self.attr('placeholder');
            self.wrap($('<div></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none'}));
            var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
            var holder = $('<span></span>').text(txt).css({position:'absolute', left:pos.left, top:pos.top, height:h, lienHeight:h, paddingLeft:paddingleft, color:'#aaa'}).appendTo(self.parent());
            self.focusin(function(e) {
                holder.hide();
            }).focusout(function(e) {
                if(!self.val()){
                    holder.show();
                }
            });
            holder.click(function(e) {
                holder.hide();
                self.focus();
            });
        });
    }
};
//执行 
jQuery(function(){
    JPlaceHolder.init();    
});