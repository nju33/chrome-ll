import './main.css'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
  const module = await import('../pkg/app')
  // console.log(module)
  console.log(123123)
  module.render_popup()
  // await module.test()
  // console.log(123)
})()
