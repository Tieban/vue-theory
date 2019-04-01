// 双向绑定原型
function yuanli(){
    var obj = {};
    Object.defineProperty(obj,'hello',{
        set: function(val){
            console.log('set:'+val)
            document.getElementById('input').value = val;
            document.getElementById('span').innerHTML = val;
        },
        get: function(){
            console.log('get')
        }
    })
    document.getElementById('input').addEventListener('keyup',function(e){
        obj.hello = e.target.value;
    })
    obj.hello;
    obj.hello = 1;
}

// 订阅/发布模式
var pub={
    publish: function(){
        dep.notify();
    }
}

var sub1= {
    update: function(){
        console.log(1)
    }
}
var sub2= {
    update: function(){
        console.log(1)
    }
}
var sub3= {
    update: function(){
        console.log(1)
    }
}

function dep(){
    this.subs = [sub1,sub2,sub3]
}
dep.prototype.notify = function(){
    this.subs.forEach(function(sub){
        sub.update();
    })
}