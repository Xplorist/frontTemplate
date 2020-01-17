var app = new Vue({
	el: '#app',
	data: {
		pkid: '',
		page_type: '',// 頁面類型，add:新增，edit：編輯，rej:駁回後提交
		au_status: '0',// 需保存【非空】
		rpt_type_no: 'PD',// 需保存【非空】
		project_id: '', // 需保存【非空】
		project_name: '', // 需保存【非空】
		factory_zone: '',// 需保存【非空】
		mail_dept_list: [],
		mail_dept_list_array: [],
		mail_dept_selected: [],// 需保存,【中間表】mail_dept_pkid_list【非空】
		bill_no: '',// 需保存
		eval_type_list: [],
		eval_type_mstr_selected: '',// 需保存，【中間表】eval_type_mstr_pkid【非空】
		eval_type_slv_selected: [],// 需保存，【中間表】eval_type_slv_pkid_list【非空】
		eval_type_other: '',// 需保存【選項為其它時非空】
		eval_type_other_flag: false,
		vendor: '',// 需保存【非空】
		eval_num_list: [],
		eval_num_selected: '',// 需保存，【中間表】eval_num_pkid【非空】
		eval_num_other: '',// 需保存【選項為其它時非空】
		eval_num_other_flag: false,
		model: '',// 需保存【非空】
		pd_name: '',// 需保存
		check_record: '',// 需保存
		hh_no: '',// 需保存【非空】
		test_record: '',// 需保存
		version: '',// 需保存【非空】
		mo_no: '',// 需保存【非空】
		pd_type_list: [],
		pd_type_1: {'pkid':'', 'other_flag': '', 'pd_type_name': ''},
		pd_type_2: {'pkid':'', 'other_flag': '', 'pd_type_name': ''},
		pd_type_3: {'pkid':'', 'other_flag': '', 'pd_type_name': ''},
		pd_type_4: {'pkid':'', 'other_flag': '', 'pd_type_name': ''},
		pd_type_selected: [],// 需保存，【中間表】pd_type_pkid_list
		pd_type_other: '', // 需保存【選項為其它時非空】
		pd_type_other_flag: false,
		exec_no: '',// 需保存【非空】
		result_list: [],
		result_1: {"pkid": "", "result_name": ""},
		result_2: {"pkid": "", "result_name": ""},
		result_3: {"pkid": "", "result_name": ""},
		result_selected: '',// 需保存，【中間表】result_pkid【非空】
		time_limit: '',// 需保存【結果為條件認可時非空】
		time_limit_reason: '',// 需保存
		amnt_limit: '',// 需保存【結果為條件認可時非空】
		amnt_limit_reason: '',// 需保存
		smp_ng_days: '',// 需保存
		smp_ng_tel: '',// 需保存
		smp_ng_dept_selected: [],// 需保存，【中間表】smp_ng_dept_pkid_list
		smp_ng_dept_list: [],
		hsf_res_1: '',// 需保存
		hsf_res_2: '',// 需保存
		hsf_res_3: '',// 需保存
		hsf_res_4: '',// 需保存
		hsf_res_5: '',// 需保存
		hsf_res_6: '',// 需保存
		hsf_risk: '',// 需保存
		memo: '',// 需保存
		memo_qe: '',// 需保存
		upload_res_list: [],
		upload_res_selected: [],// 需保存，【中間表】upload_res_pkid_list【非空】
		upload_res_other: '',// 需保存【選項為其它時非空】
		upload_res_other_flag: false,
		eval_dept_list: [],
		eval_dept_selected: '',// 需保存，【中間表】eval_dept_pkid【非空】
		maker_info: {"emp_no": "", "emp_name": ""},
		au_type_emp_list: [],// 需保存，審核類型list（包含審核路徑list，審核人list）
		modal_au_type_no: '',
		modal_au_type_name: '',
		modal_au_emp_list: [],
		modal_au_emp_list_selected: [],
		isLastChecked: 'N',
		file_list: [],// 需保存，文件list
		rpt_mail_dept_rel_id: '',// 報告分發單位關聯id
		rpt_eval_type_mstr_rel_id: '',// 報告評估類別主表關聯id
		rpt_eval_type_slv_rel_id: '',// 報告評估類別子表關聯id
		rpt_eval_num_rel_id: '',// 報告評估次數表關聯id
		rpt_pd_type_rel_id: '',// 報告產品類型表關聯id
		rpt_result_rel_id: '',// 報告結果表關聯id
		rpt_smp_ng_dept_rel_id: '',// 報告樣品不合格單位表關聯id
		rpt_upload_res_rel_id: '',// 報告上傳附檔資料明細表關聯id
		rpt_eval_dept_rel_id: '',// 報告評估單位表關聯id
		rpt_file_rel_id: '',// 報告文件關聯id
		PD_AU_0_list: [],// 進度類型：承辦
		PD_AU_1_list: [],// 進度類型：RoHS確認
		PD_AU_2_list: [],// 進度類型：QE確認
		PD_AU_3_list: [],// 進度類型：產工專案主管審核
		PD_AU_4_list: [],// 進度類型：品保主管審核
		PD_AU_5_list: [],// 進度類型：產工處級主管審核
		PD_AU_6_list: [],// 進度類型：事業處主管審核
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
				window.location.href = "ERX_PD_List.html?projectId=" + _self.project_id 
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
					  'rpt_type_no': 'PD'
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
					
					_self.query_eval_type_list();
				});
		},
		// 查詢評估類型list
	    query_eval_type_list: function() {
	    	var _self = this;
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX/query_eval_type_list.x',
	    		  data: {
	    			  'rpt_type_no': 'PD'
	    		  }
	    		}).then(function(response) {
	    			_self.eval_type_list = response.data;
	    			
	    			_self.query_eval_num_list();
	    		});
	    },
	    // 評估類別主項切換
	    eval_type_mstr_change: function() {
	    	var _self = this;
	    	_self.eval_type_slv_selected = [];
	    	_self.eval_type_other = "";
	    },
	    // 評估類別子項切換
	    eval_type_slv_change: function(obj) {
	    	var _self = this;
	    	if(obj.other_flag != 'N' && !_self.eval_type_slv_selected.includes(obj.pkid)) {
	    		_self.eval_type_other = "";
	    		_self.eval_type_other_flag = false;
	    	} else if(obj.other_flag != 'N' && _self.eval_type_slv_selected.includes(obj.pkid)) {
	    		_self.eval_type_other_flag = true;
	    	}
	    },
	    // 查詢評估次數list
	    query_eval_num_list: function() {
	    	var _self = this;
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX/query_eval_num_list.x',
	    		  data: ''
	    		}).then(function(response) {
	    			_self.eval_num_list = response.data;
	    			
	    			_self.query_pd_type_list();
	    		});
	    },
	    // 評估次數切換
	    eval_num_change: function(obj) {
	    	var _self = this;
	    	if(obj.other_flag != 'Y') {
	    		_self.eval_num_other = "";
	    		_self.eval_num_other_flag = false;
	    	} else {
	    		_self.eval_num_other_flag = true;
	    	}
	    },
	    // 查詢產品類型list
	    query_pd_type_list: function() {
	    	var _self = this;
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX/query_pd_type_list.x',
	    		  data: ''
	    		}).then(function(response) {
	    			_self.pd_type_list = response.data;
	    			_self.pd_type_1 = _self.pd_type_list[0];
	    			_self.pd_type_2 = _self.pd_type_list[1];
	    			_self.pd_type_3 = _self.pd_type_list[2];
	    			_self.pd_type_4 = _self.pd_type_list[3];
	    			
	    			_self.query_result_list();
	    		});
	    },
	    // 產品類型切換
	    pd_type_change: function(obj) {
	    	var _self = this;
	    	if(obj.other_flag == 'Y' && !_self.pd_type_selected.includes(obj.pkid)) {
	    		_self.pd_type_other = "";
	    		_self.pd_type_other_flag = false;
	    	} else if(obj.other_flag == 'Y' && _self.pd_type_selected.includes(obj.pkid)) {
	    		_self.pd_type_other_flag = true;
	    	}
	    },
	    // 查詢報告結果list
	    query_result_list: function() {
	    	var _self = this;
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX/query_result_list.x',
	    		  data: ''
	    		}).then(function(response) {
	    			_self.result_list = response.data;
	    			
	    			_self.result_1 = _self.result_list[0];
	    			_self.result_2 = _self.result_list[1];
	    			_self.result_3 = _self.result_list[2];
	    			
	    			_self.query_smp_ng_dept_list();
	    		});
	    },
	    // 查詢樣品不合格單位list
	    query_smp_ng_dept_list: function() {
	    	var _self = this;
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX/query_smp_ng_dept_list.x',
	    		  data: ""
	    		}).then(function(response) {
	    			_self.smp_ng_dept_list = response.data;
	    			
	    			_self.query_upload_res_list();
	    		});
	    },
	    // 查詢上傳附檔資料明細list
	    query_upload_res_list: function() {
	    	var _self = this;
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX/query_upload_res_list.x',
	    		  data: ''
	    		}).then(function(response) {
	    			_self.upload_res_list = response.data;
	    			
	    			_self.query_eval_dept_list();
	    		});
	    },
	    // 上傳附檔資料明細切換
	    upload_res_change: function(obj) {
	    	var _self = this;
	    	if(obj.other_flag == 'Y' && !_self.upload_res_selected.includes(obj.pkid)) {
	    		_self.upload_res_other = "";
	    		_self.upload_res_other_flag = false;
	    	} else if(obj.other_flag == 'Y' && _self.upload_res_selected.includes(obj.pkid)) {
	    		_self.upload_res_other_flag = true;
	    	}
	    },
	    // 查詢評估單位list
	    query_eval_dept_list: function() {
	    	var _self = this;
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX/query_eval_dept_list.x',
	    		  data: ''
	    		}).then(function(response) {
	    			_self.eval_dept_list = response.data;
	    			
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
	    			  'rpt_type_no': 'PD'
	    		  }
	    		}).then(function(response) {
	    			_self.au_type_emp_list = response.data;
	    			
	    			if(_self.page_type == 'edit') {
	    				// 頁面類型為編輯類型,查詢根據pkid查詢數據
	    				_self.query_pd_main(_self.pkid);
	    			} else if (_self.page_type == 'rej') {
	    				// 頁面類型為駁回類型
	    				_self.rej_au_path_id = _self.getUrlParam("rej_au_path_id");
	    				_self.rej_au_type_no = _self.getUrlParam("rej_au_type_no");
	    				_self.rej_memo = _self.getUrlParam("rej_memo");
	    				
	    				_self.query_pd_main(_self.pkid);
	    				
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
	    			  'rpt_type_no': 'PD'
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
					'rpt_type_no' : "PD"
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
	    	// 非空判斷
	    	if(_self.mail_dept_selected.length == 0) {
	    		alert("分發單位不能為空");
	    		return;
	    	}
	    	if(_self.eval_type_mstr_selected == '' || _self.eval_type_slv_selected.length == 0 || _self.vendor == ''
	    		|| _self.eval_num_selected == '' || _self.model == '' || _self.hh_no == '' || _self.version == ''
	    		|| _self.mo_no == '' || _self.exec_no == '' || _self.result_selected.length == 0 
	    		|| _self.upload_res_selected.length == 0 || _self.eval_dept_selected == '') {
	    		alert("*號項不能為空");
	    		return;
	    	}
	    	// 判斷多選或單選的其它被選中時，判斷其它項是否為非空
	    	if(_self.eval_type_other == '' && _self.eval_type_other_flag == true) {
	    		alert("評估類別的【其它】項被選中，請填寫具體內容");
	    		return;
	    	}
	    	if(_self.eval_num_other == '' && _self.eval_num_other_flag == true) {
	    		alert("評估次數的【其它】項被選中，請填寫具體內容");
	    		return;
	    	}
	    	if(_self.pd_type_other == '' && _self.pd_type_other_flag == true) {
	    		alert("產品類型（執行單號行後最後一個格子）的【其它】項被選中，請填寫具體內容");
	    		return;
	    	}
	    	if(_self.upload_res_other == '' && _self.upload_res_other_flag == true) {
	    		alert("上傳附檔資料明細的【其它】項被選中，請填寫具體內容");
	    		return;
	    	}
	    	// 結果為條件認可時，限時限量不能為空
	    	if(_self.result_selected == 'CA' 
	    		&& (_self.time_limit == '' || _self.time_limit == null
	    			|| _self.amnt_limit == '' || _self.amnt_limit == null)) {
	    		alert("結果為條件認可時，限時限量不能為空");
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
	    					"rpt_type_no":"PD",
	    					"rpt_id":"",
	    					"list_order":"",
	    					"au_type_no":"PD_AU_0",
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
	    		  url: '/ePDMWeb/ERX_PD/save_data.x',
	    		  data: {
	    			  'page_type': _self.page_type,
	    			  'pkid': _self.pkid,
	    			  'rpt_type_no': _self.rpt_type_no,
	    			  'project_id': _self.project_id,
	    			  'project_name': _self.project_name,
	    			  'factory_zone': _self.factory_zone,
	    			  'rpt_mail_dept_rel_id': _self.rpt_mail_dept_rel_id,//報告分發單位關聯id
	    			  'bill_no': _self.bill_no,
	    			  'rpt_eval_type_mstr_rel_id':_self.rpt_eval_type_mstr_rel_id,//報告評估類別主表關聯id
	    			  'rpt_eval_type_slv_rel_id':_self.rpt_eval_type_slv_rel_id,//報告評估類別子表關聯id
	    			  'eval_type_other': _self.eval_type_other,
	    			  'vendor': _self.vendor,
	    			  'rpt_eval_num_rel_id': _self.rpt_eval_num_rel_id,//報告評估次數表關聯id
	    			  'eval_num_other': _self.eval_num_other,
	    			  'model': _self.model,
	    			  'pd_name': _self.pd_name,
	    			  'check_record': _self.check_record,
	    			  'hh_no': _self.hh_no,
	    			  'test_record': _self.test_record,
	    			  'version': _self.version,
	    			  'mo_no': _self.mo_no,
	    			  'rpt_pd_type_rel_id': _self.rpt_pd_type_rel_id,//報告產品類型表關聯id
	    			  'pd_type_other': _self.pd_type_other,
	    			  'exec_no': _self.exec_no,
	    			  'rpt_result_rel_id': _self.rpt_result_rel_id,//報告結果表關聯id
	    			  'time_limit': _self.time_limit,
	    			  'time_limit_reason': _self.time_limit_reason,
	    			  'amnt_limit': _self.amnt_limit,
	    			  'amnt_limit_reason': _self.amnt_limit_reason,
	    			  'smp_ng_days': _self.smp_ng_days,
	    			  'rpt_smp_ng_dept_rel_id': _self.rpt_smp_ng_dept_rel_id,//報告樣品不合格單位表關聯id
	    			  'smp_ng_tel': _self.smp_ng_tel,
	    			  'hsf_res_1': _self.hsf_res_1,
	    			  'hsf_res_2': _self.hsf_res_2,
	    			  'hsf_res_3': _self.hsf_res_3,
	    			  'hsf_res_4': _self.hsf_res_4,
	    			  'hsf_res_5': _self.hsf_res_5,
	    			  'hsf_res_6': _self.hsf_res_6,
	    			  'hsf_risk': _self.hsf_risk,
	    			  'memo': _self.memo,
	    			  'memo_qe': _self.memo_qe,
	    			  'rpt_upload_res_rel_id': _self.rpt_upload_res_rel_id,//報告上傳附檔資料明細表關聯id
	    			  'upload_res_other': _self.upload_res_other,
	    			  'rpt_eval_dept_rel_id': _self.rpt_eval_dept_rel_id,//報告評估單位表關聯id
	    			  'rpt_file_rel_id': _self.rpt_file_rel_id,//報告文件關聯id
	    			  'au_status': _self.au_status,
	    			  'create_date':'',
	    			  'creator':'',
	    			  'mail_dept_pkid_list': _self.mail_dept_selected,
	    			  'eval_type_mstr_pkid': _self.eval_type_mstr_selected,
	    			  'eval_type_slv_pkid_list': _self.eval_type_slv_selected,
	    			  'eval_num_pkid': _self.eval_num_selected,
	    			  'pd_type_pkid_list': _self.pd_type_selected,
	    			  'result_pkid': _self.result_selected,
	    			  'smp_ng_dept_pkid_list': _self.smp_ng_dept_selected,
	    			  'upload_res_pkid_list': _self.upload_res_selected,
	    			  'eval_dept_pkid': _self.eval_dept_selected,
	    			  'file_list': _self.file_list,
	    			  'au_type_emp_list': _self.au_type_emp_list
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
	    query_pd_main: function(pkid) {
	    	var _self = this;
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX_PD/query_pd_main.x',
	    		  data: {
	    			  'pkid': pkid
	    		  }
	    		}).then(function(response) {
	    			var data = response.data;
	    			
	    			_self.au_status = data.au_status;
	    			_self.mail_dept_selected = data.mail_dept_pkid_list;
	    			_self.bill_no = data.bill_no;
	    			_self.eval_type_mstr_selected = data.eval_type_mstr_pkid;
	    			_self.eval_type_slv_selected = data.eval_type_slv_pkid_list;
	    			_self.eval_type_other = data.eval_type_other;
	    			_self.vendor = data.vendor;
	    			_self.eval_num_selected = data.eval_num_pkid;
	    			_self.eval_num_other = data.eval_num_other;
	    			_self.model = data.model;
	    			_self.pd_name = data.pd_name;
	    			_self.check_record = data.check_record;
	    			_self.hh_no = data.hh_no;
	    			_self.test_record = data.test_record;
	    			_self.version = data.version;
	    			_self.mo_no = data.mo_no;
	    			_self.pd_type_selected = data.pd_type_pkid_list;
	    			_self.pd_type_other = data.pd_type_other;
	    			_self.exec_no = data.exec_no;
	    			_self.result_selected = data.result_pkid;
	    			_self.time_limit = data.time_limit;
	    			_self.time_limit_reason = data.time_limit_reason;
	    			_self.amnt_limit = data.amnt_limit;
	    			_self.amnt_limit_reason = data.amnt_limit_reason;
	    			_self.smp_ng_days = data.smp_ng_days;
	    			_self.smp_ng_tel = data.smp_ng_tel;
	    			_self.smp_ng_dept_selected = data.smp_ng_dept_pkid_list;
	    			_self.hsf_res_1 = data.hsf_res_1;
	    			_self.hsf_res_2 = data.hsf_res_2;
	    			_self.hsf_res_3 = data.hsf_res_3;
	    			_self.hsf_res_4 = data.hsf_res_4;
	    			_self.hsf_res_5 = data.hsf_res_5;
	    			_self.hsf_res_6 = data.hsf_res_6;
	    			_self.hsf_risk = data.hsf_risk;
	    			_self.memo = data.memo;
	    			_self.memo_qe = data.memo_qe;
	    			_self.upload_res_selected = data.upload_res_pkid_list;
	    			_self.upload_res_other = data.upload_res_other;
	    			_self.eval_dept_selected = data.eval_dept_pkid;
	    			_self.au_type_emp_list = data.au_type_emp_list;
	    			_self.file_list = data.file_list;
	    			
	    			// 主表中的關聯id
	    			_self.rpt_mail_dept_rel_id = data.rpt_mail_dept_rel_id;// 報告分發單位關聯id
	    			_self.rpt_eval_type_mstr_rel_id = data.rpt_eval_type_mstr_rel_id;// 報告評估類別主表關聯id
	    			_self.rpt_eval_type_slv_rel_id = data.rpt_eval_type_slv_rel_id;// 報告評估類別子表關聯id
	    			_self.rpt_eval_num_rel_id = data.rpt_eval_num_rel_id;// 報告評估次數表關聯id
	    			_self.rpt_pd_type_rel_id = data.rpt_pd_type_rel_id;// 報告產品類型表關聯id
	    			_self.rpt_result_rel_id = data.rpt_result_rel_id;// 報告結果表關聯id
	    			_self.rpt_smp_ng_dept_rel_id = data.rpt_smp_ng_dept_rel_id;// 報告樣品不合格單位表關聯id
	    			_self.rpt_upload_res_rel_id = data.rpt_upload_res_rel_id;// 報告上傳附檔資料明細表關聯id
	    			_self.rpt_eval_dept_rel_id = data.rpt_eval_dept_rel_id;// 報告評估單位表關聯id
	    			_self.rpt_file_rel_id = data.rpt_file_rel_id;// 報告文件關聯id
	    			
	    			for(var i = 0; i < _self.au_type_emp_list.length; i++) {
	    				var type_bean = _self.au_type_emp_list[i];
	    				
	    				switch (type_bean.au_type_no) {
						case 'PD_AU_0':
							_self.PD_AU_0_list = type_bean.sche_list;
							break;
						case 'PD_AU_1':
							_self.PD_AU_1_list = type_bean.sche_list;
							break;
						case 'PD_AU_2':
							_self.PD_AU_2_list = type_bean.sche_list;
							break;
						case 'PD_AU_3':
							_self.PD_AU_3_list = type_bean.sche_list;
							break;
						case 'PD_AU_4':
							_self.PD_AU_4_list = type_bean.sche_list;
							break;
						case 'PD_AU_5':
							_self.PD_AU_5_list = type_bean.sche_list;
							break;
						case 'PD_AU_6':
							_self.PD_AU_6_list = type_bean.sche_list;
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
	}
});