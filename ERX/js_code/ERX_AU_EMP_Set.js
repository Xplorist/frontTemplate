var app = new Vue({
	el: '#app',
	data: {
		RPT_type_list: [],
		RPT_type_selected: '',
		AU_type_list: [],
		AU_type_selected: '',
		emp_no_input: '',
		emp_name_input: '',
		au_emp_list: []
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
		// 查詢審核類型list
		query_AU_type_list: function() {
			var _self = this;
			_self.AU_type_selected = '';
			
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/query_AU_type_list.x',
				  data: {
					  'rpt_type_no': _self.RPT_type_selected
				  }
				}).then(function(response) {
					_self.AU_type_list = response.data;
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
					if(emp_name == '' || emp_name == null) {
						alert("查無此人！");
					} else {
						_self.emp_name_input = emp_name;
						_self.addEmp();
					}
				});
		},
		// 新增人員
		addEmp: function() {
			var _self = this;
			if(_self.AU_type_selected == '') {
				alert("請先選擇審核類型");
				return;
			}
			
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/addEmp.x',
				  data: {
					  'rpt_type_no': _self.RPT_type_selected,
					  'au_type_no': _self.AU_type_selected,
					  'emp_no': _self.emp_no_input,
					  'emp_name': _self.emp_name_input
				  }
				}).then(function(response) {
					var result = response.data;
					if(result == "0") {
						alert("新增失敗");
					} else if(result == "-1") {
						alert("該人員已存在");
						_self.emp_no_input = '';
						_self.emp_name_input = '';
					} else if(result == "1") {
						alert("新增成功");
						_self.emp_no_input = '';
						_self.emp_name_input = '';
						// 新增成功後查詢
						_self.query_emp_list();
					}
				});
		},
		// 根據報告類型審核類型查詢人員list
		query_emp_list: function() {
			var _self = this;
			
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/query_emp_list.x',
				  data: {
					  'rpt_type_no': _self.RPT_type_selected,
					  'au_type_no': _self.AU_type_selected
				  }
				}).then(function(response) {
					_self.au_emp_list = response.data;
				});
		},
		// 刪除人員
		deleteEmp: function(pkid) {
			var confirm_flag = confirm("確認刪除？");
			if(!confirm_flag) {
				return;
			}
			
			var _self = this;
			axios({
				  method: 'post',
				  url: '/ePDMWeb/ERX/deleteEmp.x',
				  data: {
					  'pkid': pkid
				  }
				}).then(function(response) {
					var result = response.data;
					if(result == "0") {
						alert("刪除失敗");
					} else {
						alert("刪除成功");
						_self.query_emp_list();
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
    var tableCont = document.querySelector('#tb_container');
    function scrollHandle(e) {
        //console.log(this);
        var scrollTop = this.scrollTop;
        this.querySelector('thead').style.transform = 'translateY(' + scrollTop + 'px)';
    }
 
    tableCont.addEventListener('scroll', scrollHandle);
}