var serverlessSDK = require('./serverless_sdk/index.js')
serverlessSDK = new serverlessSDK({
orgId: 'nju33',
applicationName: 'chrome-ll',
appUid: '1cdnnc92p6k04VYbd7',
orgUid: 'WCj3Y54ZZDqRzXwf30',
deploymentUid: '3274ec09-3100-4961-878a-c6738ea859b2',
serviceName: 'chrome-ll',
shouldLogMeta: true,
stageName: 'dev',
pluginVersion: '3.4.1'})
const handlerWrapperArgs = { functionName: 'chrome-ll-dev-hello', timeout: 6}
try {
  const userHandler = require('./handler.js')
  module.exports.handler = serverlessSDK.handler(userHandler.hello, handlerWrapperArgs)
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs)
}
