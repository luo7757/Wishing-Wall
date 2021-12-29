$(function(){
    const ipt = $('#ipt')[0];
    const boxH = 200;
    const boxW = 180;
    const maxH = parseInt($('.wrapper').css('height')) - boxH;
    const maxW = parseInt($('.wrapper').css('width')) - boxW;

    let dataArr = [];
    let itemArr = [];
    let zIndex = 1;
    init();

    function init(){
        if(localStorage.makeAWishDate){
            JSON.parse(localStorage.makeAWishDate).forEach(txt => {
                renderDom(txt);
            });
            // console.log(localStorage.makeAWishDate);
        }
        bindEvent();
        drap(getItem());
        sizeChange();
        proportion();
    }

    function proportion(){
        let winWidth = window.innerWidth;
        let winHeight = window.innerHeight;
        $('.item').each((i,item) => {
            let style = item.getBoundingClientRect();
            let width = style.width;
            let height = style.height;
            let xPropor = style.left / (winWidth - width);
            let yPropor = style.top / (winHeight - height);
            itemArr.push({xPropor,yPropor,item,width, height});
        })
        // console.log(itemArr);
    }

    function bindEvent(){
        $(window).on('keydown',function(e){
            if(e.key === "Enter"){
                getIptValue();
                ipt.value = '';
            }
        })
    }

    function getIptValue(){
        let str = ipt.value.replace(/^\s*|\s* $/g , "");
        renderDom(str);
    }

    function randomColor(){
        return `rgb(${~~(Math.random() * 255)},${~~(Math.random() * 255)},${~~(Math.random() * 255)})`
    }

    function randomPosition(){
        return [~~(Math.random() * maxH),~~(Math.random() * maxW)];
    }

    function renderDom(txt){
        const str = `<span class="text">${txt}</span>`;
        const div = $(document.createElement('div')).append(str);
        const positionArr = randomPosition();

        $('.wrapper').append($(div).addClass('item').css({
            'background-color' : randomColor,
            'left' : positionArr[1],
            'top' : positionArr[0],
            'z-index' : zIndex ++
        }));
        // console.log(div[0]);
        dataArr.push(txt);
        drap(div);
        preservationDate();
    }
    function getItem(){
       return $('.wrapper .item');
    }

    function drap(dom){
        $(dom).on('mousedown', function(e){
            // console.log(window.getEvent);
            let dom = this,
                domStyle = dom.getBoundingClientRect(),
                left = domStyle.left,
                top = domStyle.top,
                width = domStyle.width,
                height = domStyle.height,
                lastX = e.clientX - dom.offsetLeft,
                lastY = e.clientY - dom.offsetTop,
                winWidth = window.innerWidth,
                winHeight = window.innerHeight;
                // zIndex = $(dom).css('z-index');
                // console.log(zIndex);
            $(document).on('mousemove', function(e) {
                let disX = e.clientX - lastX,
                    disY = e.clientY - lastY;
                if(disX >= winWidth - width){
                    disX = winWidth - width;
                }else if(disX <= 20){
                    disX = 20;
                }
                if(disY >= winHeight - height){
                    disY = winHeight - height;
                }else if(disY <= 0){
                    disY = 20;
                }
                $(dom).css({
                    transition : 'none',
                    left : disX,
                    top : disY,
                })
            })
            $(document).on('mouseup', function(){
                $(dom).css({
                    transition : '.3s',
                    'z-index' : zIndex ++
                })
                $(document).off('mousemove').off('mouseup');
                proportion()
            })
        })
    }

    function sizeChange(){
        const time = settimer();
        // console.log(time);
        $(window).on('resize', function(){
            time();
        })
    }
    
    function settimer(){
        let time = null;
        return function (){
            if(time) return;
            time = setTimeout(() => {
                    let winWidth = window.innerWidth;
                    let winHeight = window.innerHeight;
                    itemArr.forEach(item => {
                        // console.log(item);
                        $(item.item).css({
                            left : item.xPropor * (winWidth - item.width),
                            top : item.yPropor * (winHeight - item.height)
                        })
                    })
                    time = null;
                    // console.log('w')
            }, 300);
        }
    }

    function preservationDate(){
        // 做个代理或者动态监控
        // console.log(dataArr);
        // console.log(JSON.parse(localStorage.makeAWishDate));
        // console.log(dataArr);
        localStorage.makeAWishDate = JSON.stringify(dataArr);
    }
})