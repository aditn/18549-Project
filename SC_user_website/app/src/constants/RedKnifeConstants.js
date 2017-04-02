const _CONST = {
    baseUrl: 'http://aio.digitwalk.com',
    deviceStoreColumns: [{
      column: 'id',
      label: 'id',
      isEditable: false
    }, {
      column: 'sku',
      label: 'sku',
      isEditable: false
    }, {
      column: 'serialNum',
      label: '序列号',
      isEditable: false
    }, {
      column: 'mac',
      label: 'MAC地址',
      isEditable: false
    }, {
      column: 'model',
      label: '型号',
      isEditable: false
    }, {
      column: 'inventoryId',
      label: 'inventoryId',
      isEditable: false
    }, {
      column: 'ssid',
      label: 'ssid',
      isEditable: true
    }, {
      column: 'serverIp',
      label: '服务器地址',
      isEditable: true
    }, {
      column: 'serverPort',
      label: '端口',
      isEditable: true
    }, {
      column: 'dbm',
      label: '场强',
      isEditable: true
    }, {
      column: 'storeLocation',
      label: '店铺',
      isEditable: true
    }],
    // Use this for jquery to detect animation end. If you decide to use other
    // animation, just remove this
    animationEnd: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',

    // used to distinguish message types
    msgType: {
      error: 'error',
      warn: 'warn',
      success: 'success',
      info: 'info'
    },

    defaultUser: {
      name: 'Benson zhang',
      type: 'admin',
      profilePic: 'http://tp4.sinaimg.cn/1935710947/180/5736925674/1',
      brand: 'Phillip',
      cur_project: '',
      all_project: [''],
      brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Philips_logo_new.svg/1000px-Philips_logo_new.svg.png',
      token: '12345678910'
    },

    customerType: {
      // The customer types, number represend their id
      newUser: '0',
      hypoActiveUser: '1',
      activeUser: '15',
      hyperActiveUser: '2',
      employee: '4',
      other: '3'
    },

    customerColors: {
      newUser: '#6beaff', //light blue
      hypoActiveUser: '#fcc567', //light orange
      activeUser: '#f96b2d', //red orange
      hyperActiveUser: '#e03e27', //red-ish
      employee: '#244f6a', //navy blue
      other: '#efefef', //grey
      extra: '#1f77b4' //dark blue
    },

    customerSettingTableEditables: [
      'period', 'frequency', 'dwelltime'
    ],

    scaleOptions: {
      week: {
        name: 'week',
        label: 'Week'
      },
      month: {
        name: 'month',
        label: 'Month'
      },
      trimonth: {
        name: 'trimonth',
        label: '3 months'
      },
      year: {
        name: 'year',
        label: 'Year'
      }
    },

    defaultScaleOption: {
      name: 'week',
      label: 'Week'
    },

    dotComparisionOptions: {
      totalPv: {
        name: 'totalPv',
        label: '入店量(人次)'
      },
      totalUv: {
        name: 'totalUv',
        label: '入店人数(人数)'
      },
      inStorePv: {
        name: 'inStorePv',
        label: '客流量(人次)'
      },
      ipv_ratio: {
        name: 'ipv_ratio',
        label: '入店率(%)'
      },
      dw: {
        name: 'dw',
        label: '平均驻店时长(秒)'
      },
      vPeriod: {
        name: 'vPeriod',
        label: '来访周期(天/次)'
      },
      oc: {
        name: 'oc',
        label: '老顾客(人次)'
      },
      oc_ratio: {
        name: 'oc_ratio',
        label: '老顾客占比(%)'
      },
      nc: {
        name: 'nc',
        label: '新顾客(人次)'
      },
      nc_ratio: {
        name: 'nc_ratio',
        label: '新顾客占比(%)'
      }
    },

    translation: {
      'dw': '驻留时间',
      'dayPv': '日人次',
      'period': '周期',
      'dwelltime': '停留时间',
      'frequency': '频率'
    },

    dateFormat: 'YYYYMMDD',

    overviewFlowTendencyOption: {
      axisX: {
        position: 'end',
        labelOffset: {
          x: -10,
          y: 0
        },
        showGrid: true,
        showLabel: true,
        offset: 30,
        showCenterLine: false
      },
      axisY: {
        position: 'start',
        type: undefined,
        scaleMinSpace: 50,
        // Use only integer values (whole numbers) for the scale steps
        onlyInteger: false,
        labelOffset: {
          x: 0,
          y: 0
        },
        showGrid: true,
        showLabel: true,
        offset: 30,
        showCenterLine: false,
        labelInterpolationFnc(value) {
          return value;
        }
      },
      showLine: true,
      fullWidth: false,
    },

    overviewStoreDistOption: {
      axisX: {
        position: 'end',
        labelOffset: {
          x: -10,
          y: 0
        },
        showGrid: true,
        showLabel: true,
        offset: 20,
        showCenterLine: true
      },
      axisY: {
        position: 'start',
        type: undefined,
        scaleMinSpace: 50,
        // Use only integer values (whole numbers) for the scale steps
        onlyInteger: false,
        labelOffset: {
          x: 0,
          y: 0
        },
        showGrid: true,
        showLabel: true,
        offset: 30,
        showCenterLine: true,
        labelInterpolationFnc(value) {
          return value + '%'
        }
      },
      showLine: false
    },

    pieChartOptions: {
      labelDirection: 'explode',
      labelInterpolationFnc(value) {
        return value;
      }
    },

    graphPadding: {
      top: 30,
      bottom: 30,
      left: 40,
      right: 40
    }
};

export default _CONST;
