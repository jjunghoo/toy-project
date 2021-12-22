// contents 상하로 드래그
const up_btn_wrap = document.querySelector('.up_btn_wrap');
const contents = document.querySelector('.contents');
const account = document.querySelector('.account');
console.log(contents);
let is_mouse_down = false;
let startY, scroll_top;
// let walk;
up_btn_wrap.addEventListener('mousedown', (e) => {
    is_mouse_down = true;
    contents.classList.add('active'); 

    startY = e.pageY - up_btn_wrap.offsetTop;
    scroll_top = up_btn_wrap.scrollTop;

    console.log(e.pageY);
    console.log(up_btn_wrap.offsetTop);
    console.log(startY);
    console.log(up_btn_wrap.scrollTop);
});

up_btn_wrap.addEventListener('mouseleave', () => {
    is_mouse_down = false;
    up_btn_wrap.classList.remove('active');
});

up_btn_wrap.addEventListener('mouseup', (e) => {
    // console.log(e.pageY);
    if(e.pageY <= 170) {
        contents.style.transition = '1s ease';
        contents.style.top = `-210px`;
        // is_mouse_down = true;
        // up_btn_wrap.classList.remove('active');
    } else {
        // contents.style.transition = '1s';
        contents.style.top = `0px`;
        
        // up_btn_wrap.classList.remove('active');
    }
    is_mouse_down = false;
    up_btn_wrap.classList.remove('active');
});

up_btn_wrap.addEventListener('mousemove', (e) => {
    if (!is_mouse_down) return;
    if (e.pageY <= 268) MouseDown = false;
    console.log(e);
    e.preventDefault();
    const y = e.pageY - up_btn_wrap.offsetTop;
    const walk = (y - startY) * 1;
    // up_btn_wrap.scrollTop = scroll_top - walk;
    

    console.log('================');
    console.log('e.pageY = ' + e.pageY);
    console.log('up_btn_wrap.offsetTop = ' + up_btn_wrap.offsetTop);
    console.log('y = ' + y);
    console.log('walk = ' + walk);
    console.log('scrollTop = ' + scroll_top);
    console.log('up_btn_wrap.scrollTop = ' + up_btn_wrap.scrollTop);
    
    
    // if(walk > 0) return;
    contents.style.top = `${walk}px`;
});



// 저금통 좌우 슬라이드
const slider = document.querySelector('.contents__money-box ul');
console.log(slider)
let isMouseDown = false;
let startX, scrollLeft;

slider.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    slider.classList.add('active'); 

    startX = e.pageX - slider.offsetLeft;
    
    slider.style.transition = '1s ease';
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
    // 저금통 좌우 슬라이드 할 경우 main화면도 같이 슬라이드 안되게 방지
    // MouseDown = false;

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
    // console.log(e.path)
    e.preventDefault();
    const x = e.pageX - main.offsetLeft;
    const walk = (x - start_x) * .7;
    
    if(e.path.includes(money_box)) {
        // console.log(111111111);
        return;
    }
    main.scrollLeft = scroll_left - walk;
    // console.log(main.scrollLeft);

    for(let i = 0; i < sections.length; i++) {
        if(main.scrollLeft > main.clientWidth / 2) {
            sections[i].style.transition = '1s';
            sections[i].style.transform = `translateX(${-(main.clientWidth - main.scrollLeft)}px)`;
        } else {
            sections[i].style.transition = '1s';
            sections[i].style.transform = `translateX(${(main.scrollLeft)}px)`;
        }
    }    
});


// JSON
fetch('https://gyoheonlee.github.io/mobile-bank/data/bank-new.json')
    .then( response =>  response.json() )
    .then(obj => {start(obj)});


// 숫자 자릿수 변환
function convert_numeric_units (number_data) {
    const num = number_data;
    const change_num = num.toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    return change_num;
}


