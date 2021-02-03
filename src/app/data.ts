interface Menu {
  title: string;
  link: string;
  icon: string;
  expand: boolean;
  items?: any[];
  options: { exact: boolean };
}

const PLANT_DATA: string[] = ["Mumbai"];

const DEPARTMENT_DATA: string[] = [
  "Production",
  "Packaging",
  "Energy Management"
];

const MACHINE_NAME: string[] = [
  'Assembly1',
  'Assembly2'
];

const MACHINE_DATA: string[] = [
  "Pakona 58 Head 1",
  "Pakona 58 Head 2",
  "Kliklok 60 Head 1",
  "Kliklok 60 Head 2",
  "Kliklok 60 Head 3",
  "Cartoner 58",
  "Kliklok 60",
  "JetPack",
  "EnergyPack"
];

/* for UMS Machine */
const UMS_DASHBOARD_MENU_ITEMS: Menu[] = [
  {
    title: "Home",
    link: "/machinedetail",
    icon: "home",
    expand: false,
    options: { exact: false }
  },
  {
    title: "Monitoring Parameters",
    link: "/machinedetail/monitoringparams",
    icon: "insert_chart",
    expand: false,
    options: { exact: false }
  },
  {
    title: "Alarm",
    link: "/machinedetail/machinealaram",
    icon: "insert_chart",
    expand: false,
    options: { exact: false }
  },
  {
    title: "Utility Status",
    link: "/machinedetail/machinestatus",
    icon: "insert_chart",
    expand: false,
    options: { exact: false }
  },
  {
    title: "Air Compressor",
    link: "/machinedetail/aircompressor",
    icon: "insert_chart",
    expand: false,
    options: { exact: false }
  },
  {
    title: "Boiler",
    link: "/machinedetail/boiler",
    icon: "insert_chart",
    expand: false,
    options: { exact: false }
  },
  {
    title: "Chiller",
    link: "/machinedetail/chiller",
    icon: "insert_chart",
    expand: false,
    options: { exact: false }
  },
  {
    title: "Cooling Tower",
    link: "/machinedetail/coolingtower",
    icon: "insert_chart",
    expand: false,
    options: { exact: false }
  }

];

const UMS_REPORT_MENU_ITEM: Menu[] = [{
  title: "Reports",
  link: "/machinedetail/report",
  icon: "report",
  expand: true,
  items: [
    {
      title: "Alarm",
      link: "/machinedetail/machinereportalaram",
      icon: "insert_chart",
      expand: false,
      options: { exact: false }
    },
    {
      title: "Utility Status",
      link: "/machinedetail/machinereportstatus",
      icon: "insert_chart",
      expand: false,
      options: { exact: false }
    },
    {
      title: "Air Compressor",
      link: "/machinedetail/aircompressorreport",
      icon: "bar_chart",
      expand: false,
      options: { exact: false }
    },
    {
      title: "Boiler",
      link: "/machinedetail/boilerreport",
      icon: "bar_chart",
      expand: false,
      options: { exact: false }
    },
    {
      title: "Chiller",
      link: "/machinedetail/chillerreport",
      icon: "bar_chart",
      expand: false,
      options: { exact: false }
    },
    {
      title: "Cooling Tower",
      link: "/machinedetail/coolingtowerreport",
      icon: "bar_chart",
      expand: false,
      options: { exact: false }
    }
  ],
  options: { exact: false }
}];

const UMS_CONFIGURATION_MENU_ITEMS: Menu[] = [
  {
    title: "Configurations",
    link: "/machinedetail/confg",
    icon: "settings_applications",
    expand: true,
    items: [
      {
        var: "paramConfig"
      }
    ],
    options: { exact: false }
  }
];

