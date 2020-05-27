

let RANDDATA = {};

//LEFTPANRL_POSITION
let leftPostiion = (document.body.clientWidth / 2) - 425 - 251;
$('#leftOneBig').css('left',leftPostiion + 'px');

console.log(leftPostiion);


let start = parseInt(getParameterByName('from'));
let size = parseInt(getParameterByName('to')) + 1;

let limit = 0xFFFF;

Math.seedrandom();

if(!start)
    start = 0;

if(!size)
    size = start + 13;

document.getElementById('lambda').value = localStorage.getItem('lambda');
document.getElementById('time').value = localStorage.getItem('time');
document.getElementById('repeat').value = localStorage.getItem('repeat');
document.getElementById('seeds').value = localStorage.getItem('seeds');


document.getElementById('lambda').onkeyup = () => {
    draw() ;
}

document.getElementById('time').onkeyup = () => {
    draw() ;
}

let myChart;
let statChart;
let bigOne = []
let bigTwo = []

for(let i = start; i < size; ++i)
{
    bigOne.push(0);
}

draw();

function draw() {


    let borderForGraph = [];
    let colorForGraph = [];
    let dataForGraph = [];
    let dataForFunc = [];
    let labelsForGraph = [];
    for(let i = start; i < size; ++i)
    {
        dataForGraph.push(PoissonDistribution(i));
        dataForFunc.push(FunctionTeor(i))

        labelsForGraph.push(i);


        borderForGraph.push('#cfcfcf');
        colorForGraph.push('#e5e5e5');

    }

    const layout = {
        autosize: false,
        width: document.getElementById('canvas').clientWidth,
        height: document.getElementById('canvas').clientHeight,
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff',
        margin: {
            l: 70,
            r: 30,
            b: 50,
            t: 50,
            pad: 4
          },
    }

    let data1 = {
        x: labelsForGraph,
        y : dataForGraph, 
        type : 'bar', 
        name : "Теория"
    }

    let data2 = {
        x: labelsForGraph,
        y : bigOne, 
        type : 'bar', 
        name : "Практика"
    }

    Plotly.newPlot(document.getElementById('canvas'),[data1,data2],layout);

    let data3 = {
        x: labelsForGraph,
        y : dataForFunc, 
        type : 'line', 
        mode : 'lines',
        name : "Теория",
        line : { shape : 'hv' }
    }

    let data4 = {
        x: labelsForGraph,
        y : bigTwo, 
        type : 'line', 
        mode : 'lines',
        name : "Практика",
        line : { shape : 'hv' }
    }

    Plotly.newPlot(document.getElementById('statChart'),[data3,data4],layout);
    
}

document.getElementById('gen').onclick =() => {

    if(document.getElementById('gen').getAttribute('disabled'))
        return;

    localStorage.setItem('lambda',document.getElementById('lambda').value);
    localStorage.setItem('time',document.getElementById('time').value);
    localStorage.setItem('repeat',document.getElementById('repeat').value);
    localStorage.setItem('seeds',document.getElementById('seeds').value);

    let s = document.getElementById('repeat').value;
    s = parseInt(s);

    if(s === Number.NaN)
        return;

    document.getElementById('gen').setAttribute('disabled','disabled');
    generate(s);    
};


let NUM = 0;

function generate(repeat)
{

    if(repeat == 0)
    {
        document.getElementById('gen').removeAttribute('disabled');
        return;
    }

    let l = parseFloat(document.getElementById('lambda').value);
    let t = parseFloat(document.getElementById('time').value);

    if(l === Number.NaN || t === Number.NaN)
        return;


    let k = 0;


    let rand = Math.random();
    let left = 0;
    let right = Math.exp(- t * l);

    let lastP = Math.exp(- t * l);


    console.log("RAND: " + rand)

    while(rand < left || rand > right)
    {

        ++k;
        left = right;
        lastP = lastP * (l * t) / k;
        right = right + lastP;

        if(k >= limit)
            break;
    }

    if(!RANDDATA[k])
        RANDDATA[k] = 1;
    else
        RANDDATA[k] = RANDDATA[k] + 1;

    NUM++;

    let num = 0;
    let el = $('#' + k + ' .table-val');
    if(el)
    {
        num = el.html();

        num = parseInt(num) + 1;
        el.html(num);
    }


    let maxErrorI = -1;
    let maxErrorValue = -1;

    for(let i = start; i < size; ++i)
    {
        $('#' + i).removeAttr('max-error');

        let s = parseInt($('#' + i + ' .table-val').html());
        $('#' + i + ' .table-probability').html((s / NUM).toFixed(3));
        $('#' + i + ' .table-probability').attr('title',s / NUM);


        let teor = PoissonDistribution(i);
        $('#' + i + ' .table-probability-real').html(teor.toFixed(3));
        $('#' + i + ' .table-probability-real').attr('title',teor);


        let currentError = Math.abs((s / NUM) - teor);

        $('#' + i + ' .table-probability-abs').html(currentError.toFixed(3));
        $('#' + i + ' .table-probability-abs').attr('title',currentError);

        bigOne[i - start] = s / NUM;
        bigTwo[i - start] = FunctionReal(i);
    }

    for(let i in RANDDATA)
    {
        let currentError = Math.abs((RANDDATA[i] / NUM) - PoissonDistribution(i));
        if(maxErrorValue < currentError )
        {
            maxErrorValue = currentError;
            maxErrorI = i;
        }
    }

    if($('#' + maxErrorI))
    {
        $('#' + maxErrorI).attr('max-error','max-error');
    }

    $('#tabMAX .table-val').html(maxErrorValue.toFixed(3));
    $('#tabMAX .table-val').attr('title',maxErrorValue);

    console.log("X: " + k);

    draw();
    CalculateStat();


    setTimeout(() => {
        generate(repeat - 1);
    }, 20);

}

