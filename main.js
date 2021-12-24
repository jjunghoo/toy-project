// 클릭 시 위아래로 움직이는 버튼형 기능으로 수정
const up_btn_wrap = document.querySelector('.up_btn_wrap');
const contents = document.querySelector('.contents');

up_btn_wrap.addEventListener('click', (e) => {
    if(e.target.parentElement.classList.contains('active') !== true) {
        contents.classList.add('active');
        contents.style.transition = '1s';
        contents.style.transform = `translateY(-211px)`;
    } else {
        contents.classList.remove('active');
        contents.style.transition = '1s';
        contents.style.transform = `translateY(0px)`;
    }
});


// 저금통 좌우 슬라이드
const slider_wrap = document.querySelector('.contents__money-box');
const slider = document.querySelector('.contents__money-box ul');
console.log(slider)
let isMouseDown = false;
let startX, scrollLeft;

slider.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    slider.classList.add('active'); 

    startX = e.pageX - slider.offsetLeft;
    console.log('slider.offsetLeft = ' + slider.offsetLeft);
    console.log('e.pageX = ' + e.pageX);
    console.log('startX = ' + startX);
    
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
    MouseDown = false;

    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * .7;
    
    slider.scrollLeft = scrollLeft - walk;
    console.log('slider.scrollLeft = ' + slider.scrollLeft);

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

    e.preventDefault();
    const x = e.pageX - main.offsetLeft;
    const walk = (x - start_x) * .7;
    
    if(e.path.includes(money_box)) {
        return;
    }
    main.scrollLeft = scroll_left - walk;
    
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
let jsons_url = ['https://gyoheonlee.github.io/mobile-bank/data/bank-me.json', 'https://gyoheonlee.github.io/mobile-bank/data/bank-mom.json'];
const sectionElems = document.getElementsByTagName('section');

function json_out () {
    jsons_url.forEach( (json_url, i) => {
        fetch(jsons_url[i])
            .then( response =>  response.json() )
            .then(obj => {start(obj, sectionElems[i])} )
            
    });
}

json_out();


// 숫자 자릿수 변환
function convert_numeric_units (number_data) {
    const num = number_data;
    const change_num = num.toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    return change_num;
}


// 랜덤 색상
function random_color() {
    const color_code = `#${Math.round(Math.random() * 0xffffff).toString(16)}`;
    return color_code;
}

function start(data, sectionElem) {


    // 계좌 정보
    console.log(data.accountId);
    const account_id = sectionElem.querySelector('.account_id');
    account_id.innerHTML = `${data.accountId}`;
    
    const account_number = sectionElem.querySelector('.account_number');
    account_number.innerHTML = `${data.accountNumber}`;
    
    const deposit = sectionElem.querySelector('.deposit');
    deposit.innerHTML = `${convert_numeric_units(data.deposit)}원`;

    // 저금통 목록 출력
    const moneyBox = sectionElem.querySelector('.contents__money-box ul');
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
        savings.style.backgroundColor = `${random_color()}`;
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
    const ulEl = sectionElem.querySelector('.contents__history > ul');
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

        const sectionEl_li = sectionElem.querySelector('.contents__history ul li');
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
                fourth_pEl.innerHTML = `+ ${convert_numeric_units(bankLists[i]['price'])}`;
            }

            divEl2.appendChild(third_pEl);
            divEl2.appendChild(fourth_pEl);


            liEl.appendChild(divEl);
            liEl.appendChild(divEl2);
            ulEl.appendChild(liEl);
            listIndex += 1;
        } else {
            const nextLiEl = sectionElem.querySelector(`.contents__history > ul li:nth-child(${listIndex})`);
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
                secoend_pEl.innerHTML = `+ ${convert_numeric_units(bankLists[i]['price'])}`;
                divEl.className = 'remittance_list';
            }
            
            divEl.appendChild(fitst_pEl);
            divEl.appendChild(secoend_pEl);
            nextLiEl.appendChild(divEl);
            
            // 당일 누적 지출 합계 출력
            nextLiEl.childNodes[0].children[1].innerHTML = `${convert_numeric_units(totalSum)}원 지출`;
        }
    }

        // 저금통 만들기
        const add_saving_btn = sectionElem.querySelector('.add_saving_box');
        const create_savings_box = sectionElem.querySelector('.create_savings_box');
        const cancel_saving_box = sectionElem.querySelector('.cancel');
        const add_savings_box = sectionElem.querySelector('.add');
        
        const savings_box_title = sectionElem.querySelector('.savings_box_title');
        const savings_box_target_amount = sectionElem.querySelector('.savings_box_target_amount');
        const savings_box_fund_amount = sectionElem.querySelector('.savings_box_fund_amount');
        console.log(savings_box_fund_amount);

        add_saving_btn.addEventListener('click', (e) => {
            create_savings_box.style.transition = '1s ease';
            create_savings_box.style.transform = 'translateY(-532px)';
        });
    
        
        cancel_saving_box.addEventListener('click', () => {
            console.log(cancel_saving_box);
            create_savings_box.style.transition = '1s';
            create_savings_box.style.transform = 'translateY(-210px)';
            savings_box_title.value = '';
            savings_box_target_amount.value = '';
        });



        
        // 저금통 확인 버튼을 클릭할 때
        add_savings_box.addEventListener('click', () => {
            console.log(savings_box_title.value);
            console.log(savings_box_target_amount.value);
            console.log(add_saving_btn);

            const new_list = document.createElement('li');
            const new_saving_box = document.createElement('div');
            const new_savings = document.createElement('div');
            const new_savings_title = document.createElement('p');
            const new_savings_fund_amount = document.createElement('p');
            

            new_savings_title.className = 'savings_title';
            new_savings_fund_amount.className = 'savings_fundAmount';
            new_savings.className = 'savings';
            new_saving_box.className = 'saving_box';


            new_savings_title.innerHTML = savings_box_title.value;
            new_savings_fund_amount.innerHTML = convert_numeric_units(savings_box_target_amount.value);
        

            new_savings.appendChild(new_savings_title);
            new_savings.appendChild(new_savings_fund_amount);
            new_savings.style.width = `calc(${savings_box_fund_amount.value} / ${savings_box_target_amount.value} * 100%)`;
            new_savings.style.backgroundColor = `${random_color()}`;


            new_saving_box.appendChild(new_savings);

            new_list.appendChild(new_saving_box);
            moneyBox.prepend(new_list);

            create_savings_box.style.transition = '1s';
            create_savings_box.style.transform = 'translateY(-210px)';

            // 추가된 저금통 위치로 슬라이더 이동           
            slider.scrollLeft = add_saving_btn.pageX;


        });

        // 저금통 만들 때 좌우 화면 슬라이드 안되게 방지
        create_savings_box.addEventListener('mousemove', () => {
            MouseDown = false;
        });
}