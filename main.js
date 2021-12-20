let m_pos;
const account = document.querySelector('.account');
const contents = document.querySelector('contents');
const upDownBtn = document.querySelector('.up_btn_wrap');


// function resize(e){
//     let parent = dragBtn.parentNode;
//     let dx = m_pos - e.y;
//     m_pos = e.y;
//     account.style.height = (parseInt(getComputedStyle(parent, '').height) + dx) + "px";
// }

// const dragBtn = document.querySelector(".up_btn_wrap");
// dragBtn.addEventListener("mousedown", function(e){
//     m_pos = -e.y;
//     document.addEventListener("mousemove", resize, false);
// }, false);
// document.addEventListener("mouseup", function(){
//     document.removeEventListener("mousemove", resize, false);
// }, false);






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