document.getElementById('seed').onclick = () => {

    if(document.getElementById('seeds').value == 'none')
        Math.seedrandom();
    else
        Math.seedrandom(document.getElementById('seeds').value);
}

    
function PoissonDistribution(k) {
    
        
    let l = parseFloat(document.getElementById('lambda').value);
    let t = parseFloat(document.getElementById('time').value);

    if(l === Number.NaN || t === Number.NaN)
        return;

    let res = (Math.pow(l * t, k)/factorial(k)) * Math.exp(- l * t);

    return res;

}

function FunctionTeor(k)
{
    let sum = 0;
    for(let i = 0; i <= k; ++i)
    {
        sum += PoissonDistribution(i);
    }

    return sum;
}

function FunctionReal(k)
{
    let s = 0;
    let n = 0;
    for(let i in RANDDATA)
    {
        if(i <= k)
            s += RANDDATA[i];

        n += RANDDATA[i];
    }

    return s / n;
}

function factorial(n) {

    if(n == 0)
        return 1;

    return factorial(n-1) * n;
}

document.getElementById('clr').onclick = () => {
    location.reload();
}

function CalculateStat()
{
    let l = parseFloat(document.getElementById('lambda').value);
    let t = parseFloat(document.getElementById('time').value);

    let E = l * t;

    

    $('#tabEeta .table-val').html(E.toFixed(3));
    $('#tabEeta .table-val').attr('title',E);

    let X = 0;
    let sum = 0;
    let n = 0;

    for(let i in RANDDATA)
    {
        sum += i * RANDDATA[i];
        n += RANDDATA[i];
    }

    X = sum / n;

    $('#tabXoverlined .table-val').html(X.toFixed(3));
    $('#tabXoverlined .table-val').attr('title',X);

    $('#tabEetaAbs .table-val').html(Math.abs(X - E).toFixed(3));
    $('#tabEetaAbs .table-val').attr('title',Math.abs(X - E));

    let D = E;

    $('#tabDeta .table-val').html(D.toFixed(3));
    $('#tabDeta .table-val').attr('title',D);

    let S = 0;
    sum = 0;

    for(let i in RANDDATA)
    {
        sum += (i - X) * (i - X) * RANDDATA[i];
    }

    S = sum / n;

    $('#tabS2 .table-val').html(S.toFixed(3));
    $('#tabS2 .table-val').attr('title',S);

    $('#tabDAbs .table-val').html(Math.abs(D - S).toFixed(3));
    $('#tabDAbs .table-val').attr('title',Math.abs(D - S));

    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;

    let arr = [];
    for(let i in RANDDATA)
    {
        max = Math.max(max, i);
        min = Math.min(min, i);

        for(let j = 0; j < RANDDATA[i]; ++j)
            arr.push(parseInt(i));
    }

    let R = max - min;

    $('#tabR .table-val').html(R.toFixed(3));
    $('#tabR .table-val').attr('title',R);

    let M;

    arr.sort((a,b) => a - b);

    if(arr.length % 2 == 0)
    {
            M = (arr[Math.floor(arr.length / 2)] + arr[Math.floor(arr.length / 2)+1]) / 2;
    }
    else
    {
            M = (arr[Math.floor(arr.length / 2)]);
    }

    $('#tabMe .table-val').html(M.toFixed(3));
    $('#tabMe .table-val').attr('title',M);

    let Dd = Number.MIN_SAFE_INTEGER;
    
    for(let j = 0; j < size; ++j)
    {
        Dd = Math.max(Dd,Math.abs(FunctionReal(j)-FunctionTeor(j)));
    }

    $('#tabD .table-val').html(Dd.toFixed(3));
    $('#tabD .table-val').attr('title',Dd);

}

