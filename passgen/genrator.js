console.log('JS is Working 😀')
const txt = document.querySelector('.txt');
const slider = document.querySelector('#myRange');
const button = document.querySelector('button');
const counter = document.querySelector('h1');
slider.addEventListener('input', () => {
    var length = slider.value
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    txt.value = result
    counter.innerText = slider.value

    // return result;
});

button.addEventListener('click', () => {
  txt.select();
  document.execCommand("copy");
});
