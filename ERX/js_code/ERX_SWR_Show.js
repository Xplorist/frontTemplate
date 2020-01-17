var app = new Vue({
    el: '#app',
    data: {
        pkid: '',
        page_type: '', // 頁面類型，add:新增，edit：編輯，rej:駁回後提交
        au_status: '0', // 需保存【非空】
        rpt_type_no: 'SWR', // 需保存【非空】
        project_id: '', // 需保存【非空】
        project_name: '', // 需保存【非空】
        factory_zone: '', // 需保存【非空】
        mail_dept_list: [],
        mail_dept_list_array: [],
        mail_dept_selected: [], // 需保存,【中間表】mail_dept_pkid_list【非空】
        bill_no: '', // 需保存

        req_dept: '', // 需求提出單位
        exec_phase: '', // 執行階段
        bill_phase_1: '', // 表單階段一
        bill_phase_2: '', // 表單階段二
        target: '', // 目的
        req_dept_emp: '', // 需求部門人員
        req_desc: '', // 需求說明
        model_name: '', // 機種名稱
        project_code: '', // 專案代碼
        project_code_ver: '', // 專案代碼版次
        theme: '', // 主旨
        exec_dept: '', // 執行單位
        req_date: '', // 需求日期
        swr_type: '', // swr類型
        swr_type_other: '', // swr類型其它值
        valid_period: '', // 有效期
        content: '', // 內容

        maker_info: { "emp_no": "", "emp_name": "" },
        au_type_emp_list: [], // 需保存，審核類型list（包含審核路徑list，審核人list）
        modal_au_type_no: '',
        modal_au_type_name: '',
        modal_au_emp_list: [],
        modal_au_emp_list_selected: [],
        isLastChecked: 'N',
        file_list: [], // 需保存，文件list
        rpt_mail_dept_rel_id: '', // 報告分發單位關聯id

        rpt_file_rel_id: '', // 報告文件關聯id
        SWR_AU_0_list: [], // 進度類型：承辦
        SWR_AU_1_list: [], // 進度類型：SWR管理員審核
        SWR_AU_2_list: [], // 進度類型：提出單位主管審核
        SWR_AU_3_list: [], // 進度類型：工程/品保/執行單位審核
        SWR_AU_4_list: [], // 進度類型：產品處單位主管核准1
        SWR_AU_5_list: [], // 進度類型：產品處單位主管核准2
        rej_au_path_id: '', // 駁回審核路徑id
        rej_au_type_no: '', // 駁回審核類型編號
        rej_memo: '', // 駁回備註
        au_rej_memo: '',
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
            if (_self.page_type == 'show') {
                window.location.href = "ERX_SWR_List.html?projectId=" + _self.project_id +
                    "&projectName=" + _self.project_name;
            } else if (_self.page_type == 'au') {
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
                for (var i = 0; i < list.length; i++) {
                    array.push(list[i]);
                    if ((i + 1) % 6 == 0) {
                        result.push(array);
                        array = [];
                    } else if (i == list.length - 1) {
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
                _self.au_type_emp_list = response.data;

                if (_self.page_type == 'show') {
                    // 頁面類型為展示類型,查詢根據pkid查詢數據
                    _self.query_swr_main(_self.pkid);
                } else if (_self.page_type == 'au') {
                    // 頁面類型為審核類型,查詢根據pkid查詢數據
                    _self.now_au_path_id = _self.getUrlParam("au_path_id");
                    _self.now_au_emp_no = _self.getUrlParam("emp_no");
                    _self.now_au_type_no = _self.getUrlParam("au_type_no");
                    _self.query_swr_main(_self.pkid);
                }
            });
        },
        // 下載文件
        download_file: function(obj) {
            $.fileDownload('/ePDMWeb/FileUpDown/FileDownloadAction.action', {
                httpMethod: "POST",
                data: {
                    'fileName': obj.file_save_name,
                    'filePath': obj.file_save_path
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
                // todo2
                console.log(data)
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
                _self.rpt_mail_dept_rel_id = data.rpt_mail_dept_rel_id; // 報告分發單位關聯id
                _self.rpt_file_rel_id = data.rpt_file_rel_id; // 報告文件關聯id

                for (var i = 0; i < _self.au_type_emp_list.length; i++) {
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
            if (!confirm_flag) {
                return;
            }
            _self.au_pass_req();
    },
    // 審核通過請求
    au_pass_req: function() {
        var _self = this;
        var param = {
            'p_in_rpt_type_no': _self.rpt_type_no,
            'p_in_opt_type': '1', // 0：提交，1：通過，2：駁回
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

            if (data.p_out_result_flag == '-1') {
                alert("審核通過失敗！" + data.p_out_result_text);
                return;
            } else if (data.p_out_result_flag == '1') {
                alert("審核通過成功");
                _self.goBack();
            } else if (data.p_out_result_flag == '3') {
                alert("審核完成，已給分發單位人員發送了通知郵件");
                _self.goBack();
            }
        });
    },
    // 審核駁回
    au_rej: function() {
        var _self = this;

        if (_self.au_rej_memo == '') {
            alert("請填寫駁回原因");
            return;
        }

        var param = {
            'p_in_rpt_type_no': _self.rpt_type_no,
            'p_in_opt_type': '2', // 0：提交，1：通過，2：駁回
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

            if (data.p_out_result_flag == '-1') {
                alert("審核駁回失敗！" + data.p_out_result_text);
                return;
            } else if (data.p_out_result_flag == '2') {
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
    _self.page_type = _self.getUrlParam("page_type"); // show
    _self.pkid = _self.getUrlParam("pkid");

    // 由於多個請求並發會導致後台出錯，所以多選框，單選框這類數據
    // 的請求採用鏈式請求，從查詢分發單位開始
    _self.query_mail_dept_list();
},
watch: {

}
});