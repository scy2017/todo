/*
说明

1.关于数据
    刷新不丢失数据，用到本地存储 localStorage
    按下回车、点击复选框，都是把本地存储的数据加载到页面中
    本地存储只存字符串，数组对象转为字符串 JSON.stringify()
    获取本地存储数据，字符串转为数组对象 JSON.parse()
    var todolist = [{
        title: '我今天吃八个馒头',
        done: false
    }, {
        title: '我今天学习jq',
        done: false
    }, ];
    存储
    localStorage.setItem("todo", JSON.stringify(todolist));
    使用
    var data = localStorage.getItem("todo");
    data = JSON.parse(data);

2.按下回车添加新数据到本地存储
    利用事件对象.keyCode判断用户按下回车键(13)
    声明一个数组local，保存数据
    先要读取本地存储原来的数据(声明函数 getData())，放到数组local里面
    之后追加新数据到数组local里面
    最后把数组存储给本地存储 (声明函数 savaDate())

3.本地存储数据渲染加载到页面
    声明一个渲染加载函数 load
    先要读取本地存储数据
    之后遍历这个数据($.each())，生成 li 添加到 ol 里面
    每次渲染之前，先把原先里面 ol 的内容清空，然后渲染加载最新的数据

3.删除操作
    删除的是本地存储对应的数据
    先获取本地存储数据，删除对应的数据，保存给本地存储，重新渲染列表li
    自定义属性记录当前的索引号，根据索引号删除相关的数据splice(i, 1)
    a是动态创建的，所以使用on方法绑定事件

4.正在进行和已完成选项操作
    点击之后，获取本地存储数据
    修改对应数据属性 done 为当前复选框的checked状态
    保存数据到本地存储
    重新渲染加载
    load函数里新增条件,如果done为true就加载到ul里面；如果为false， 则加载到ol里面

5.统计正在进行个数和已经完成个数
    在load函数里面操作
    声明2个变量 :todoCount待办个数 doneCount已完成个数
    进行遍历本地存储数据的时候， 如果数据done为false，则todoCount++, 否则 doneCount++
    最后修改相应的元素text()
*/

$(function () {
    // 获取本地存储的数据
    function getDate() {
        let data = window.localStorage.getItem('todolist')
        if (data !== null) {
            return JSON.parse(data);
        } else {
            return [];
        }
    }
    // 保存本地存储的数据
    function savaDate(data) {
        window.localStorage.setItem('todolist', JSON.stringify(data));
    }

    // 渲染加载数据
    load()
    function load() {
        // 获取本地存储的数据
        let data = getDate();
        // 遍历之前先要清空ol里面的元素内容
        $('ol, ul').empty()
        let doneCount = 0; // 已经完成的个数
        let todoCount = 0; //正在进行的个数
        // 遍历这个数组
        $.each(data, function (i, n) {
            if (n.done) {
                $("ul").prepend("<li><input type='checkbox' checked='checked' > <p>" + n.title + "</p > <a href=' ' id=" + i + " ></a ></li>");
                doneCount++;
            } else {
                $("ol").prepend("<li><input type='checkbox' > <p>" + n.title + "</p > <a href='javascript:;' id=" + i + " ></a ></li>");
                todoCount++;
            }
        });
        $("#todocount").text(todoCount);
        $("#donecount").text(doneCount);
    }

    // 1.按下回车添加新数据到本地存储
    $('#title').on('keydown', function (e) {
        if (e.keyCode === 13) {
            if ($(this).val() === '') {
                alert('请输入内容');
            } else {
                let local = getDate();
                // 追加最新的数据
                local.push({
                    title: $(this).val(),
                    done: false
                })
                // 最后存储到本地 localStorage
                savaDate(local);
                // 渲染加载到页面
                load();
                $(this).val('')
            }
        }
    })

    // 2.删除操作
    $('ol, ul').on('click', 'a', function () {
        // 先获取本地存储
        let data = getDate();
        // 删除数据
        let index = $(this).attr('id');
        data.splice(index, 1);
        // 保存到本地
        savaDate(data);
        // 重新渲染页面
        load();
    })

    // 3.正在进行和已完成选项操作
    $('ol, ul').on('click', 'input', function () {
        //先获取本地存储的数据
        let data = getDate();
        // 修改数据
        let index = $(this).siblings('a').attr('id');
        data[index].done = $(this).prop('checked');
        // 保存到本地存储
        savaDate(data);
        // 重新渲染页面
        load();
    })
})