/* for PMS Machine */
const PMS_DASHBOARD_MENU_ITEMS: Menu[] = [
  {
    title: "Home",
    link: "/dashboard",
    icon: "home",
    expand: false,
    options: { exact: true }
  },
  {
    title: "Production",
    link: "/dashboard/products",
    icon: "insert_chart",
    expand: false,
    options: { exact: false }
  },
  {
    title: "Alarms",
    link: "/dashboard/alarms",
    icon: "alarm",
    expand: false,
    options: { exact: false }
  },
  {
    title: "Energy",
    link: "/dashboard/energy",
    icon: "flash_on",
    expand: false,
    options: { exact: false }
  },
  {
    title: "Machine Status",
    link: "/dashboard/machine",
    icon: "dvr",
    expand: false,
    options: { exact: false }
  },
  {
    title: "OEE",
    link: "/dashboard/oee",
    icon: "settings_input_svideo",
    expand: false,
    options: { exact: false }
  }
  // {
  //   title: "Parameter-Monitoring",
  //   link: "/dashboard/parameter-monitoring",
  //   icon: "timeline",
  //   expand: false,
  //   options: { exact: false }
  // }
  // {
  //   title: "Utility",
  //   link: "/dashboard/utility",
  //   icon: "equalizer",
  //   expand: false,
  //   options: { exact: false }
  // }
];
 
const PMS_REPORT_MENU_ITEM: Menu[] = [{
  title: "Reports",
  link: "/dashboard/report",
  icon: "report",
  expand: true,
  items: [
    {
      title: 'Production',
      link: '/dashboard/report/productReport'
    },
    {
      title: 'Alarm',
      link: '/dashboard/report/alarmReport'
    },
    {
      title: 'Energy',
      link: '/dashboard/report/energyReport'
    },
    {
      title: "OEE",
      link: "/dashboard/report/oeeReport",
      icon: "settings_input_svideo",
      expand: false,
      options: { exact: false }
    }, 
    // {
    //   title:'Utility',
    //   link: '/dashboard/report/utilityReport'
    // },
    {
      title: "Customized Reports",
      link: "/dashboard/report/reportView",
      icon: "compare_arrows",
      expand: false,
      options: { exact: false }
    },
    {
      title: "Plant",
      link: "/dashboard/report/plantReport",
      icon: "dashboard",
      expand: false,
      options: { exact: false }
    },
    {
      title: "Plant-comparison",
      link: "/dashboard/report/plantComparisonReport",
      icon: "compare_arrows",
      expand: false,
      options: { exact: false }
    },
    {
      title: "Machine-comparison",
      link: "/dashboard/report/machineComparisonReport",
      icon: "compare_arrows",
      expand: false,
      options: { exact: false }
    }
    // {
    //   title: "Machine Maintenance",
    //   link: "/dashboard/report/machine-maintenance",
    //   icon: "build",
    //   expand: false,
    //   options: { exact: false }
    // }
  ],
  options: { exact: false }
}];

const PMS_CONFIGURATION_MENU_ITEMS: Menu[] = [
  {
    title: "Configurations",
    link: "/dashboard/confg",
    icon: "settings_applications",
    expand: true,
    items: [
      {
        var: "paramConfig"
      }
    ],
    options: { exact: false }
  }
];

/* for EMS Machine */
const EMS_DASHBOARD_MENU_ITEMS: Menu[] = [
  {
    title: "Home",
    link: "/ems",
    icon: "home",
    expand: false,
    options: { exact: false }
  },
  {
    title: "PCC",
    link: "/ems/pcc",
    icon: "insert_chart",
    expand: false,
    options: { exact: false }
  },
  {
    title: "MCC",
    link: "/ems/mcc",
    icon: "insert_chart",
    expand: false,
    options: { exact: false }
  },

  {
    title: "Feeder",
    link: "/ems/feeder",
    icon: "insert_chart",
    expand: false,
    options: { exact: false }
  },
  {
    title: "Interruption  Status",
    link: "/ems/machinestatus",
    icon: "insert_chart",
    expand: false,
    options: { exact: false }
  },
  {
    title: "Monitoring Parameters",
    link: "/ems/monitoringparams",
    icon: "insert_chart",
    expand: false,
    options: { exact: false }
  }
];

