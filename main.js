// 클릭 시 위아래로 움직이는 버튼형 기능으로 수정
const upBtnWrap = document.querySelector(".up_btn_wrap");
const contents = document.querySelector(".contents");

upBtnWrap.addEventListener("click", (e) => {
  if (e.target.parentElement.classList.contains("active") !== true) {
    contents.classList.add("active");
    contents.style.transition = "1s";
    contents.style.transform = `translateY(-211px)`;
  } else {
    contents.classList.remove("active");
    contents.style.transition = "1s";
    contents.style.transform = `translateY(0px)`;
  }
});

// 저금통 좌우 슬라이드
const sliderWrap = document.querySelector(".contents__money-box");
const slider = document.querySelector(".contents__money-box ul");
let isMouseDown = false;
let startX, scrollLeft;

slider.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  slider.classList.add("active");
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener("mouseleave", () => {
  isMouseDown = false;
  slider.classList.remove("active");
});

slider.addEventListener("mouseup", () => {
  isMouseDown = false;
  slider.classList.remove("active");
});

slider.addEventListener("mousemove", (e) => {
  if (!isMouseDown) return;
  // 저금통 좌우 슬라이드 할 경우 main화면도 같이 슬라이드 안되게 방지
  MouseDown = false;

  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 0.7;

  slider.scrollLeft = scrollLeft - walk;
});

// 화면 좌우 슬라이드
const main = document.querySelector("main");
const sections = document.querySelectorAll("section");
const moneyBox = document.querySelector(".contents__money-box");
let MouseDown = false;
let start_x, scroll_left;

main.addEventListener("mousedown", (e) => {
  MouseDown = true;
  main.classList.add("active");
  start_x = e.pageX - main.offsetLeft;
  scroll_left = main.scrollLeft;
});

main.addEventListener("mouseleave", () => {
  MouseDown = false;
  main.classList.remove("active");
});

main.addEventListener("mouseup", () => {
  MouseDown = false;
  main.classList.remove("active");
});

main.addEventListener("mousemove", (e) => {
  if (!MouseDown) return;

  e.preventDefault();
  const x = e.pageX - main.offsetLeft;
  const walk = (x - start_x) * 0.7;

  if (e.path.includes(moneyBox)) {
    return;
  }
  main.scrollLeft = scroll_left - walk;

  for (let i = 0; i < sections.length; i++) {
    if (main.scrollLeft > main.clientWidth / 2) {
      sections[i].style.transition = "1s";
      sections[i].style.transform = `translateX(${-(
        main.clientWidth - main.scrollLeft
      )}px)`;
    } else {
      sections[i].style.transition = "1s";
      sections[i].style.transform = `translateX(${main.scrollLeft}px)`;
    }
  }
});

// JSON
const sectionElems = document.getElementsByTagName("section");
let jsonsUrl = [
  "https://gyoheonlee.github.io/mobile-bank/data/bank-me.json",
  "https://gyoheonlee.github.io/mobile-bank/data/bank-mom.json",
];

function json_out() {
  jsonsUrl.forEach((json_url, i) => {
    fetch(jsonsUrl[i])
      .then((response) => response.json())
      .then((obj) => {
        start(obj, sectionElems[i]);
      });
  });
}

json_out();

// 숫자 자릿수 변환
function convert_numeric_units(numberData) {
  const num = numberData;
  const change_num = num
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  return change_num;
}

// 랜덤 색상
function random_color() {
  const colorCode = `#${Math.round(Math.random() * 0xffffff).toString(16)}`;
  return colorCode;
}