document.getElementById('k').onkeyup = (e) => {
    
    let k = parseInt($('#k').val());
    if(!k)
        return;
    
    DrawZInputs(k);
    DrawQTable(k);
}


// Ty stackoverflow
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

DrawZInputs(5);
DrawQTable(5);

function DrawZInputs(n)
{
    $('#zInputs').html('');

    for(let i = 1; i < n; ++i)
    {
        let input = document.createElement('input');
        input.setAttribute('placeholder','z' + i);
        input.id = 'z' + i;
        input.value = Math.floor(i * (18) / n);
        input.setAttribute('type','text');

        $('#zInputs').append(input);
    }
}

document.getElementById('calculate').onclick = () => {

    let k = parseInt($('#k').val());
    if(!k)
        return;

    let a = 0;
    let superSum = 0;

    let Qs = [];
    for(let i = 1;i < k; ++i)
    {
        let b = parseInt($('#z'+ i).val());
        let sum = 0;

        for(let j = a; j < b; ++j)
        {
            sum += PoissonDistribution(j);
        }


        Qs.push(sum);
        superSum += sum;

        $('#q' + i + ' .table-val').html(sum.toFixed(3));
        $('#q' + i + ' .table-val').attr('title',sum);

        $('#q' + i + ' .table-head').attr('title',`${a} - ${b}`);
        a = b;
    }


    $('#q' + k + ' .table-val').html((1 - superSum).toFixed(3));
    $('#q' + k + ' .table-val').attr('title',(1 - superSum) + '');

    $('#q' + k + ' .table-head').attr('title',`${a} - inf`);
    Qs.push(1 - superSum);

    let Ns = [];

    let n = 0;
    let R0;

    a = 0;

    for(let i = 1;i < k; ++i)
    {
        let b = parseInt($('#z'+ i).val());
        let sum = 0;

        for(let j in RANDDATA)
        {
            if(a <= j && j < b)
            {
                sum += RANDDATA[j];
            }
        }
        
        Ns.push(sum);

        a = b;
    }

    let s =0;
    for(let j in RANDDATA)
    {
        if(a <= j)
        {
            s += RANDDATA[j];
        }

        n += RANDDATA[j];
    }
    
    Ns.push(s);

    console.log(Ns);

    s = 0;
    for(let i = 0;i < k; ++i)
    {
        s += (Ns[i] - n * Qs[i]) *  (Ns[i] - n * Qs[i]) / (n * Qs[i]); 
    }

    R0 = s;

    $('#tabR0 .table-val').html(R0.toFixed(3));
    $('#tabR0 .table-val').attr('title',R0 + '');

    let FR0 = 1 - Integral(0,R0,100,k-1);

    $('#tabFR0 .table-val').html(FR0.toFixed(3));
    $('#tabFR0 .table-val').attr('title',FR0 + '');

    let alpha = parseFloat($('#alpha').val());
    if(FR0 >= alpha)
    {
        $('#tabRes .table-val').html('Верно');
    }
    else
    {
        $('#tabRes .table-val').html('Нет');
    }
}

function DrawQTable(n)
{
    $('#qTable').html('');

    for(let i = 1; i <= n; ++i)
    {
        let el = document.createElement('div');
        el.className = "table-item";
        el.id = 'q' + i;

        let elh = document.createElement('div');
        elh.className = "table-head";
        elh.innerHTML = "q" + i;

        el.append(elh);

        let elv = document.createElement('div');
        elv.className = 'table-val';
        elv.innerHTML = '0';

        el.append(elv);

        $('#qTable').append(el);
    }
}

function Integral(a,b,n,k)
{
    let sum = 0;

    for(let i = 1; i <= n; ++i)
    {
        sum += (Complecated(a + (b-a)*(i-1)/n,k) + Complecated(a + (b-a)*i/n,k))*(b-a) / (2*n);
    }

    return sum;
}

function Complecated(x,r)
{
    if(x <= 0)
        return 0;

    return Math.pow(2,-r/2) * Math.pow(Gamma(r/2),-1)*Math.pow(x,r/2-1)*Math.exp(-x/2);
}

function Gamma(r)
{
    r = parseFloat(r);

    let res = 1;
    while(r != 0.5 && r != 1)
    {
        res *= (r-1);
        r = r-1;
    }

    if(r == 1)
        res *= 1;
    
    if(r == 0.5)
        res *= Math.sqrt(Math.PI);
    
    return res;
}