function start(data) {
    
    
    console.log(data);

    // 계좌 정보
    console.log(data.accountId);
    const account_id = document.querySelector('.account_id');
    account_id.innerHTML = `${data.accountId}`;
    
    const account_number = document.querySelector('.account_number');
    account_number.innerHTML = `${data.accountNumber}`;
    
    const deposit = document.querySelector('.deposit');
    deposit.innerHTML = `${convert_numeric_units(data.deposit)}원`;

    // 저금통 목록 출력
    const moneyBox = document.querySelector('.contents__money-box ul');
    console.log(moneyBox);
    console.log(data.moneyBox);
    data.moneyBox.reverse().forEach(money_box => {
        const liEl = document.createElement('li');
        const saving_box = document.createElement('div');
        const savings = document.createElement('div');
        const savings_title = document.createElement('p');
        const savings_fundAmount = document.createElement('p');
        const target_amount = money_box.targetAmount;

        savings_title.innerHTML = `${money_box.title}`;
        savings_title.className = 'savings_title';
        
        
        
        savings_fundAmount.innerHTML = convert_numeric_units(money_box.fundAmount);
        savings_fundAmount.className = 'savings_fundAmount';

        savings.className = 'savings';
        //저금통 목표금액 달성률
        savings.style.width = `calc(${money_box.fundAmount} / ${target_amount} * 100%)`;
        savings.appendChild(savings_title);
        savings.appendChild(savings_fundAmount);

        saving_box.className = 'saving_box';
        saving_box.appendChild(savings);
        liEl.appendChild(saving_box);
        moneyBox.prepend(liEl);
    });


    // 소비 내역 출력
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
        const fifth_pEl = document.createElement('p');

        // 날짜가 틀리면 새로운 LIST 생성
        if(i === 0 || bankLists[i - 1]['date'] !== bankLists[i]['date']) {
            // totalSum 0부터 다시 누적
            totalSum = 0;
            if(bankLists[i]['income'] === 'out') {
                totalSum += bankLists[i]['price'];
            } else {
                divEl2.className = 'remittance_list'
            }

            fitst_pEl.innerHTML = bankLists[i]['date'];
            fitst_pEl.className = 'date';
            secoend_pEl.innerHTML = `${totalSum} 원 지출`;
            secoend_pEl.className = 'today_spending';

            divEl.appendChild(fitst_pEl);
            divEl.appendChild(secoend_pEl);
            divEl.className = 'payment_today';

            third_pEl.innerHTML = bankLists[i]['history'];
            fourth_pEl.innerHTML = convert_numeric_units(bankLists[i]['price']);
            

            if(bankLists[i]['income'] === 'out') {
                third_pEl.className = 'history';
                fourth_pEl.className = 'price';
            } else {
                third_pEl.classList.remove('history');
                fourth_pEl.classList.remove('price');
                third_pEl.className = 'sender';
                fourth_pEl.className = 'remittance';
            }

            divEl2.appendChild(third_pEl);
            divEl2.appendChild(fourth_pEl);


            liEl.appendChild(divEl);
            liEl.appendChild(divEl2);
            ulEl.appendChild(liEl);
            listIndex += 1;
        } else {
            const nextLiEl = document.querySelector(`.contents__history > ul li:nth-child(${listIndex})`);
            fitst_pEl.innerHTML = bankLists[i]['history'];
            secoend_pEl.innerHTML = convert_numeric_units(bankLists[i]['price']);
            
            if(bankLists[i]['income'] === 'out') {
                totalSum += bankLists[i]['price'];
                fitst_pEl.className = 'history';
                secoend_pEl.className = 'price';
            } else {
                fitst_pEl.classList.remove('history');
                secoend_pEl.classList.remove('price');
                fitst_pEl.className = 'sender';
                secoend_pEl.className = 'remittance';
                divEl.className = 'remittance_list';
            }
            // totalSum += bankLists[i]['price']; //totalSum 누적
            divEl.appendChild(fitst_pEl);
            divEl.appendChild(secoend_pEl);
            nextLiEl.appendChild(divEl);
            
            // 당일 누적 지출 합계 출력
            nextLiEl.childNodes[0].children[1].innerHTML = `${convert_numeric_units(totalSum)}원 지출`;
        }
    }
}