function start(data, sectionElem) {
  // 계좌 정보
  const accountId = sectionElem.querySelector(".account_id");
  accountId.innerHTML = `${data.accountId}`;

  const accountNumber = sectionElem.querySelector(".account_number");
  accountNumber.innerHTML = `${data.accountNumber}`;

  const deposit = sectionElem.querySelector(".deposit");
  deposit.innerHTML = `${convert_numeric_units(data.deposit)}원`;

  // 저금통 목록 출력
  const moneyBoxUl = sectionElem.querySelector(".contents__money-box ul");
  data.moneyBox.reverse().forEach((moneyBox) => {
    const liEl = document.createElement("li");
    const savingBox = document.createElement("div");
    const savings = document.createElement("div");
    const savingsTitle = document.createElement("p");
    const savingsFundAmount = document.createElement("p");
    const targetAmount = moneyBox.targetAmount;

    savingsTitle.innerHTML = `${moneyBox.title}`;
    savingsTitle.className = "savings_title";

    savingsFundAmount.innerHTML = convert_numeric_units(moneyBox.fundAmount);
    savingsFundAmount.className = "savings_fundAmount";

    savings.className = "savings";
    savings.style.backgroundColor = `${random_color()}`;
    //저금통 목표금액 달성률
    savings.style.width = `calc(${moneyBox.fundAmount} / ${targetAmount} * 100%)`;
    savings.appendChild(savingsTitle);
    savings.appendChild(savingsFundAmount);

    savingBox.className = "saving_box";
    savingBox.appendChild(savings);
    liEl.appendChild(savingBox);
    moneyBoxUl.prepend(liEl);
  });

  // 소비 내역 출력
  const ulEl = sectionElem.querySelector(".contents__history > ul");
  const bankLists = data.bankList.reverse();
  let totalSum = 0;
  let listIndex = 0;

  for (let i = 0; i < bankLists.length; i++) {
    // 태그 생성
    const liEl = document.createElement("li");
    const divEl = document.createElement("div");
    const divEl2 = document.createElement("div");
    const pEl1 = document.createElement("p");
    const pEl2 = document.createElement("p");
    const pEl3 = document.createElement("p");
    const pEl4 = document.createElement("p");

    // 날짜가 틀리면 새로운 LIST 생성
    if (i === 0 || bankLists[i - 1]["date"] !== bankLists[i]["date"]) {
      // totalSum 0부터 다시 누적
      totalSum = 0;
      if (bankLists[i]["income"] === "out") {
        totalSum += bankLists[i]["price"];
      } else {
        divEl2.className = "remittance_list";
      }

      pEl1.innerHTML = bankLists[i]["date"];
      pEl1.className = "date";
      pEl2.innerHTML = `${totalSum} 원 지출`;
      pEl2.className = "today_spending";

      divEl.appendChild(pEl1);
      divEl.appendChild(pEl2);
      divEl.className = "payment_today";

      pEl3.innerHTML = bankLists[i]["history"];
      pEl4.innerHTML = convert_numeric_units(bankLists[i]["price"]);

      if (bankLists[i]["income"] === "out") {
        pEl3.className = "history";
        pEl4.className = "price";
      } else {
        pEl3.classList.remove("history");
        pEl4.classList.remove("price");
        pEl3.className = "sender";
        pEl4.className = "remittance";
        pEl4.innerHTML = `+ ${convert_numeric_units(bankLists[i]["price"])}`;
      }

      divEl2.appendChild(pEl3);
      divEl2.appendChild(pEl4);

      liEl.appendChild(divEl);
      liEl.appendChild(divEl2);
      ulEl.appendChild(liEl);
      listIndex += 1;
    } else {
      const nextLiEl = sectionElem.querySelector(
        `.contents__history > ul li:nth-child(${listIndex})`
      );
      pEl1.innerHTML = bankLists[i]["history"];
      pEl2.innerHTML = convert_numeric_units(bankLists[i]["price"]);

      if (bankLists[i]["income"] === "out") {
        totalSum += bankLists[i]["price"];
        pEl1.className = "history";
        pEl2.className = "price";
      } else {
        pEl1.classList.remove("history");
        pEl2.classList.remove("price");
        pEl1.className = "sender";
        pEl2.className = "remittance";
        pEl2.innerHTML = `+ ${convert_numeric_units(bankLists[i]["price"])}`;
        divEl.className = "remittance_list";
      }

      divEl.appendChild(pEl1);
      divEl.appendChild(pEl2);
      nextLiEl.appendChild(divEl);

      // 당일 누적 지출 합계 출력
      nextLiEl.childNodes[0].children[1].innerHTML = `${convert_numeric_units(
        totalSum
      )}원 지출`;
    }
  }

  // 저금통 만들기
  const addSavingBtn = sectionElem.querySelector(".add_saving_box");
  const createSavingsBox = sectionElem.querySelector(".create_savings_box");
  const cancelSavingBox = sectionElem.querySelector(".cancel");
  const addSavingsBox = sectionElem.querySelector(".add");
  const savingsBoxTitle = sectionElem.querySelector(".savings_box_title");
  const savingsBoxTargetAmount = sectionElem.querySelector(
    ".savings_box_target_amount"
  );
  const savingsBoxFundAmount = sectionElem.querySelector(
    ".savings_box_fund_amount"
  );

  addSavingBtn.addEventListener("click", (e) => {
    createSavingsBox.style.transition = "1s ease";
    createSavingsBox.style.transform = "translateY(-576px)";
  });

  cancelSavingBox.addEventListener("click", () => {
    createSavingsBox.style.transition = "1s";
    createSavingsBox.style.transform = "translateY(-165px)";
    savingsBoxTitle.value = "";
    savingsBoxTargetAmount.value = "";
    savingsBoxFundAmount = "";
  });

  // 저금통 확인 버튼을 클릭할 때
  addSavingsBox.addEventListener("click", () => {
    const newList = document.createElement("li");
    const newSavingBox = document.createElement("div");
    const newSavings = document.createElement("div");
    const newSavingsTitle = document.createElement("p");
    const newSavingsFundAmount = document.createElement("p");

    newSavingsTitle.className = "savings_title";
    newSavingsFundAmount.className = "savings_fundAmount";
    newSavings.className = "savings";
    newSavingBox.className = "saving_box";

    newSavingsTitle.innerHTML = savingsBoxTitle.value;
    newSavingsFundAmount.innerHTML = convert_numeric_units(
      savingsBoxTargetAmount.value
    );

    newSavings.appendChild(newSavingsTitle);
    newSavings.appendChild(newSavingsFundAmount);
    newSavings.style.width = `calc(${savingsBoxFundAmount.value} / ${savingsBoxTargetAmount.value} * 100%)`;
    newSavings.style.backgroundColor = `${random_color()}`;

    newSavingBox.appendChild(newSavings);

    newList.appendChild(newSavingBox);
    moneyBoxUl.prepend(newList);

    createSavingsBox.style.transition = "1s";
    createSavingsBox.style.transform = "translateY(-165px)";

    // 추가된 저금통 위치로 슬라이더 이동
    slider.scrollLeft = addSavingBtn.pageX;
  });

  // 저금통 만들 때 좌우 화면 슬라이드 안되게 방지
  createSavingsBox.addEventListener("mousemove", () => {
    MouseDown = false;
  });
}