const EMS_REPORT_MENU_ITEM: Menu[] = [{
  title: "Reports",
  expand: true,
  icon: "report",
  link: "/dashboard/report",
  items: [
    {
      title: 'PCC-Report',
      link: '/ems/pcc-report'
    },
    {
      title: 'MCC-Report',
      link: '/ems/mcc-report'
    },
    {
      title: 'Feeder-Report',
      link: '/ems/feeder-report'
    },
    {
      title: 'Machine-Comparison',
      link: '/ems/machine-comparison-report'
    },
    {
      title: 'Machine-Status',
      link: '/ems/machine-status-report'
    }
  ],
  options: { exact: false }
}];

const EMS_CONFIGURATION_MENU_ITEMS: Menu[] = [
  {
    title: "Configurations",
    link: "/ems/confg",
    icon: "settings_applications",
    expand: true,
    items: [
      {
        var: "paramConfig"
      }
    ],
    options: { exact: false }
  }
];

const DASHBOARD_BOX_DETAILS = {
  PCC_DASHBOARD: {
    FIRST_BOX: {
      TITLE: 'Monitoring Parameters',
      FIRST_BOX_KEY_1: 'Voltage',
      FIRST_BOX_KEY_2: 'Current',
      FIRST_BOX_KEY_3: 'Frequency'
    },
    SECOND_BOX: {
      TITLE: 'Power Data',
      SECOND_BOX_KEY_1: 'Active Power',
      SECOND_BOX_KEY_2: 'Reactive Power',
      SECOND_BOX_KEY_3: 'Apparant Power',
      SECOND_BOX_KEY_4: 'Power Factor'
    },
    THIRD_BOX: {
      TITLE: 'Phasewise Data',
      THIRD_BOX_KEY_1: 'R-Phase Load',
      THIRD_BOX_KEY_2: 'Y-Phase Load',
      THIRD_BOX_KEY_3: 'B-Phase Load'
    },
    FOURTH_BOX: {
      TITLE: 'Demand Data',
      FOURTH_BOX_KEY_1: 'Peak Demand',
      FOURTH_BOX_KEY_2: 'Apparent Power Demand'
    }
  },

  MCC_DASHBOARD: {
    FIRST_BOX: {
      TITLE: 'Monitoring Parameters',
      FIRST_BOX_KEY_1: 'Voltage',
      FIRST_BOX_KEY_2: 'Current',
      FIRST_BOX_KEY_3: 'Frequency'
    },
    SECOND_BOX: {
      TITLE: 'Power Consumption',
      SECOND_BOX_KEY_1: 'Active Power',
      SECOND_BOX_KEY_2: 'Reactive Power',
      SECOND_BOX_KEY_3: 'Apparant Power'
    },
    THIRD_BOX: {
      TITLE: 'Power Quality Data',
      THIRD_BOX_KEY_1: 'Power Data',
      THIRD_BOX_KEY_2: 'THD'
    },
    FOURTH_BOX: {
      TITLE: 'Demand Analysis',
      FOURTH_BOX_KEY_1: 'Average Demand',
      FOURTH_BOX_KEY_2: 'Peak Demand',
      FIRST_BOX_KEY_3: 'Demand'
    }
  }
};

const ROLES = {
  PARTICIPANT: "PARTICIPANT",
  USER: "USER",
  ADMIN: "ADMIN",
  SUPERADMIN: "SUPERADMIN"
};

const INTERVAL_TIME: number = 100000;
const HIDE_ACCESS_DETAILS = false;

export {
  Menu,
  ROLES,

  PLANT_DATA,
  DEPARTMENT_DATA,
  MACHINE_NAME,
  MACHINE_DATA,

  PMS_DASHBOARD_MENU_ITEMS,
  PMS_REPORT_MENU_ITEM,
  PMS_CONFIGURATION_MENU_ITEMS,

  UMS_DASHBOARD_MENU_ITEMS,
  UMS_REPORT_MENU_ITEM,
  UMS_CONFIGURATION_MENU_ITEMS,

  EMS_DASHBOARD_MENU_ITEMS,
  EMS_REPORT_MENU_ITEM,
  EMS_CONFIGURATION_MENU_ITEMS,

  DASHBOARD_BOX_DETAILS,
  INTERVAL_TIME,
  HIDE_ACCESS_DETAILS
};
