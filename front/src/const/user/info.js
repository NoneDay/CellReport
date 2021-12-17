export default {
  column: [{
    label: '个人信息',
    prop: 'info',
    option: {
      submitText: '修改',
      size: 'small',
      labelWidth: 60,
      column: [{
        label: '头像',
        type: 'upload',
        listType: 'picture-img',
        propsHttp: {
          res: 'data.0'
        },
        canvasOption: {
          text: 'avue',
          ratio: 0.1
        },
        action: 'https://avueupload.91eic.com/upload/list',
        tip: '只能上传jpg/png用户头像，且不超过500kb',
        span: 16,
        prop: 'img'
      }, {
        label: '姓名',
        span: 12,
        prop: 'name'
      }, {
        label: '邮箱',
        row: true,
        span: 12,
        prop: 'yx'

      }, {
        label: '描述',
        type: 'textarea',
        span: 24,
        prop: 'ms'
      }, {
        label: '公司',
        prop: 'gs',
        span: 8,
      }, {
        label: '部门',
        span: 8,
        prop: 'bm'
      }, {
        label: '职位',
        span: 8,
        prop: 'zw'
      }, {
        label: '地址',
        span: 24,
        prop: 'dz'
      }, {
        label: '标签',
        span: 24,
        type: 'select',
        multiple: true,
        prop: 'bq',
        dicData: [{
          label: '善解人意',
          value: 1
        }, {
          label: '开朗乐观',
          value: 2
        }, {
          label: '真诚热情',
          value: 3
        }, {
          label: '心地善良',
          value: 4
        }, {
          label: '谦恭有礼',
          value: 5
        }, {
          label: '彬彬有礼',
          value: 6
        }]
      }]
    }
  }, {
    label: '修改密码',
    prop: 'password',
    option: {
      labelWidth: 70,
      size: 'small',
      submitText: '修改',
      column: [{
        label: '原密码',
        span: 16,
        row: true,
        type: 'password',
        prop: 'oldpassword'
      }, {
        label: '新密码',
        span: 16,
        row: true,
        type: 'password',
        prop: 'newpassword'
      }, {
        label: '确认密码',
        span: 16,
        row: true,
        type: 'password',
        prop: 'newpasswords'
      }]
    }
  }]
}