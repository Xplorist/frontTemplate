var app = new Vue({
	el: '#app',
	data: {
		RPT_type_selected: '',
		RPT_type_list: [],
		dept_name_input: '',
		dept_list: [],
		dept_no_selected: '',
		dept_name_selected: '',
		emp_no_input: '',
		emp_name_input: '',
		emp_email_input: '',
		emp_list: []
	},
	methods: {
		// 查詢報告類型list
		query_RPT_type_list: function() {
			var _self = this;
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/query_RPT_type_list.x',
				  data: ''
				}).then(function(response) {
					_self.RPT_type_list = response.data;
				});
		},
		// 新增分發單位
		add_dept: function() {
			var _self = this;
			if(_self.RPT_type_selected == '') {
				alert("請先選擇報告類型");
				return;
			}
			if(_self.dept_name_input == '') {
				alert("單位名稱不能為空");
				return;
			}
			
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/add_dept.x',
				  data: {
					  'rpt_type_no': _self.RPT_type_selected,
					  'mail_dept_name': _self.dept_name_input
				  }
				}).then(function(response) {
					var data = response.data;
					if(data == '0') {
						alert("新增失敗");
					} else if(data == '-1') {
						alert("此分發單位在本報告類型中已存在！");
						_self.dept_name_input = '';
					} else{
						alert("新增成功");
						_self.dept_name_input = '';
						// 成功後查詢
						_self.query_mail_dept_list();
					}
				});
		},
		// 查詢分發單位
		query_mail_dept_list: function() {
			var _self = this;
			if(_self.RPT_type_selected == '') {
				alert("請先選擇報告類型");
				return;
			}
			
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/query_mail_dept_list.x',
				  data: {
					  'rpt_type_no': _self.RPT_type_selected
				  }
				}).then(function(response) {
					_self.dept_list = response.data;
				});
		},
		// 選中分發單位
		dept_click: function(obj) {
			var _self = this;
			_self.dept_no_selected = obj.pkid;
			_self.dept_name_selected = obj.mail_dept_name;
			// 選中分發單位後查詢單位人員
			_self.query_mail_emp_list();
		},
		// 刪除分發單位
		delete_dept: function() {
			var _self = this;
			if(_self.dept_no_selected == '') {
				alert("請先選擇分發單位");
				return;
			}
			var confirm_flag = confirm("確定刪除此分發單位及與其關聯的人員？");
			if(!confirm_flag) {
				return;
			}
			
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/delete_dept.x',
				  data: {
					  'pkid': _self.dept_no_selected
				  }
				}).then(function(response) {
					var data = response.data;
					if(data == '0') {
						alert("刪除失敗");
					} else {
						alert("刪除成功");
						_self.dept_no_selected = '';
						_self.dept_name_selected = '';
						// 成功後查詢
						_self.query_mail_dept_list();
						_self.emp_list = [];
					}
				});
		},
		// 根據輸入的工號查詢姓名
		query_emp_name: function() {
			var _self = this;
			if(_self.emp_no_input == '') {
				return;
			}
			var regExp = /^[A-Z]{1}[0-9]{7}$/g;// eg：C3005579
			var regExp_1 = /^[0-9]{5}$/g;// eg: 10747
			var reg_flag = regExp.test(_self.emp_no_input);
			var reg_flag_1 = regExp_1.test(_self.emp_no_input);
			if(!reg_flag && !reg_flag_1) {
				alert("請輸入工號！");
				_self.emp_no_input = '';
				return;
			}
			
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/query_emp_name.x',
				  data: {
					  'emp_no': _self.emp_no_input
				  }
				}).then(function(response) {
					var data = response.data;
					var emp_name = data.emp_name;
					var emp_email = data.emp_email;
					if(emp_name == '' || emp_name == null) {
						alert("查無此人！");
					} else {
						_self.emp_name_input = emp_name;
						_self.emp_email_input = emp_email;
						_self.add_mail_emp();
					}
				});
		},
		// 新增分發單位員工
		add_mail_emp: function() {
			var _self = this;
			if(_self.dept_no_selected == '') {
				alert("請先選擇分發單位");
				return;
			}
			
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/add_mail_emp.x',
				  data: {
					  'rpt_type_no': _self.RPT_type_selected,
					  'mail_dept_id': _self.dept_no_selected,
					  'emp_no': _self.emp_no_input,
					  'emp_name': _self.emp_name_input,
					  'emp_email': _self.emp_email_input
				  } 
				}).then(function(response) {
					var data = response.data;
					if(data == '0') {
						alert("新增失敗");
					} else if(data == '-1') {
						alert("該人員在此報告類型的此分發單位中已存在");
						_self.emp_no_input = '';
						_self.emp_name_input = '';
						_self.emp_email_input = '';
					} else {
						alert("新增成功");
						_self.emp_no_input = '';
						_self.emp_name_input = '';
						_self.emp_email_input = '';
						// 成功後查詢
						_self.query_mail_emp_list();
					}
				});
		},
		// 查詢分發單位的人員
		query_mail_emp_list: function() {
			var _self = this;
			if(_self.dept_no_selected == '') {
				alert("請先選擇分發單位");
				return;
			}
			
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/query_mail_emp_list.x',
				  data: {
					  'rpt_type_no': _self.RPT_type_selected,
					  'mail_dept_id': _self.dept_no_selected
				  }
				}).then(function(response) {
					_self.emp_list = response.data;
				});
		},
		// 刪除分發單位人員
		delete_emp: function(pkid) {
			var _self = this;
			var confirm_flag = confirm("確認刪除此人員？");
			if(!confirm_flag) {
				return;
			}
			
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/delete_emp.x',
				  data: {
					  'pkid': pkid
				  }
				}).then(function(response) {
					var data = response.data;
					if(data == '0') {
						alert("刪除失敗");
					} else {
						alert("刪除成功");
						// 成功後查詢
						_self.query_mail_emp_list();
					}
				});
		}
	},
	created: function() {
		var _self = this;
		_self.query_RPT_type_list();
	}
});

window.onload = function() {
    var tb_container1 = document.querySelector('#tb_container1');
    var tb_container2 = document.querySelector('#tb_container2');
    function scrollHandle(e) {
        //console.log(this);
        var scrollTop = this.scrollTop;
        this.querySelector('thead').style.transform = 'translateY(' + scrollTop + 'px)';
    }
 
    tb_container1.addEventListener('scroll', scrollHandle);
    tb_container2.addEventListener('scroll', scrollHandle);
}