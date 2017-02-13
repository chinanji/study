/**
订阅模式
**/
var event = {
     clientList : [],
     listen: function(key,fn){
          this.clientList[key] || (this.clientList[key] = []);
          this.clientList[key].push(fn);
     },
    
     trigger:function(){
          var key = Array.prototype.shift.call(arguments),
          fns = this.clientList[key];
         
          if(!fns || fns.length === 0){
               return false;
          }
         
          for(var i=0,fn; fn = fns[i++]; ){
               fn.apply(this,arguments);
          }
     }
};


/**
给对象动态的增加对象功能
**/
var installEvent = function(obj){
     for(var i in event){
          obj[i] = event[i];
     }
};


/**
beforeCheck,插件式表单验证
**/
Function.prototype.beforeCheck = function( beforefn ){
     var __self = this;  //原函数

     return function(){
          if( beforefn.apply(this,arguments) == false ){
               //beforefn 返回false时，直接返回，不再执行后面的原函数
               return;
          }
          return __self.apply(this,arguments);
     };
}


/**
AOP
**/
//先执行高阶函数，再执行本函数
Function.prototype.before = function( beforeFn ){
     var __self = this;
     return function(){
          beforeFn.apply(this,arguments);
          return __self.apply(this,arguments);
     };
}


/**
AOP
**/
//先执行本函数，再执行高阶函数
Function.prototype.after = function( afterFn ){
     var __self = this;
     return function(){
          var ret = __self.apply(this,arguments);
          afterFn.apply(this,arguments);
          return ret;
     };
}


/**单例模式**/
var getSingle = function( fn ){
     var ret;
     return  function(){
          return  ret || (ret = fn.apply(this, arguments));
     };
};


/***currying 函数柯里化   部分求值**/
var currying = function( fn ){
     var args = [];
     return function(){
          if( arguments.length === 0){
               return fn.apply(this, args);
          }else{
               [].push.apply( args , arguments);
               return arguments.callee;
          }
     }
};


/***uncurrying 借用一个原本不属于它的方法**/
Function.prototype.uncurrying = function(){
     var self = this;
     return function(){
          var obj = Array.prototype.shift.call( arguments );
          return self.apply( obj, arguments );
     };
}


/**
类似boost::bind
**/
Function.prototype.bind = function(){
     var self = this,    //保存原函数
          context = [].shift.call(arguments),  //上下文
          args = [].slice.call(arguments);     //剩余参数
         
     return function(){   //返回一个新函数
          return self.apply(context, [].concat.call(args, [].slice.call(arguments)));
     }
}
