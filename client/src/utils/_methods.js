function storage (...args) {
   if (args.length === 1) {
       return window.localStorage.getItem(args[0])
   } else if (args.length === 2) {
       return window.localStorage.setItem(args[0], args[1])
   }
}

export default {
    storage
}