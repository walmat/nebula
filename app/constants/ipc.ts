type Mapping = {
  [key: string]: string;
};

export const IPCKeys: Mapping = {
  CheckForUpdates: 'CheckForUpdates',
  GetCurrentWindow: 'GetCurrentWindow',
  GetLogPath: 'GetLogPath',
  QuitApp: 'QuitApp',
  ShowOpenDialog: 'ShowOpenDialog',
  SaveDialog: 'SaveDialog',
  OpenUrl: 'OpenUrl',
  GetVersion: 'GetVersion',

  PurgeAnswers: 'PurgeAnswers',
  QuickTask: 'QuickTask',

  LogUser: 'LogUser',
  FetchData: 'FetchData',

  EnableStagger: 'EnableStagger',
  ChangeStagger: 'ChangeStagger',

  InjectUser: 'InjectUser',

  AddProfiles: 'AddProfiles',
  RemoveProfiles: 'RemoveProfiles',

  AddAnalyticsFile: 'AddAnalyticsFile',
  RemoveAnalyticsFile: 'RemoveAnalyticsFile',

  SetupAutoSolve: 'SetupAutoSolve',
  LaunchYoutube: 'LaunchYoutube',
  CancelLaunchYouTube: 'CancelLaunchYouTube',
  LaunchHarvester: 'LaunchHarvester',
  CancelLaunchHarvester: 'CancelLaunchHarvester',
  CloseHarvesterWindows: 'CloseHarvesterWindows',
  UpdateHarvester: 'UpdateHarvester',
  UpdateHCaptchaToken: 'UpdateHCaptchaToken',
  UpdateTheme: 'UpdateTheme',
  HarvesterData: 'HarvesterData',
  HarvestCaptcha: 'HarvestCaptcha',
  StartHarvest: 'StartHarvest',
  StopHarvest: 'StopHarvest',

  QuestionData: 'QuestionData',
  QuestionAnswer: 'QuestionAnswer',

  AuthRequestActivate: 'AuthRequestActivate',
  AuthRequestDeactivate: 'AuthRequestDeactivate',
  AuthRequestStatus: 'AuthRequestStatus',

  LaunchBrowser: 'LaunchBrowser',

  ToggleAutoRestart: 'ToggleAutoRestart',
  RequestGetAppVersion: 'RequestGetAppVersion',

  Notification: 'Notification',

  TaskStatus: 'TaskStatus',
  RatesTaskStatus: 'RatesTaskStatus',
  ProxyStatus: 'ProxyStatus',

  RequestTestProxy: 'RequestTestProxy',
  ResponseTestProxy: 'ResponseTestProxy',

  StartTasks: 'StartTasks',
  StopTasks: 'StopTasks',
  UpdateTasks: 'UpdateTasks',
  FetchRates: 'FetchRates',
  CancelRates: 'CancelRates',
  AddWebhooks: 'AddWebhooks',
  RemoveWebhooks: 'RemoveWebhooks',
  AddProxies: 'AddProxies',
  RemoveProxies: 'RemoveProxies',

  RequestSendUser: 'RequestSendUser',

  ChangeDelay: 'RequestChangeDelay',
  TestWebhook: 'TestWebhook',

  FocusMainWindow: 'FocusMainWindow',
  ActivationCheck: 'ActivationCheck',
  SaveCookies: 'SaveCookies',

  LaunchCacheWindow: 'LaunchCacheWindow'
};

export const HARVEST_STATES: Mapping = {
  IDLE: 'idle',
  SUSPEND: 'suspend',
  ACTIVE: 'active'
};
