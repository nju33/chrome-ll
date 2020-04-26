import './main.css'

// const getUserId = async (): Promise<string> => {
//   return await new Promise((resolve) => {
//     chrome.identity.getProfileUserInfo(({ id }) => {
//       console.log(id)
//       resolve(id)
//     })
//   })
// }

// // eslint-disable-next-line @typescript-eslint/no-floating-promises
// ;(async () => {
//   const module = await import('../pkg/app')

//   // chrome.onInputStarted
//   chrome.omnibox.onInputStarted.addListener(async () => {
//     const userId = await getUserId()
//     module.handle_omnibox_input_started(userId)
//   })
// })()
