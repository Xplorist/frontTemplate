var app = new Vue({
	el: '#app',
	data: {
		page_type: '',// 頁面類型，show：查看，au：審核
		rpt_type_no: 'PD',//需保存【非空】
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
		vendor: '',// 需保存【非空】
		eval_num_list: [],
		eval_num_selected: '',// 需保存，【中間表】eval_num_pkid【非空】
		eval_num_other: '',// 需保存【選項為其它時非空】
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
		au_rej_memo: '',// 審核駁回備註
		now_au_path_id: '',// 當前審核路徑id
		now_au_emp_no: '',// 當前審核人工號
		now_au_type_no: '',// 當前審核類型
		PD_AU_0_list: [],// 進度類型：承辦
		PD_AU_1_list: [],// 進度類型：RoHS確認
		PD_AU_2_list: [],// 進度類型：QE確認
		PD_AU_3_list: [],// 進度類型：產工專案主管審核
		PD_AU_4_list: [],// 進度類型：品保主管審核
		PD_AU_5_list: [],// 進度類型：產工處級主管審核
		PD_AU_6_list: []// 進度類型：事業處主管審核
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
			if(_self.page_type == 'show') {
				window.location.href = "ERX_PD_List.html?projectId=" + _self.project_id 
				+ "&projectName=" + _self.project_name;
			} else if(_self.page_type == 'au') {
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
	    			
	    			if(_self.page_type == 'show') {
	    				// 頁面類型為展示類型,查詢根據pkid查詢數據
	    				_self.query_pd_main(_self.pkid);
	    			} else if(_self.page_type == 'au') {
	    				// 頁面類型為審核類型,查詢根據pkid查詢數據
	    				_self.now_au_path_id = _self.getUrlParam("au_path_id");
	    				_self.now_au_emp_no = _self.getUrlParam("emp_no");
	    				_self.now_au_type_no = _self.getUrlParam("au_type_no");
	    				_self.query_pd_main(_self.pkid);
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
	    		});
	    },
	    // 打開駁回模態框
	    open_rej_modal: function() {
	    	var _self = this;
	    	_self.au_rej_memo = "";
	    	$("#au_rej_modal").modal("show");
	    },
	    // 審核通過
	    au_pass: function() {
	    	var _self = this;
	    	var confirm_flag = confirm("確定通過？");
	    	if(!confirm_flag) {
	    		return;
	    	}
	    	
	    	if(_self.now_au_type_no == 'PD_AU_1') {
	    		if(_self.hsf_res_1 == '' || _self.hsf_res_1 == null
	    			||_self.hsf_res_2 == '' || _self.hsf_res_2 == null
	    			|| _self.hsf_res_3 == '' || _self.hsf_res_3 == null
	    			|| _self.hsf_res_4 == '' || _self.hsf_res_4 == null
	    			|| _self.hsf_res_5 == '' || _self.hsf_res_5 == null
	    			|| _self.hsf_res_6 == '' || _self.hsf_res_6 == null
	    			|| _self.hsf_risk == '' || _self.hsf_risk == null) {
	    			alert("您是【RoHS確認】的審核主管，請填寫【HSF資料確認】和【HSF風險評估】內容");
	    			return;
	    		}
	    		
	    		// 更新hsf的數據 
	    		axios({
	    			  method: 'post',
	    			  url: '/ePDMWeb/ERX_PD/update_hsf_data.x',
	    			  data: {
	    				  'pkid': _self.pkid,
	    				  'hsf_res_1': _self.hsf_res_1,
	    				  'hsf_res_2': _self.hsf_res_2,
	    				  'hsf_res_3': _self.hsf_res_3,
	    				  'hsf_res_4': _self.hsf_res_4,
	    				  'hsf_res_5': _self.hsf_res_5,
	    				  'hsf_res_6': _self.hsf_res_6,
	    				  'hsf_risk': _self.hsf_risk
	    			  }
	    			}).then(function(response) {
	    				var data = response.data;
	    				if(data == '1') {
	    					_self.au_pass_req();
	    				} else if(data == '0') {
	    					alert("更新HSF數據失敗");
	    				}
	    			});
	    	} else if(_self.now_au_type_no == 'PD_AU_2') {
	    		if(_self.memo_qe == '' || _self.memo_qe == null) {
	    			alert("你是【QE確認】的審核主管，請填寫【備註（QE）】內容");
	    			return;
	    		}
	    		
	    		// 更新qe備註數據
	    		axios({
	    			  method: 'post',
	    			  url: '/ePDMWeb/ERX_PD/update_qe_memo.x',
	    			  data: {
	    				  'pkid': _self.pkid,
	    				  'memo_qe': _self.memo_qe
	    			  }
	    			}).then(function(response) {
	    				var data = response.data;
	    				if(data == '1') {
	    					_self.au_pass_req();
	    				} else if(data == '0') {
	    					alert("更新QE備註失敗");
	    				}
	    			});
	    	} else {
	    		_self.au_pass_req();
	    	}
	    },
	    // 審核通過請求
	    au_pass_req: function() {
	    	var _self = this;
	    	var param = {
	    			'p_in_rpt_type_no': _self.rpt_type_no,
	    			'p_in_opt_type': '1',// 0：提交，1：通過，2：駁回
	    			'p_in_main_pkid': _self.pkid,
	    			'p_in_path_pkid': _self.now_au_path_id,
	    			'p_in_opt_emp_no': _self.now_au_emp_no,
	    			'p_in_rej_memo': ''
	    	};
	    	
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX_PD/submit_data.x',
	    		  data: param
	    		}).then(function(response) {
	    			var data = response.data;
	    			
	    			if(data.p_out_result_flag == '-1') {
	    				alert("審核通過失敗！" + data.p_out_result_text);
	    				return;
	    			} else if(data.p_out_result_flag == '1') {
	    				alert("審核通過成功");
	    				_self.goBack();
	    			} else if(data.p_out_result_flag == '3') {
	    				alert("審核完成，已給分發單位人員發送了通知郵件");
	    				_self.goBack();
	    			}
	    		});
	    },
	    // 審核駁回
	    au_rej: function() {
	    	var _self = this;
	    	
	    	if(_self.au_rej_memo == '') {
	    		alert("請填寫駁回原因");
	    		return;
	    	}
	    	
	    	var param = {
	    			'p_in_rpt_type_no': _self.rpt_type_no,
	    			'p_in_opt_type': '2',// 0：提交，1：通過，2：駁回
	    			'p_in_main_pkid': _self.pkid,
	    			'p_in_path_pkid': _self.now_au_path_id,
	    			'p_in_opt_emp_no': _self.now_au_emp_no,
	    			'p_in_rej_memo': _self.au_rej_memo
	    	};
	    	
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX_PD/submit_data.x',
	    		  data: param
	    		}).then(function(response) {
	    			var data = response.data;
	    			
	    			if(data.p_out_result_flag == '-1') {
	    				alert("審核駁回失敗！" + data.p_out_result_text);
	    				return;
	    			} else if(data.p_out_result_flag == '2') {
	    				alert("審核駁回成功");
	    				_self.goBack();
	    			}
	    		});
	    }
	},
	created: function() {
		var _self = this;
		_self.project_id = _self.getUrlParam("project_id");
		_self.project_name = _self.getUrlParam("project_name");
		_self.page_type = _self.getUrlParam("page_type");// show:查看，au：審核
		_self.pkid = _self.getUrlParam("pkid");
		
		// 由於多個請求並發會導致後台出錯，所以多選框，單選框這類數據
		// 的請求採用鏈式請求，從查詢分發單位開始
		_self.query_mail_dept_list();
	}
});