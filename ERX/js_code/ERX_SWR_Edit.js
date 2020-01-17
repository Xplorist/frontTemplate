var app = new Vue({
	el: '#app',
	data: {
		pkid: '',
		page_type: '',// 頁面類型，add:新增，edit：編輯，rej:駁回後提交
		au_status: '0',// 需保存【非空】
		rpt_type_no: 'SWR',// 需保存【非空】
		project_id: '', // 需保存【非空】
		project_name: '', // 需保存【非空】
		factory_zone: '',// 需保存【非空】
		mail_dept_list: [],
		mail_dept_list_array: [],
		mail_dept_selected: [],// 需保存,【中間表】mail_dept_pkid_list【非空】
		bill_no: '',// 需保存
		
		req_dept: '',// 需求提出單位
		exec_phase: '',// 執行階段
		bill_phase_1: '',// 表單階段一
		bill_phase_2: '',// 表單階段二
		target: '',// 目的
		req_dept_emp: '',// 需求部門人員
		req_desc: '',// 需求說明
		model_name: '',// 機種名稱
		project_code: '',// 專案代碼
		project_code_ver: '',// 專案代碼版次
		theme: '',// 主旨
		exec_dept: '',// 執行單位
		req_date: '',// 需求日期
		swr_type: '',// swr類型
		swr_type_other: '',// swr類型其它值
		valid_period: '',// 有效期
		content: '',// 內容
		
		maker_info: {"emp_no": "", "emp_name": ""},
		au_type_emp_list: [],// 需保存，審核類型list（包含審核路徑list，審核人list）
		modal_au_type_no: '',
		modal_au_type_name: '',
		modal_au_emp_list: [],
		modal_au_emp_list_selected: [],
		isLastChecked: 'N',
		file_list: [],// 需保存，文件list
		rpt_mail_dept_rel_id: '',// 報告分發單位關聯id

		rpt_file_rel_id: '',// 報告文件關聯id
		SWR_AU_0_list: [],// 進度類型：承辦
		SWR_AU_1_list: [],// 進度類型：SWR管理員審核
		SWR_AU_2_list: [],// 進度類型：提出單位主管審核
		SWR_AU_3_list: [],// 進度類型：工程/品保/執行單位審核
		SWR_AU_4_list: [],// 進度類型：產品處單位主管核准1
		SWR_AU_5_list: [],// 進度類型：產品處單位主管核准2
		rej_au_path_id: '',// 駁回審核路徑id
		rej_au_type_no: '',// 駁回審核類型編號
		rej_memo: ''// 駁回備註
	},
	methods: {
		// 獲取url參數
		getUrlParam: function(param) {
			var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return decodeURI(r[2]);
			return null;
		},
		// 返回上一頁
		goBack: function() {
			var _self = this;
			
			if(_self.page_type == 'add' || _self.page_type == 'edit') {
				window.location.href = "ERX_SWR_List.html?projectId=" + _self.project_id 
				+ "&projectName=" + _self.project_name;
			} else if(_self.page_type == 'rej') {
				window.location.href = "/ePDMWeb/modules/groupware/taskManage/taskCheckInterface.jsp";
			}
		},
		// 查詢分發單位list
		query_mail_dept_list: function() {
			var _self = this;
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/query_mail_dept_list.x',
				  data: {
					  'rpt_type_no': 'SWR'
				  }
				}).then(function(response) {
					_self.mail_dept_list = response.data;
					var result = _self.mail_dept_list_array;
					var list = _self.mail_dept_list;
					var array = [];
					for(var i = 0; i < list.length; i++) {
						array.push(list[i]);
						if((i + 1) % 6 == 0) {
							result.push(array);
							array = [];
						} else if(i == list.length - 1) {
							result.push(array);
						}
					}
					
					_self.query_maker_info();
				});
		},
	
	    // 查詢承辦人信息
	    query_maker_info: function() {
	    	var _self = this;
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX/query_maker_info.x',
	    		  data: ''
	    		}).then(function(response) {
	    			_self.maker_info = response.data;
	    			_self.factory_zone = _self.maker_info.factory_zone;
	    			
	    			_self.query_au_type_emp_list();
	    		});
	    },
	    // 查詢審核類型及其審核人list
	    query_au_type_emp_list: function() {
	    	var _self = this;
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX/query_au_type_emp_list.x',
	    		  data: {
	    			  'rpt_type_no': 'SWR'
	    		  }
	    		}).then(function(response) {
	    			console.log(response.data)
	    			_self.au_type_emp_list = response.data;
	    			
	    			if(_self.page_type == 'edit') {
	    				// 頁面類型為編輯類型,查詢根據pkid查詢數據
	    				_self.query_swr_main(_self.pkid);
	    			} else if (_self.page_type == 'rej') {
	    				// 頁面類型為駁回類型
	    				_self.rej_au_path_id = _self.getUrlParam("rej_au_path_id");
	    				_self.rej_au_type_no = _self.getUrlParam("rej_au_type_no");
	    				_self.rej_memo = _self.getUrlParam("rej_memo");
	    				
	    				_self.query_swr_main(_self.pkid);
	    				
	    			}
	    		});
	    },
	    // 打開審核人模態框
	    open_au_emp_modal: function(au_type_no) {
	    	var _self = this;
	    	_self.modal_au_type_no = au_type_no;
	    	_self.modal_au_type_name = "";
	    	_self.modal_au_emp_list = [];
	    	_self.modal_au_emp_list_selected = [];
	    	
	    	var list = _self.au_type_emp_list;
	    	for(var i = 0; i < list.length; i++) {
	    		var bean = list[i];
	    		if(bean.au_type_no == au_type_no) {
	    			_self.modal_au_type_name = bean.au_type_name;
	    			_self.modal_au_emp_list = bean.emp_list;
	    			
	    			break;
	    		}
	    	}
	    	
	    	$("#AU_EMP_Modal").modal("show");
	    },
	    // 審核人設置模態框確認
	    ensure_au_emp_modal: function() {
	    	var _self = this;
	    	var list = _self.au_type_emp_list;
	    	
	    	if(_self.modal_au_emp_list_selected.length == 0) {
	    		alert("請選擇審核人員"); 
	    		return;
	    	}
	    	
	    	if(_self.page_type == 'rej') {
	    		for(var i = 0; i < list.length; i++) {
	    			var type_bean = list[i];
	    			
	    			if(type_bean.rej_flag == 'rej') {
	    				var path_list = type_bean.path_list;
	    				for(var j = 0; j < path_list.length; j++) {
	    					var path_bean = path_list[j];
	    					// 把審核路徑list中路徑為駁回的進行修改，
	    					// 駁回路徑後的路徑刪除後再將modal數據中去除第一個的數據後面的數據加進去
	    					if(path_bean.rej_flag == 'rej') {
	    						var emp_bean = _self.modal_au_emp_list_selected[0];
	    						path_bean.emp_no = emp_bean.emp_no;
	    						path_bean.emp_name = emp_bean.emp_name;
	    					} else if(path_bean.rej_flag == 'no_au') {
	    						path_list.splice(j, 1);
	    						j--;
	    					}
	    				}
	    				
	    				_self.modal_au_emp_list_selected.splice(0, 1);
	    				for(var k = 0; k < _self.modal_au_emp_list_selected.length; k++) {
	    					var modal_bean = _self.modal_au_emp_list_selected[k];
	    					modal_bean.rej_flag = "no_au";
	    				}
	    				Array.prototype.push.apply(path_list, _self.modal_au_emp_list_selected);
	    			} else if(type_bean.rej_flag == 'no_au') {
	    				if(_self.modal_au_type_no == type_bean.au_type_no) {
	    					type_bean.path_list = [];
	    					Array.prototype.push.apply(type_bean.path_list, _self.modal_au_emp_list_selected);
	    					
	    					break;
	    				}
	    			}
	    		}
	    	} else {
	    		for(var i = 0; i < list.length; i++) {
	    			var bean = list[i];
	    			if(_self.modal_au_type_no == bean.au_type_no) {
	    				bean.path_list = [];
	    				Array.prototype.push.apply(bean.path_list, _self.modal_au_emp_list_selected);
	    				
	    				break;
	    			}
	    		}
	    	}
	    	
	    	$("#AU_EMP_Modal").modal("hide");
	    },
	    // 加載路徑,默認上次所選擇的簽核人員
	    load_path: function() {
	    	var _self = this;
	    	
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX/load_path.x',
	    		  data: {
	    			  'rpt_type_no': 'SWR'
	    		  }
	    		}).then(function(response) {
	    			var data = response.data;
	    			var list = _self.au_type_emp_list;
	    			for(var i = 0; i < data.length; i++) {
	    				var data_item = data[i];
	    				if(data_item.path_list.length == 0) {
	    					alert("無上次所選澤的簽核人員！");
	    					_self.isLastChecked = 'N';
	    					break;
	    				}
	    				for(var j = 0; j < list.length; j++) {
	    					var list_item = list[j];
	    					if(data_item.au_type_no == list_item.au_type_no) {
	    						list_item.path_list = data_item.path_list;
	    						break;
	    					}
	    				}
	    			}
	    		});
	    },
	    // 清空路徑
	    clear_path: function() {
	    	var _self = this;
	    	var list = _self.au_type_emp_list;
	    	for(var i = 0; i < list.length; i++) {
	    		var bean = list[i];
	    		bean.path_list = [];
	    	}
	    },
	    // 打開文件上傳模態框
	    open_file_modal: function() {
	    	document.querySelector("#file").value = '';
	    	$("#file_upload_modal").modal("show");
	    },
	    // 上傳文件
	    upload_file: function() {
	    	var _self = this;
	    	var files = document.querySelector("#file").files;
	    	if(files.length == 0) {
	    		alert("文件不能為空");
	    		return;
	    	}
	    	
	    	$.ajaxFileUpload({
				type : "POST",
				url : '/ePDMWeb/FileUpDown/ERX_File_Action!fileUpload.action',
				async : false,
				secureuri : false,
				fileElementId : 'file',// 此id的input元素的name和id必須相同
				dataType : 'json',
				data : {
					'rpt_type_no' : "SWR"
				},
				success : function(data) {
					if (data.result == "0") {
						alert("附件上傳失敗");
						return false;
					} else {
						var file_origin_name = data.file_origin_name;
						var file_save_name = data.file_save_name;
						var file_save_path = data.file_save_path;
						
						_self.file_list.push({
							"file_origin_name": file_origin_name,
							"file_save_name": file_save_name,
							"file_save_path": file_save_path
						});
						
						alert("附件上傳成功");
						$("#file_upload_modal").modal("hide");
					}

				},
				error : function(data) {
					alert("文件上傳異常");
				}
			});
	    },
	    // 下載文件
	    download_file: function(obj) {
	    	$.fileDownload('/ePDMWeb/FileUpDown/FileDownloadAction.action', {
				httpMethod : "POST",
				data : {
					'fileName' : obj.file_save_name,
					'filePath' : obj.file_save_path
					}
			});
	    },
	    // 刪除文件
	    delete_file: function(obj) {
	    	var _self = this;
	    	var confirm_flag = confirm("刪除後無法恢復，確定刪除嗎？"); 
	    	if(!confirm_flag) {
	    		return;
	    	}
	    	
	    	$.ajax({
				url : "/ePDMWeb/FileUpDown/ERX_File_Action!fileDelete.action",
				data : {
					'file_save_name' : obj.file_save_name,
					'file_save_path' : obj.file_save_path
				},
				dataType : 'json',
				type : 'post',
				async : true,
				success : function(data) {
					if(data.result == '1'){
						alert("刪除成功");
						
						var list = _self.file_list;
						for(var i = 0; i < list.length; i++) {
							var file = list[i];
							if(file.file_save_name == obj.file_save_name) {
								list.splice(i, 1);
								break;
							}
						}
					}else{
						alert("刪除失敗");
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					alert(textStatus);
				}
			});
	    },
	    // 保存數據（產品評估報告）
	    save_data: function(submit_flag) {
	    	var _self = this;
	    	if(submit_flag == 1) {
	    		_self.au_status = '1';
	    	}
	    	// 分發單位非空判斷
	    	if(_self.mail_dept_selected.length == 0) {
	    		alert("分發單位不能為空");
	    		return;
	    	}

	    	// todo
	    	if(	   _self.req_dept == '' 
	    		|| _self.exec_phase == '' 
	    		|| _self.target == ''
	    		|| _self.model_name == '' 
	    		|| _self.project_code == '' 
	    		|| _self.project_code_ver == '' 
	    		|| _self.theme == ''
	    		|| _self.exec_dept == '' 
	    		|| _self.req_date == '' 
	    		|| _self.swr_type == ''
	    		|| _self.valid_period == ''
	    		) {
	    		alert("*號項不能為空");
	    		return;
	    	}
	    	if (_self.exec_phase == '量產開發階段' && ( _self.bill_phase_1 == '' || _self.bill_phase_2 == '')) {
	    		alert("請選擇【表單階段】的具體內容")
	    		return;
	    	}
	    	// 判斷多選或單選的其它被選中時，判斷其它項是否為非空
	    	if( _self.swr_type == '其他' && _self.swr_type_other == '' ) {
	    		alert("SWR類型的【其它】項被選中，請填寫具體內容");
	    		return;
	    	}
	    	// 審核路徑，非空判斷
	    	var path_flag = false;
	    	for(var i = 0; i < _self.au_type_emp_list.length; i++ ) {
	    		var au = _self.au_type_emp_list[i];
	    		if(i == 0 && (_self.page_type == 'edit' || _self.page_type == 'add')) {
	    			au.path_list = [];
	    			var au_0 = {
	    					"pkid":"",
	    					"rpt_type_no":"SWR",
	    					"rpt_id":"",
	    					"list_order":"",
	    					"au_type_no":"SWR_AU_0",
	    					"same_type_order":"",
	    					"emp_no": _self.maker_info.emp_no,
	    					"emp_name": _self.maker_info.emp_name,
	    					"next_path_id":"",
	    					"create_date":"",
	    					"creator":""	
	    			};
	    			au.path_list.push(au_0);
	    		}
	    		if(au.path_list == null || au.path_list.length == 0) {
	    			path_flag = true;
	    			break;
	    		}
	    	}
	    	if(path_flag) {
	    		alert("右側的審核路徑請填寫完整");
	    		return;
	    	}
	    	
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX_SWR/save_data.x',
	    		  data: {
	 				// 表單
	 				'page_type'					: _self.page_type,
	 				'create_date'				: '',
					'creator'					: '',
	 				'pkid'						: _self.pkid,
	 				'rpt_type_no'				: _self.rpt_type_no,
	 				'project_id'				: _self.project_id,
	 				'project_name'				: _self.project_name,
	 				'factory_zone'				: _self.factory_zone,
					'rpt_mail_dept_rel_id' 		: _self.rpt_mail_dept_rel_id,
					'bill_no'					: _self.bill_no,
	    			'req_dept' 					: _self.req_dept,
					'exec_phase' 				: _self.exec_phase,
					'bill_phase_1'				: _self.bill_phase_1,
					'bill_phase_2' 				: _self.bill_phase_2,
					'target' 					: _self.target,
					'req_dept_emp' 				: _self.req_dept_emp,
					'req_desc' 					: _self.req_desc,
					'model_name' 				: _self.model_name,
					'project_code' 				: _self.project_code,
					'project_code_ver' 			: _self.project_code_ver,
					'theme' 					: _self.theme,
					'exec_dept' 				: _self.exec_dept,
					'req_date' 					: _self.req_date,
					'swr_type' 					: _self.swr_type,
					'swr_type_other' 			: _self.swr_type_other,
					'valid_period' 				: _self.valid_period,
					'content' 					: _self.content,
					'rpt_file_rel_id'			: _self.rpt_file_rel_id,
					'au_status'					: _self.au_status,
					'maker_info' 				: _self.maker_info,
					'modal_au_type_no'			: _self.modal_au_type_no,
					'modal_au_type_name'		: _self.modal_au_type_name,
					'modal_au_emp_list'			: _self.modal_au_emp_list,
					'modal_au_emp_list_selected': _self.modal_au_emp_list_selected,
					'isLastChecked' 			: _self.isLastChecked,
					
					// 審核
					'au_type_emp_list'			: _self.au_type_emp_list,
					// 文件
					'file_list' 				: _self.file_list,
					// 分發單位
					'mail_dept_pkid_list'		: _self.mail_dept_selected
	    		  }
	    		}).then(function(response) {
	    			var data = response.data;
	    			if(data.save_flag == '0') {
	    				alert("保存失敗");
	    			} else if(data.save_flag == '1') {
	    				var param = {
	    						'p_in_rpt_type_no': data.rpt_type_no,
	    						'p_in_opt_type': '0',// 0：提交，1：通過，2：駁回
	    						'p_in_main_pkid': data.main_pkid,
	    						'p_in_path_pkid': data.maker_path_pkid,
	    						'p_in_opt_emp_no': data.opt_emp_no,
	    						'p_in_rej_memo': ''
	    				};
	    				// 提交
	    				if(submit_flag == 1) {
	    					_self.submit_data(param);
	    				} else {
	    					alert("保存成功");
	    					_self.goBack();
	    				}
	    			}else{
	    				alert('失敗，請稍後重試')
	    			}
	    		});
	    },
	    // 提交送審數據
	    submit_data: function(param) {
	    	var _self = this;
	    	
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX_PD/submit_data.x',
	    		  data: param
	    		}).then(function(response) {
	    			var data = response.data;
	    			
	    			if(data.p_out_result_flag == '-1') {
	    				alert("提交失敗！" + data.p_out_result_text);
	    				return;
	    			} else if(data.p_out_result_flag == '0') {
	    				alert("提交成功");
	    				_self.goBack();
	    			}
	    		});
	    },
	    // 查詢產品評估報告
	    query_swr_main: function(pkid) {
	    	var _self = this;
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX_SWR/query_swr_main.x',
	    		  data: {
	    			  'pkid': pkid
	    		  }
	    		}).then(function(response) {
	    			var data = response.data;
	    			console.log(data.au_type_emp_list)

					_self.bill_phase_1 = data.bill_phase_1
					_self.bill_phase_2 = data.bill_phase_2
					_self.content = data.content
					_self.exec_dept = data.exec_dept
					_self.exec_phase = data.exec_phase
					_self.factory_zone = data.factory_zone
					_self.model_name = data.model_name
					_self.pkid = data.pkid
					_self.project_code = data.project_code
					_self.project_code_ver = data.project_code_ver
					_self.project_id = data.project_id
					_self.project_name = data.project_name
					_self.req_date = data.req_date
					_self.req_dept = data.req_dept
					_self.req_dept_emp = data.req_dept_emp
					_self.req_desc = data.req_desc
					_self.rpt_type_no = data.rpt_type_no
					_self.swr_type = data.swr_type
					_self.swr_type_other = data.swr_type_other
					_self.target = data.target
					_self.theme = data.theme
					_self.valid_period = data.valid_period
	    			_self.au_status = data.au_status;
	    			_self.mail_dept_selected = data.mail_dept_pkid_list;
	    			_self.bill_no = data.bill_no;
	    			_self.au_type_emp_list = data.au_type_emp_list;
	    			_self.file_list = data.file_list;
	    			
	    			// 主表中的關聯id
	    			_self.rpt_mail_dept_rel_id = data.rpt_mail_dept_rel_id;// 報告分發單位關聯id
	    			_self.rpt_file_rel_id = data.rpt_file_rel_id;// 報告文件關聯id
	    			
	    			for(var i = 0; i < _self.au_type_emp_list.length; i++) {
	    				var type_bean = _self.au_type_emp_list[i];
	    				
	    				switch (type_bean.au_type_no) {
						case 'SWR_AU_0':
							_self.SWR_AU_0_list = type_bean.sche_list;
							break;
						case 'SWR_AU_1':
							_self.SWR_AU_1_list = type_bean.sche_list;
							break;
						case 'SWR_AU_2':
							_self.SWR_AU_2_list = type_bean.sche_list;
							break;
						case 'SWR_AU_3':
							_self.SWR_AU_3_list = type_bean.sche_list;
							break;
						case 'SWR_AU_4':
							_self.SWR_AU_4_list = type_bean.sche_list;
							break;
						case 'SWR_AU_5':
							_self.SWR_AU_5_list = type_bean.sche_list;
							break;

						default:
							break;
						}
	    			}
	    			
	    			// 處理審核類型list,給審核類型進行分類（pass: 審核通過，rej: 駁回，no_au: 未審）
	    			if(_self.page_type == 'rej') {
	    				var rej_type_flag = false;
	    				for(var i = 0; i < _self.au_type_emp_list.length; i++) {
	    					var type_bean = _self.au_type_emp_list[i];
	    					
	    					if(type_bean.au_type_no == _self.rej_au_type_no) {
	    						rej_type_flag = true;
	    						type_bean.rej_flag = 'rej';
	    						continue;
	    					} else {
	    						type_bean.rej_flag = 'pass';
	    					}
	    					
	    					if(rej_type_flag) {
	    						type_bean.rej_flag = 'no_au';
	    					}
	    				}
	    			}
	    			
	    			// 處理審核類型list中的類型為駁回時，對駁回類型的審核路徑進行分類（pass: 審核通過，rej: 駁回，no_au: 未審）
	    			if(_self.page_type == 'rej') {
	    				var rej_path_flag = false;
	    				for(var i = 0; i < _self.au_type_emp_list.length; i++) {
	    					var type_bean = _self.au_type_emp_list[i];
	    					if(type_bean.rej_flag == 'rej') {
	    						var path_list = type_bean.path_list;
	    						for(var j = 0; j < path_list.length; j++) {
	    							var path_bean = path_list[j];
	    							if(path_bean.pkid == _self.rej_au_path_id) {
	    								rej_path_flag = true;
	    								path_bean.rej_flag = 'rej';
	    								continue;
	    							} else {
	    								path_bean.rej_flag = 'pass';
	    							}
	    							
	    							if(rej_path_flag) {
	    								path_bean.rej_flag = 'no_au';
	    							}
	    						}
	    					} 
	    				}
	    			}
	    		});
	    },
	    // 結果切換事件
	    result_changed: function() {
	    	var _self = this;
			
			_self.time_limit = '';
			_self.time_limit_reason = '';
			_self.amnt_limit = '';
			_self.amnt_limit_reason = '';
			_self.smp_ng_days = '';
			_self.smp_ng_tel = '';
			_self.smp_ng_dept_selected = [];
	    }
	},
	created: function() {
		var _self = this;
		_self.project_id = _self.getUrlParam("project_id");
		_self.project_name = _self.getUrlParam("project_name");
		_self.page_type = _self.getUrlParam("page_type");// edit：編輯，rej:駁回後提交
		_self.pkid = _self.getUrlParam("pkid");
		
		// 由於多個請求並發會導致後台出錯，所以多選框，單選框這類數據
		// 的請求採用鏈式請求，從查詢分發單位開始
		_self.query_mail_dept_list();
	},
	watch:{
		swr_type(val, oldval){
			if (val != '其他') {
				this.swr_type_other = ''
			}
		},
		exec_phase(val, oldval){
			if (val == '量產後階段') {
				this.bill_phase_1 = ''
				this.bill_phase_2 = ''
			}
		}

	}
});