// dom到虚拟dom
function domtoflag(dom,vm){
    var flag = document.createDocumentFragment();
    var child;
    while(child = dom.firstChild){
        compile(child,vm)
        flag.appendChild(child)
    }
    return flag;
}
// 处理dom的每个node
function compile(node,vm){
    var reg = /\{\{(.*)\}\}/;
    // 根据不同node类型处理dom节点
    if(node.nodeType == 1){
        var attrs = node.attributes;
        for(var i=0; i<attrs.length; i++){
            if(attrs[i].nodeName == 'v-model'){
                var name = attrs[i].nodeValue;
                node.addEventListener('input',function(e){
                    vm[name] = e.target.value;
                })
                node.value = vm[name];
                node.removeAttribute('v-model');
                // 新建订阅者
                new Watcher(vm,node,name,'input');
            }
        }
        if(reg.test(node.innerHTML)){
            var name = RegExp.$1;
            node.innerHTML = vm[name.trim()];
            // 新建订阅者
            new Watcher(vm,node,name,'html');
        }
    }
    if(node.nodeType == 3){
        if(reg.test(node.nodeValue)){
            var name = RegExp.$1;
            node.nodeValue = vm[name.trim()];
            // 新建订阅者
            new Watcher(vm,node,name,'text');
        }
    }
}
// 数据绑定到vm上
function defineReactive(vm,key,val){
    var dep = new Dep();
    Object.defineProperty(vm,key,{
        set: function(newVal){
            if(val == newVal) return;
            val = newVal;
            // 发布通知
            dep.notify();
        },
        get: function(){
            // 记录订阅者
            dep.addSub();
            return val;
        }
    })
}
// 观察数据
function observe(vm){
    var  data = vm.data;
    Object.keys(data).forEach(key => {
        var val = data[key];
        defineReactive(vm,key,val)
    });
}
// 观察者对象
function Watcher(vm,node,name,type){
    // 订阅者暂存
    Dep.target = this;
    this.vm = vm;
    this.node = node;
    this.name = name;
    this.type = type;
    // 调用订阅者更新方法
    this.update();
    // 订阅者清空
    Dep.target = null;
}
Watcher.prototype = {
    update: function(){
        this.value = this.vm[this.name];
        switch (this.type) {
            case 'input':
                this.node.value = this.value;
                break;
            case 'html':
                this.node.innerHTML = this.value;
                break;
            case 'text':
                this.node.nodeValue = this.value;
                break;
        }
    }
}
// Dep主题对象
function Dep(){
    this.subs = [];
}
Dep.prototype = {
    addSub: function(){
        if(Dep.target){
            this.subs.push(Dep.target)
        }
    },
    notify: function(){
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}
// vue对象
function Vue(option){
    this.data = option.data;
    var el_id = option.el;
    //观察数据
    observe(this)
    //数据和文档绑定
    var dom = document.getElementById(el_id);
    // 将处理好的文档重新渲染到document中
    dom.appendChild(domtoflag(dom, this));
}