var app = new Vue({
	el: '#app',
	data: {
		page_type: '',// 頁面類型，show：查看，au：審核
		pkid: '', // 主鍵id（由後台java函數生成）
		rpt_type_no: 'CS', // 報告類型編號
		ac_re_flag: 'AC',	// 報告類型標誌（ac，re）
		project_id: '', // 專案id
		project_name: '', // 專案名稱
		factory_zone: '', // 廠區
		bill_no: '', // 執行單編號
		
		// ----評估類別----
		eval_type_list: [], // 模擬[後台查詢]回來的 分發單位 數據
		eval_type_other: '', // 評估類別其它值
		
		vendor: '',	// 廠商
		eval_num: '', // 評估次數（單選）
		eval_num_other: '', // 評估次數其它值
		model: '', // 機種
		pd_name: '', // 產品名稱
		req_dept: '', // 需求提出單位
		hh_no: '', // 鴻海料號
		eval_reason: '', // 評估原因
		version: '', // 版次
		eval_done_vendor_num: '', // 已評估廠家數量
		
		// ----產品類型----
		pd_type_pkid_list: [], // 產品類型：pd_type_pkid_list
		pd_type_other: '',	// 產品類型其它值
		
		exec_no: '',// 執行單號
		result: '完全認可 Fully Approved',	// 結果（單選）
		resultID: '0', // 0,1,2 [不傳]
		time_limit: '',	// 限時
		time_limit_reason: '',	// 限時原因
		amnt_limit: '',// 限量
		amnt_limit_reason: '',// 限量原因

		// ----樣品不合格----
		smp_ng_days: '', //	樣品不合格送樣天數
		smp_ng_dept_pkid_list: [],
		
		smp_ng_tel: '', // 樣品不合格電話

		hsf_res_1: '', // 環保保證書epw（新產品開發商）
		hsf_res_2: '', // 環境管理物質成分分析展開表（新開發廠商）
		hsf_res_3: '', // rohs
		hsf_res_4: '', // hf（非金屬材料）
		hsf_res_5: '', // 其它
		hsf_res_6: '', // 樣品滿足客戶環保需求
		hsf_risk: '', // hsf風險評估
		memo: '', // 備註
		memo_qe: '', // 備註qe
		eval_dept: '', // 評估單位（單選）
		au_status: '0',// 審核狀態0:未提交，1：審核中，2：審核完成)
		create_date: '', //	創建時間
		creator: '', // 創建人
		mail_dept_selected: [],// 分發單位：mail_dept_pkid_list
		eval_type_selected: [],// 評估類別：eval_type_pkid_list
		pd_type_selected: [], // 產品類型：pd_type_pkid_list
		smp_ng_dept_selected: [], // 樣品不合格：smp_ng_dept_pkid_list
		file_list: [],// 文件list
		au_type_emp_list: [],// 審核類型list（包含審核路徑list，審核人list）
		
		mail_dept_list: [],
		mail_dept_list_array: [],
		smp_ng_dept_list: [],
		
		eval_type_other_flag: false,
		eval_num_other_flag: false,
		pd_type_list: [],
		pd_type_selected: [],// 需保存，【中間表】pd_type_pkid_list
		pd_type_other: '', // 需保存【選項為其它時非空】
		pd_type_other_flag: false,
		maker_info: {"emp_no": "", "emp_name": ""},
		modal_au_type_no: '',
		modal_au_type_name: '',
		modal_au_emp_list: [],
		modal_au_emp_list_selected: [],
		isLastChecked: 'N',
		au_rej_memo: '',// 審核駁回備註
		now_au_path_id: '',// 當前審核路徑id
		now_au_emp_no: '',// 當前審核人工號
		now_au_type_no: '',// 當前審核類型
		CS_AU_0_list: [],// 進度類型：承辦
		CS_AU_1_list: [],// 進度類型：RoHS確認
		CS_AU_2_list: [],// 進度類型：QE確認
		CS_AU_3_list: [],// 進度類型：產工專案主管審核
		CS_AU_4_list: [],// 進度類型：品保主管審核
		CS_AU_5_list: [],// 進度類型：產工處級主管審核
		CS_AU_6_list: [],// 進度類型：事業處主管審核
		CS_AU_7_list: [],// 進度類型：事業處主管審核
		CS_AU_8_list: [],// 進度類型：事業處主管審核
		CS_AU_9_list: [],// 進度類型：事業處主管審核
		rpt_mail_dept_rel_id: '', // 報告分發單位表關聯id
		rpt_eval_type_rel_id: '',// 報告評估類別主表關聯id
		rpt_pd_type_rel_id: '',// 報告產品類型表關聯id
		rpt_smp_ng_dept_rel_id: '',// 報告樣品不合格單位表關聯id
		rpt_file_rel_id: '',// 報告文件關聯id
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
			if(_self.page_type == 'show') {
				window.location.href = "ERX_CS_List.html?projectId=" + _self.project_id 
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
					  'rpt_type_no': 'CS'
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
	    			  'rpt_type_no': 'CS'
	    		  }
	    		}).then(function(response) {
	    			_self.eval_type_list = response.data;
	    			
	    			_self.query_pd_type_list();
	    		});
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
	    			  'rpt_type_no': 'CS',
	    			  'ac_re_flag': _self.ac_re_flag
	    		  }
	    		}).then(function(response) {
	    			_self.au_type_emp_list = response.data;
	    			
	    			if(_self.page_type == 'show') {
	    				// 頁面類型為展示類型,查詢根據pkid查詢數據
	    				_self.query_cs_main(_self.pkid);
	    			} else if(_self.page_type == 'au') {
	    				// 頁面類型為審核類型,查詢根據pkid查詢數據
	    				_self.now_au_path_id = _self.getUrlParam("au_path_id");
	    				_self.now_au_emp_no = _self.getUrlParam("emp_no");
	    				_self.now_au_type_no = _self.getUrlParam("au_type_no");
	    				_self.query_cs_main(_self.pkid);
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
	    query_cs_main: function(pkid) {
	    	var _self = this;
	    	
	    	axios({
	    		  method: 'post',
	    		  url: '/ePDMWeb/ERX_CS/query_cs_main.x',
	    		  data: {
	    			  'pkid': pkid
	    		  }
	    		}).then(function(response) {
	    			var data = response.data;
	    			
	    			_self.au_status = data.au_status;
	    			_self.mail_dept_selected = data.mail_dept_pkid_list;
	    			_self.bill_no = data.bill_no;
	    			_self.eval_type_selected = data.eval_type_pkid_list;
	    			_self.eval_type_other = data.eval_type_other;
	    			_self.vendor = data.vendor;
	    			_self.eval_num = data.eval_num;
	    			_self.eval_num_other = data.eval_num_other;
	    			_self.model = data.model;
	    			_self.pd_name = data.pd_name;
	    			_self.req_dept = data.req_dept;
	    			_self.hh_no = data.hh_no;
	    			_self.eval_reason = data.eval_reason;
	    			_self.version = data.version;
	    			_self.eval_done_vendor_num = data.eval_done_vendor_num;
	    			_self.pd_type_selected = data.pd_type_pkid_list;
	    			_self.pd_type_other = data.pd_type_other;
	    			_self.exec_no = data.exec_no;
	    			_self.result = data.result;
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
	    			_self.eval_dept = data.eval_dept;
	    			_self.au_type_emp_list = data.au_type_emp_list;
	    			_self.file_list = data.file_list;
	    			
	    			// 主表中的關聯id
	    			_self.rpt_mail_dept_rel_id = data.rpt_mail_dept_rel_id;// 報告分發單位關聯id
	    			_self.rpt_eval_type_rel_id = data.rpt_eval_type_rel_id;// 報告評估類別主表關聯id
	    			_self.rpt_pd_type_rel_id = data.rpt_pd_type_rel_id;// 報告產品類型表關聯id
	    			_self.rpt_smp_ng_dept_rel_id = data.rpt_smp_ng_dept_rel_id;// 報告樣品不合格單位表關聯id
	    			_self.rpt_file_rel_id = data.rpt_file_rel_id;// 報告文件關聯id
	    			
	    			for(var i = 0; i < _self.au_type_emp_list.length; i++) {
	    				var type_bean = _self.au_type_emp_list[i];
	    				
	    				switch (type_bean.au_type_no) {
						case 'CS_AU_0':
							_self.CS_AU_0_list = type_bean.sche_list;
							break;
						case 'CS_AU_1':
							_self.CS_AU_1_list = type_bean.sche_list;
							break;
						case 'CS_AU_2':
							_self.CS_AU_2_list = type_bean.sche_list;
							break;
						case 'CS_AU_3':
							_self.CS_AU_3_list = type_bean.sche_list;
							break;
						case 'CS_AU_4':
							_self.CS_AU_4_list = type_bean.sche_list;
							break;
						case 'CS_AU_5':
							_self.CS_AU_5_list = type_bean.sche_list;
							break;
						case 'CS_AU_6':
							_self.CS_AU_6_list = type_bean.sche_list;
							break;
						case 'CS_AU_7':
							_self.CS_AU_7_list = type_bean.sche_list;
							break;
						case 'CS_AU_8':
							_self.CS_AU_8_list = type_bean.sche_list;
							break;
						case 'CS_AU_9':
							_self.CS_AU_9_list = type_bean.sche_list;
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
	    	
	    	if(_self.now_au_type_no == 'CS_AU_2') {
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
	    			  url: '/ePDMWeb/ERX_CS/update_hsf_data.x',
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
	    	} else if(_self.now_au_type_no == 'CS_AU_4') {
	    		if(_self.memo_qe == '' || _self.memo_qe == null) {
	    			alert("你是【QE確認】的審核主管，請填寫【備註（QE）】內容");
	    			return;
	    		}
	    		
	    		// 更新qe備註數據
	    		axios({
	    			  method: 'post',
	    			  url: '/ePDMWeb/ERX_CS/update_qe_memo.x',
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