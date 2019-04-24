console.log('Heyaaaa')

const tab1 = document.querySelector('#tab1');
const tab2 = document.querySelector('#tab2');
const tab3 = document.querySelector('#tab3');
const tab4 = document.querySelector('#tab4');
const tab5 = document.querySelector('#tab5');

var audio1 = new Audio("rain-06.mp3");
var audio2 = new Audio("rain-01.mp3");
var audio3 = new Audio("Thunder-clap-sound.mp3");
var audio4 = new Audio("1-5-10049.mp3");

tab1.addEventListener('focus', (event) => {
    console.log('regen')
    setTimeout(function () {
        audio1.play()
    }, 1200)
});

tab1.addEventListener('blur', (event) => {
    audio1.pause();
});

tab2.addEventListener('focus', (event) => {
    console.log('regen')
    setTimeout(function () {
        audio2.play();
    }, 1200)
});

tab2.addEventListener('blur', (event) => {
    audio2.pause();
});

tab3.addEventListener('focus', (event) => {
    console.log('onweer')
    setTimeout(function () {
        audio3.play();
    }, 1200)
});

tab3.addEventListener('blur', (event) => {
    audio3.pause();
});

tab4.addEventListener('focus', (event) => {
    console.log('regen')
    setTimeout(function () {
        audio1.play()
    }, 1200)
});

tab4.addEventListener('blur', (event) => {
    audio1.pause();
});

tab5.addEventListener('focus', (event) => {
    console.log('zonning')
    setTimeout(function () {
        audio4.play()
    }, 1200)
});

tab5.addEventListener('blur', (event) => {
    audio4.pause();
});