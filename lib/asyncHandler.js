const asynchandler=(fn)=>{
  return (req,resp,next)=>{
    return Promise.resolve(fn(req,resp,next)).catch(next)
  }
}
export default asynchandler