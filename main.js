let m_pos;
const account = document.querySelector('.account');
const contents = document.querySelector('contents');
const upDownBtn = document.querySelector('.up_btn_wrap');

// console.log(contents.offsetTop);
// function resize(e){
//     console.log(e)
//     let parent = dragBtn.parentNode;
//     let dx = m_pos - e.y;
//     m_pos = e.y;
//     parent.style.height = (parseInt(getComputedStyle(parent, '').height) + dx) + "px";
//     parent.style.transform = `translateY(-${e.y}px)`;
// }

// const dragBtn = document.querySelector(".up_btn_wrap");
// dragBtn.addEventListener("mousedown", function(e){
//     // console.log(e.target.offsetParent);
//     console.log(e);
//     m_pos = e.y;
//     document.addEventListener("mousemove", resize, false);
// }, false);
// document.addEventListener("mouseup", function(){
//     document.removeEventListener("mousemove", resize, false);
// }, false);





// 저금통 좌우 슬라이드
const slider = document.querySelector('.contents__money-box ul');
console.log(slider)
let isMouseDown = false;
let startX, scrollLeft;

slider.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    slider.classList.add('active'); 

    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;

});

slider.addEventListener('mouseleave', () => {
    isMouseDown = false;
    slider.classList.remove('active');
})

slider.addEventListener('mouseup', () => {
    isMouseDown = false;
    slider.classList.remove('active');
});

slider.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;

    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * .7;
    slider.scrollLeft = scrollLeft - walk;
});


// 화면 좌우 슬라이드
const main = document.querySelector('main');
const sections = document.querySelectorAll('section');
console.log(sections);
const money_box = document.querySelector('.contents__money-box');
console.log(main)
let MouseDown = false;
let start_x, scroll_left;

main.addEventListener('mousedown', (e) => {
    MouseDown = true;
    main.classList.add('active'); 

    start_x = e.pageX - main.offsetLeft;
    scroll_left = main.scrollLeft;

});

main.addEventListener('mouseleave', () => {
    MouseDown = false;
    main.classList.remove('active');
})

main.addEventListener('mouseup', () => {
    MouseDown = false;
    main.classList.remove('active');
});

main.addEventListener('mousemove', (e) => {
    if (!MouseDown) return;
    console.log(e.path)
    e.preventDefault();
    const x = e.pageX - main.offsetLeft;
    const walk = (x - start_x) * .7;
    
    if(e.path.includes(money_box)) {
        console.log(111111111);
        return;
    }
    main.scrollLeft = scroll_left - walk;
    console.log(main.scrollLeft);

    for(let i = 0; i < sections.length; i++) {
        if(main.scrollLeft > main.clientWidth / 2) {
            sections[i].style.transition = '1s';
            sections[i].style.transform = `translateX(${-(main.clientWidth - main.scrollLeft)}px)`;
        } else {
            sections[i].style.transition = '1s';
            sections[i].style.transform = `translateX(${(main.scrollLeft)}px)`;
        }
        
    }    
    // if(main.scrollLeft > main.clientWidth / 2) {
    //     // main.style.transform = `translateX(${-(main.clientWidth - main.scrollLeft)}px)`;
    //     for(let i = 0; i < sections.length; i++) {
    //         sections[i].style.transition = '1s';
    //         sections[i].style.transform = `translateX(${-(main.clientWidth - main.scrollLeft)}px)`;
            
    //     }
    // } else {
    //     // 반대 경우
    //     for(let i = 0; i < sections.length; i++) {
    //         sections[i].style.transition = '1s';
    //         sections[i].style.transform = `translateX(${(main.scrollLeft)}px)`;
    //     }
        
    // }
});


// JSON
fetch('https://gyoheonlee.github.io/mobile-bank/data/bank-new.json')
    .then( response =>  response.json() )
    .then(obj => {start(obj)});


function start(data) {
    const ulEl = document.querySelector('.contents__history > ul');
    const bankLists = data.bankList.reverse();
    let totalSum = 0;
    let listIndex = 0;

    for(let i=0; i < bankLists.length; i++) {
        // 태그 생성
        const liEl = document.createElement('li');
        const divEl = document.createElement('div');
        const divEl2 = document.createElement('div');
        const fitst_pEl = document.createElement('p');
        const secoend_pEl = document.createElement('p');
        const third_pEl = document.createElement('p');
        const fourth_pEl = document.createElement('p');
       
        // 날짜가 틀리면 새로운 LIST 생성
        if(i === 0 || bankLists[i - 1]['date'] !== bankLists[i]['date']) {
            totalSum += bankLists[i]['price'];

            fitst_pEl.innerHTML = bankLists[i]['date'];
            fitst_pEl.className = 'date';
            secoend_pEl.innerHTML = `${totalSum} 원 지출`;
            secoend_pEl.className = 'today_spending';

            divEl.appendChild(fitst_pEl);
            divEl.appendChild(secoend_pEl);
            divEl.className = 'payment_today';

            third_pEl.innerHTML = bankLists[i]['history'];
            third_pEl.className = 'history';
            fourth_pEl.innerHTML = bankLists[i]['price'];
            fourth_pEl.className = 'price';

            divEl2.appendChild(third_pEl);
            divEl2.appendChild(fourth_pEl);


            liEl.appendChild(divEl);
            liEl.appendChild(divEl2);
            ulEl.appendChild(liEl);
            listIndex += 1;
        } else {
            const nextLiEl = document.querySelector(`.contents__history > ul li:nth-child(${listIndex})`);
            fitst_pEl.innerHTML = bankLists[i]['history'];
            fitst_pEl.className = 'history';
            secoend_pEl.innerHTML = bankLists[i]['price'];
            secoend_pEl.className = 'price';
            totalSum += bankLists[i]['price'];
            divEl.appendChild(fitst_pEl);
            divEl.appendChild(secoend_pEl);
            nextLiEl.appendChild(divEl);
            
            // 당일 누적 지출 합계
            nextLiEl.childNodes[0].children[1].innerHTML = `${totalSum} 원 지출`;
            totalSum = 0;
        }
        





    }
    // bankLists.forEach(bankList => {
    //     console.log(bankList['date']);
    //     let date  = bankList['date'];
        
    //     const liEl = document.createElement('li');
    //     const divEl = document.createElement('div');
    //     const fitst_pEl = document.createElement('p');
    //     const secoend_pEl = document.createElement('p');

    //     // date
    //     // today_spending
    //     const price_date = document.createElement('p');
    //     const total_price = document.createElement('p');

        

    //     // if(bankList['date'] === date) {
    //     //     totalSum += bankList['price'];
    //     //     total_price.innerHTML = `${totalSum}원 지출`;
    //     //     price_date.innerHTML = `${bankList['date']}`;
    //     //     console.log('end');
    //     // } else {
    //     //     totalSum = 0;
    //     //     price_date.className = 'date';
    //     //     total_price.className = 'today_spending';
    //     //     total_price.innerHTML = `${totalSum}원 지출`;
    //     //     price_date.innerHTML = `${bankList['date']}`;
    //     // }
    //     price_date.innerHTML = bankList['date'];
    //     total_price.innerHTML = totalSum;


    //     fitst_pEl.innerHTML = `${bankList['history']}`;
    //     secoend_pEl.innerHTML = `${bankList['price']}`
    //     fitst_pEl.className = 'history';
    //     secoend_pEl.className = 'price';
    //     divEl.appendChild(fitst_pEl);
    //     divEl.appendChild(secoend_pEl);
    //     liEl.appendChild(divEl);
    //     ulEl.appendChild(liEl);

    // });
}
